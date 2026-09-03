import mongoose from 'mongoose';

const BANNER1_DATA = {
    title: 'Professional Cleaning',
    description: 'Get your home serviced and spotless with our expert deep cleaning services. Eco-friendly products and certified professionals.',
    tags: ['Cockroach Control', 'Bed Bug Treatment', 'Mosquito Mesh'],
    buttonText: 'Book Now',
    buttonLink: '/cleaning',
    image: '/banners/cleaning-banner.jpg',
    theme: 'light'
};

const BANNER2_DATA = {
    title: "Men's Grooming & Massage",
    description: 'Luxury salon experience at home. Expert stylists and professional massage therapists at your service.',
    tags: ['Hair & Styling', 'Facial & Skincare', 'Body Spa'],
    buttonText: 'Book Now',
    buttonLink: '/grooming',
    image: '/banners/grooming-banner.jpg',
    theme: 'dark'
};

async function seedBanner(db, collectionName, data) {
    const exists = await db.listCollections({ name: collectionName }).toArray();
    if (exists.length > 0) {
        await db.collection(collectionName).drop();
        console.log('  Dropped old:', collectionName);
    }
    await db.collection(collectionName).insertOne(data);
    console.log('  Inserted into:', collectionName);
    console.log('    Title:', data.title);
    console.log('    Tags:', data.tags.join(', '));
    console.log('    Theme:', data.theme);
}

async function main() {
    console.log('Connecting to LOCAL MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/joamex');
    console.log('Connected!\n');

    const db = mongoose.connection.db;

    console.log('[1] Down Banner 1 → downbanner1');
    await seedBanner(db, 'downbanner1', BANNER1_DATA);

    console.log('\n[2] Down Banner 2 → downbanner2');
    await seedBanner(db, 'downbanner2', BANNER2_DATA);

    // Show relevant collections
    const all = (await db.listCollections().toArray()).map(c => c.name).sort();
    console.log('\nAll collections (alphabetical):');
    const highlight = ['mostbookedservices', 'downbanner1', 'downbanner2'];
    all.forEach(n => {
        const mark = highlight.includes(n) ? ' <---' : '';
        console.log('  - ' + n + mark);
    });

    await mongoose.disconnect();
    console.log('\nDone! Atlas NOT touched.');
}

main();
