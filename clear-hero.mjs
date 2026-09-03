import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    const HeroBannerSchema = new mongoose.Schema({}, { strict: false });
    const HeroBanner = mongoose.models.HeroBanner || mongoose.model('HeroBanner', HeroBannerSchema, '01_hero_banners');
    
    const result = await HeroBanner.deleteMany({});
    console.log("Deleted Hero Banners:", result.deletedCount);
    
    mongoose.disconnect();
}
run();
