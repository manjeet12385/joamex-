// ============================================
// 🚀 SYNC LOCAL → ATLAS
// Run: node sync-to-atlas.mjs
// Kab use karo: Jab website live karna ho
// ============================================

import { MongoClient } from 'mongodb';

const LOCAL_URI = 'mongodb://localhost:27017/joamex';
const ATLAS_URI = 'mongodb://joamex:joamexpass123@ac-rmssebe-shard-00-00.foaosja.mongodb.net:27017,ac-rmssebe-shard-00-01.foaosja.mongodb.net:27017,ac-rmssebe-shard-00-02.foaosja.mongodb.net:27017/joamex?ssl=true&replicaSet=atlas-x4zbb4-shard-0&authSource=admin&retryWrites=true&w=majority';

// Ye collections sync hongi local → Atlas
const COLLECTIONS_TO_SYNC = [
    '01_hero_banners',
    '02_feature_banners',
    '02_what_are_you_looking_for',
    '03_exclusive_offers',
    '04_solar_water_solutions',
    '05_home_renovation',
    '06_essential_services',
    '07_most_booked_services',
    '08_down_banner_1',
    '09_down_banner_2',
    'section_titles',
    'categorydatas',
    'admins',
    'systemconfigs',
];

async function syncToAtlas() {
    const localClient = new MongoClient(LOCAL_URI);
    const atlasClient = new MongoClient(ATLAS_URI);

    try {
        await localClient.connect();
        await atlasClient.connect();
        console.log('✅ Dono databases se connect ho gaya!\n');

        const localDb = localClient.db('joamex');
        const atlasDb = atlasClient.db('joamex');

        let totalSynced = 0;

        for (const colName of COLLECTIONS_TO_SYNC) {
            try {
                const localDocs = await localDb.collection(colName).find({}).toArray();
                
                if (localDocs.length === 0) {
                    console.log(`⏭️  ${colName}: local mein khali — skip`);
                    continue;
                }

                // Atlas mein purana data hatao
                await atlasDb.collection(colName).deleteMany({});
                // Local ka data daalo
                await atlasDb.collection(colName).insertMany(localDocs);
                
                console.log(`✅ ${colName}: ${localDocs.length} document(s) synced → Atlas`);
                totalSynced += localDocs.length;
            } catch (err) {
                console.log(`⚠️  ${colName}: ${err.message}`);
            }
        }

        console.log(`\n🎉 Total ${totalSynced} documents synced LOCAL → ATLAS!`);
        console.log('🌐 Ab website live pe bhi updated data dikhega!\n');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await localClient.close();
        await atlasClient.close();
    }
}

syncToAtlas();
