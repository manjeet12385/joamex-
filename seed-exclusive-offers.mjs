import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

const DEFAULT_OFFERS = [
    {
        title: 'Salon for Women',
        description: 'Save up to 40% OFF',
        image: '/offers/salon.jpg',
        badge: 'TRENDING',
        badgeColor: '#FF4757',
        buttonText: 'Explore',
        buttonColor: '#FF4757',
        route: '/salon',
        order: 0,
        isActive: true
    },
    {
        title: 'Home Cleaning',
        description: 'Up to 40% OFF on Deep Cleaning',
        image: '/offers/cleaning.jpg',
        badge: 'POPULAR',
        badgeColor: '#8B5CF6',
        buttonText: 'Explore',
        buttonColor: '#8B5CF6',
        route: '/cleaning',
        order: 1,
        isActive: true
    },
    {
        title: 'Plumbing',
        description: 'Expert Plumbing Services',
        image: '/offers/plumbing.jpg',
        badge: 'NEW',
        badgeColor: '#0D9488',
        buttonText: 'Explore',
        buttonColor: '#0D9488',
        route: '/plumbing',
        order: 2,
        isActive: true
    },
    {
        title: 'AC Service & Repair',
        description: 'Up to 30% OFF',
        image: '/offers/ac.jpg',
        badge: 'HOT DEAL',
        badgeColor: '#16A34A',
        buttonText: 'Explore',
        buttonColor: '#16A34A',
        route: '/ac-repair',
        order: 3,
        isActive: true
    },
    {
        title: 'Electrician',
        description: 'Top Electrical Services',
        image: '/offers/electrician.jpg',
        badge: 'BEST VALUE',
        badgeColor: '#F97316',
        buttonText: 'Explore',
        buttonColor: '#F97316',
        route: '/electrician',
        order: 4,
        isActive: true
    },
];

async function seedDB(uri, label) {
    try {
        console.log('\n========================================');
        console.log('DB:', label);
        console.log('========================================');
        await mongoose.connect(uri);
        console.log('Connected!');

        const db = mongoose.connection.db;

        // Drop existing if any
        const cols = await db.listCollections({ name: 'exclusiveoffers' }).toArray();
        if (cols.length > 0) {
            await db.collection('exclusiveoffers').drop();
            console.log('Dropped old exclusiveoffers');
        }

        // Insert fresh data
        const result = await db.collection('exclusiveoffers').insertMany(DEFAULT_OFFERS);
        console.log('Inserted ' + result.insertedCount + ' offers into exclusiveoffers\n');

        DEFAULT_OFFERS.forEach(o => {
            console.log('  [' + o.order + '] ' + o.badge + ' | ' + o.title + ' — ' + o.description);
        });

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from ' + label);
    }
}

async function main() {
    // LOCAL
    await seedDB('mongodb://localhost:27017/joamex', 'LOCAL (localhost:27017)');

    // ATLAS
    const atlasUri = process.env.MONGODB_URI;
    if (atlasUri) {
        await seedDB(atlasUri, 'ATLAS (Live Cloud)');
    } else {
        console.log('\nATLAS URI not found — skipped');
    }

    console.log('\n✅ Done! exclusiveoffers collection ready in both databases.');
}

main();
