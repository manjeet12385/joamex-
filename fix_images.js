import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/joamex';

const imageMap = {
    // Most Booked Services (07_most_booked_services)
    '/mostbooked/ac-gas.jpg': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
    '/mostbooked/bathroom.jpg': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
    '/mostbooked/switch.jpg': 'https://images.unsplash.com/photo-1558522195-e1201b090344?w=500&q=80',
    '/mostbooked/flush.jpg': 'https://images.unsplash.com/photo-1585806653063-8a39a0937b2d?w=500&q=80',
    '/mostbooked/washing.jpg': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80',

    // Essential Services (06_essential_services)
    '/essential/fridge.jpg': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80',
    '/essential/geyser.jpg': 'https://images.unsplash.com/photo-1585806653063-8a39a0937b2d?w=500&q=80',
    '/essential/ro.jpg': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
    '/essential/gas-stove.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80',

    // Home Renovation (05_home_renovation)
    '/renovation/bathroom.jpg': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
    '/renovation/painter.jpg': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80',
    '/renovation/waterproofing.jpg': 'https://images.unsplash.com/photo-1504307651254-35680f356fce?w=500&q=80',
    '/renovation/civil.jpg': 'https://images.unsplash.com/photo-1504307651254-35680f356fce?w=500&q=80',

    // Solar Water Solutions (04_solar_water_solutions)
    '/solar/solar-panels.jpg': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80',
    '/solar/solar-heater.jpg': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80',
    '/solar/borewell.jpg': 'https://images.unsplash.com/photo-1585806653063-8a39a0937b2d?w=500&q=80',
    '/solar/tank-cleaning.jpg': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',

    // Exclusive Offers (03_exclusive_offers)
    '/offers/salon.jpg': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',
    '/offers/cleaning.jpg': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80',
    '/offers/plumbing.jpg': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
    '/offers/ac.jpg': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
    '/offers/electrician.jpg': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',

    // Feature Banners (02_feature_banners)
    '/banners/cleaning.jpg': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    '/banners/ac.jpg': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80'
};

async function fixImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const collections = [
            { name: '07_most_booked_services', label: 'MostBookedServices' },
            { name: '06_essential_services', label: 'EssentialServices' },
            { name: '05_home_renovation', label: 'HomeRenovation' },
            { name: '04_solar_water_solutions', label: 'SolarWaterSolutions' },
            { name: '03_exclusive_offers', label: 'ExclusiveOffers' },
            { name: '02_feature_banners', label: 'FeatureBanners' }
        ];

        let totalUpdated = 0;

        for (const col of collections) {
            const collection = mongoose.connection.collection(col.name);
            const docs = await collection.find({}).toArray();
            
            let updated = 0;
            for (let doc of docs) {
                if (doc.image && imageMap[doc.image]) {
                    await collection.updateOne({ _id: doc._id }, { $set: { image: imageMap[doc.image] } });
                    updated++;
                    totalUpdated++;
                }
            }
            console.log(`[${col.label}] Checked ${docs.length} docs, updated ${updated} images.`);
        }

        console.log(`Total images patched: ${totalUpdated}`);
        console.log('All image links have been updated to working internet URLs!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixImages();
