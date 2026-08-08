import mongoose from 'mongoose';
import dns from 'dns';

// Set public DNS servers to resolve MongoDB Atlas SRV records properly on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

const LOCAL_URI = "mongodb://localhost:27017/joamex";
const ATLAS_URI = "mongodb+srv://joamex:joamexpass123@cluster0.foaosja.mongodb.net/joamex?authSource=admin&retryWrites=true&w=majority";

async function syncDatabase() {
    console.log("Connecting to Local Database...");
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log("✅ Connected to Local DB.");

    console.log("Connecting to Live MongoDB Atlas Database...");
    const atlasConn = await mongoose.createConnection(ATLAS_URI, {
        serverSelectionTimeoutMS: 15000
    }).asPromise();
    console.log("✅ Connected to Live Atlas DB.");

    const collections = await localConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections locally.`);

    for (const colInfo of collections) {
        const colName = colInfo.name;
        if (colName.startsWith("system.")) continue;
        
        console.log(`Syncing collection: ${colName}...`);
        
        const localDocs = await localConn.db.collection(colName).find({}).toArray();
        console.log(`- Found ${localDocs.length} documents in ${colName}`);

        if (localDocs.length > 0) {
            // Clear existing in Atlas and insert local docs
            await atlasConn.db.collection(colName).deleteMany({});
            await atlasConn.db.collection(colName).insertMany(localDocs);
            console.log(`- Successfully synced ${localDocs.length} documents to Atlas.`);
        } else {
            console.log(`- Skipped ${colName} (0 documents).`);
        }
    }

    await localConn.close();
    await atlasConn.close();
    console.log("\n🎉 Database Sync Completed Successfully!");
    process.exit(0);
}

syncDatabase().catch((err) => {
    console.error("❌ Sync Error:", err);
    process.exit(1);
});
