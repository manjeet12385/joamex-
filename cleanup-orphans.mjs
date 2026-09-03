import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/joamex';

async function cleanupOrphans() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.\n');

        const db = mongoose.connection.db;
        const collection = db.collection('02_what_are_you_looking_for');

        // Step 1: Get all main categories (isSubcategory != true)
        const mainCategories = await collection.find({ isSubcategory: { $ne: true } }).toArray();
        console.log(`Found ${mainCategories.length} Main Categories.`);

        // Step 2: Collect all valid subcategory slugs/names from all parents
        const validSubSlugs = new Set();
        const validSubNames = new Set();

        mainCategories.forEach(cat => {
            if (Array.isArray(cat.subcategories)) {
                cat.subcategories.forEach(sub => {
                    if (typeof sub === 'string') {
                        validSubNames.add(sub.toLowerCase());
                        validSubSlugs.add(sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    } else if (typeof sub === 'object' && sub !== null) {
                        if (sub.slug) validSubSlugs.add(sub.slug.toLowerCase());
                        if (sub.name) validSubNames.add(sub.name.toLowerCase());
                    }
                });
            }
        });

        // Step 3: Find all documents that are flagged as subcategories
        const allSubDocs = await collection.find({ isSubcategory: true }).toArray();
        console.log(`Found ${allSubDocs.length} Subcategory Documents in Database.`);

        // Step 4: Find orphans
        const orphansToDelete = [];
        allSubDocs.forEach(doc => {
            const slugMatch = doc.slug && validSubSlugs.has(doc.slug.toLowerCase());
            const nameMatch = doc.name && validSubNames.has(doc.name.toLowerCase());

            if (!slugMatch && !nameMatch) {
                orphansToDelete.push(doc._id);
                console.log(`- Identified Orphan: "${doc.name}" (Slug: ${doc.slug})`);
            }
        });

        if (orphansToDelete.length > 0) {
            console.log(`\nDeleting ${orphansToDelete.length} orphaned subcategories...`);
            const result = await collection.deleteMany({ _id: { $in: orphansToDelete } });
            console.log(`✅ Deleted ${result.deletedCount} orphans successfully!`);
        } else {
            console.log('\n✅ No orphaned subcategories found. Database is already clean!');
        }

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    }
}

cleanupOrphans();
