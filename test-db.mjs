import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
    try {
        console.log("Attempting to connect to MongoDB...");
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("No MONGODB_URI found in .env.local");
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log("✅ Successfully connected to the database!");
        
        // Optional: Count collections or something to verify read access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✅ Database is accessible. Found ${collections.length} collections.`);
        
        await mongoose.disconnect();
        console.log("✅ Connection closed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
}

testConnection();
