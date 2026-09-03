import mongoose from 'mongoose';

const RENAMES = [
    { from: 'hero_banner',              to: '01_hero_banner' },
    { from: 'what_are_you_looking_for', to: '02_what_are_you_looking_for' },
    { from: 'exclusive_offers',         to: '03_exclusive_offers' },
    { from: 'solarwatersolutions',      to: '04_solar_water_solutions' },
    { from: 'homerenovation',           to: '05_home_renovation' },
    { from: 'essentialservices',        to: '06_essential_services' },
    { from: 'mostbookedservices',       to: '07_most_booked_services' },
    { from: 'downbanner1',              to: '08_down_banner_1' },
    { from: 'downbanner2',             to: '09_down_banner_2' },
];

async function main() {
    await mongoose.connect('mongodb://localhost:27017/joamex');
    console.log('Connected to LOCAL MongoDB\n');
    const db = mongoose.connection.db;
    const cols = (await db.listCollections().toArray()).map(c => c.name);

    for (const { from, to } of RENAMES) {
        if (!cols.includes(from)) {
            console.log('SKIP (not found): ' + from);
            continue;
        }
        const docs = await db.collection(from).find({}).toArray();
        if (cols.includes(to)) await db.collection(to).drop();
        if (docs.length > 0) await db.collection(to).insertMany(docs);
        else await db.createCollection(to);
        await db.collection(from).drop();
        console.log('✅ ' + from + '  →  ' + to + '  (' + docs.length + ' docs)');
    }

    console.log('\nFinal order (numbered collections):');
    const final = (await db.listCollections().toArray()).map(c => c.name).sort();
    final.forEach(n => console.log('  - ' + n));

    await mongoose.disconnect();
    console.log('\nDone! Atlas NOT touched.');
}

main();
