import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    // Define minimal schemas for the collections to clear
    const schemas = {
        'Category': '02_categories',
        'Offer': '03_exclusive_offers',
        'FeatureBanner': '04_feature_banners',
        'HomeRenovation': '05_home_renovation',
        'SolarWater': '06_solar_water',
        'MostBookedService': '07_most_booked_services',
        'EssentialService': '08_essential_services'
    };
    
    for (const [modelName, collectionName] of Object.entries(schemas)) {
        const Schema = new mongoose.Schema({}, { strict: false });
        const Model = mongoose.models[modelName] || mongoose.model(modelName, Schema, collectionName);
        const result = await Model.deleteMany({});
        console.log(`Deleted ${result.deletedCount} items from ${collectionName}`);
    }
    
    mongoose.disconnect();
}
run();
