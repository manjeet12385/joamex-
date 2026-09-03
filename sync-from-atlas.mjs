import mongoose from 'mongoose';
import dns from 'dns';

// Set public DNS servers to resolve MongoDB Atlas SRV records properly on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

const LOCAL_URI = "mongodb://localhost:27017/joamex";
const ATLAS_URI = "mongodb+srv://joamex:joamexpass123@cluster0.foaosja.mongodb.net/joamex?authSource=admin&retryWrites=true&w=majority";

async function syncFromAtlas() {
    console.log("Connecting to Live MongoDB Atlas Database...");
    const atlasConn = await mongoose.createConnection(ATLAS_URI, {
        serverSelectionTimeoutMS: 15000
    }).asPromise();
    console.log("✅ Connected to Live Atlas DB.");

    console.log("Connecting to Local Database...");
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log("✅ Connected to Local DB.");

    const collections = await atlasConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in Atlas.`);

    for (const colInfo of collections) {
        const colName = colInfo.name;
        if (colName.startsWith("system.")) continue;
        
        console.log(`Syncing collection: ${colName}...`);
        
        const atlasDocs = await atlasConn.db.collection(colName).find({}).toArray();
        console.log(`- Found ${atlasDocs.length} documents in Atlas ${colName}`);

        if (atlasDocs.length > 0) {
            // Clear existing locally and insert atlas docs
            await localConn.db.collection(colName).deleteMany({});
            await localConn.db.collection(colName).insertMany(atlasDocs);
            console.log(`- Successfully synced ${atlasDocs.length} documents to Local DB.`);
        } else {
            console.log(`- Skipped ${colName} (0 documents).`);
        }
    }

    await localConn.close();
    await atlasConn.close();
    console.log("\n🎉 Database Restore/Sync Completed Successfully!");
    process.exit(0);
}

syncFromAtlas().catch((err) => {
    console.error("❌ Restore Error:", err);
    process.exit(1);
});
