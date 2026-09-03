import mongoose from 'mongoose';

async function main() {
    await mongoose.connect('mongodb://localhost:27017/joamex');
    console.log('Connected to LOCAL MongoDB\n');

    const db = mongoose.connection.db;
    const colNames = (await db.listCollections().toArray()).map(c => c.name);

    // Check if sitecontents exists
    if (colNames.includes('sitecontents')) {
        // Copy all documents from sitecontents to hero_banner
        const docs = await db.collection('sitecontents').find({}).toArray();
        console.log('Found ' + docs.length + ' document(s) in sitecontents');

        // Drop hero_banner if already exists
        if (colNames.includes('hero_banner')) {
            await db.collection('hero_banner').drop();
            console.log('Dropped old hero_banner');
        }

        if (docs.length > 0) {
            await db.collection('hero_banner').insertMany(docs);
            console.log('Copied ' + docs.length + ' document(s) to hero_banner');
        } else {
            // Create empty collection
            await db.createCollection('hero_banner');
            console.log('Created empty hero_banner collection');
        }

        // Drop old sitecontents
        await db.collection('sitecontents').drop();
        console.log('Dropped old: sitecontents');
    } else if (!colNames.includes('hero_banner')) {
        // Neither exists — create fresh
        await db.createCollection('hero_banner');
        console.log('Created fresh hero_banner collection (sitecontents was not found)');
    } else {
        console.log('hero_banner already exists, sitecontents not found — nothing to do');
    }

    // Final list
    const final = (await db.listCollections().toArray()).map(c => c.name).sort();
    console.log('\nFinal collections:');
    final.forEach(n => {
        const mark = n === 'hero_banner' ? ' <--- RENAMED!' : '';
        console.log('  - ' + n + mark);
    });

    await mongoose.disconnect();
    console.log('\nDone! Atlas NOT touched.');
}

main();
