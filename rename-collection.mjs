import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

const DEFAULT_ITEMS = [
    { key: 'ac',          label: 'AC & Appliance Repair',   image: '/categories/ac-repair.png',   route: '/ac-repair',    order: 0 },
    { key: 'electrician', label: 'Electrician & Plumber',   image: '/categories/electrician.png', route: '/electrician',  order: 1 },
    { key: 'cleaning',    label: 'Cleaning & Pest Control', image: '/categories/cleaning.png',    route: '/cleaning',     order: 2 },
    { key: 'renovation',  label: 'Renovation & Interior',   image: '/categories/renovation.png',  route: '/renovation',   order: 3 },
    { key: 'fabrication', label: 'Fabrication & Roofing',   image: '/categories/fabrication.png', route: '/fabrication',  order: 4 },
    { key: 'beauty',      label: "Women's Beauty & Spa",    image: '/categories/beauty.png',      route: '/beauty',       order: 5 },
    { key: 'grooming',    label: "Men's Grooming",          image: '/categories/grooming.png',    route: '/grooming',     order: 6 },
    { key: 'homecare',    label: 'Home Care & Support',     image: '/categories/homecare.png',    route: '/homecare',     order: 7 },
    { key: 'security',    label: 'Home Security & Solar',   image: '/categories/security.png',    route: '/security',     order: 8 },
];

async function renameAndSeed(uri, label) {
    try {
        console.log('\n========================================');
        console.log('DB:', label);
        console.log('========================================');
        await mongoose.connect(uri);
        console.log('Connected!');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const names = collections.map(c => c.name);

        // Drop old collection if exists
        if (names.includes('whatareyoulookingfors')) {
            await db.collection('whatareyoulookingfors').drop();
            console.log('Dropped old: whatareyoulookingfors');
        }

        // Drop new collection if exists (clean slate)
        if (names.includes('sitelookingfor')) {
            await db.collection('sitelookingfor').drop();
            console.log('Dropped old: sitelookingfor');
        }

        // Insert fresh data into sitelookingfor
        const result = await db.collection('sitelookingfor').insertMany(DEFAULT_ITEMS);
        console.log('Inserted ' + result.insertedCount + ' items into sitelookingfor');

        // Show final collections
        const finalCols = await db.listCollections().toArray();
        console.log('\nFinal collections (alphabetical):');
        finalCols.map(c => c.name).sort().forEach(n => {
            const marker = n === 'sitecontents' || n === 'sitelookingfor' ? ' <---' : '';
            console.log('  - ' + n + marker);
        });

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.\n');
    }
}

async function main() {
    // 1. LOCAL
    await renameAndSeed('mongodb://localhost:27017/joamex', 'LOCAL (localhost:27017)');

    // 2. ATLAS (live)
    const atlasUri = process.env.MONGODB_URI;
    if (atlasUri) {
        await renameAndSeed(atlasUri, 'ATLAS (Live Cloud)');
    } else {
        console.log('ATLAS URI not found in .env.local — skipping Atlas');
    }

    console.log('\nDone! Refresh MongoDB Compass to see changes.');
}

main();
