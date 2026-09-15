import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Define the Category Schema minimally to interact with it
const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    isSubcategory: Boolean,
    status: String,
    categories: Array
}, { strict: false });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema, '02_what_are_you_looking_for');

async function cleanGhostData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        console.log('Searching for ghost/orphan subcategories (isSubcategory: true)...');
        
        // Find all documents that were created as independent subcategories
        const ghosts = await Category.find({ isSubcategory: true });
        
        if (ghosts.length === 0) {
            console.log('No ghost subcategories found! Your database is clean.');
        } else {
            console.log(`Found ${ghosts.length} ghost subcategories. Deleting them now...`);
            for (const ghost of ghosts) {
                console.log(`- Deleting ghost: ${ghost.name} (Slug: ${ghost.slug})`);
                await Category.findByIdAndDelete(ghost._id);
            }
            console.log('Successfully deleted all ghost subcategories.');
        }

    } catch (error) {
        console.error('Error cleaning ghost data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    }
}

cleanGhostData();
