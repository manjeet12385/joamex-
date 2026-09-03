import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We must set this manually here because db.js reads it at the top level before dynamic imports might run
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/joamex";

import mongoose from 'mongoose';
import connectToDatabase from './src/backend/config/db.js';
import Category from './src/backend/models/Category.js';
import FeatureBanner from './src/backend/models/FeatureBanner.js';
import ExclusiveOffer from './src/backend/models/ExclusiveOffer.js';
import EssentialService from './src/backend/models/EssentialService.js';
import HomeRenovation from './src/backend/models/HomeRenovation.js';
import SolarWaterSolution from './src/backend/models/SolarWaterSolution.js';
import MostBookedService from './src/backend/models/MostBookedService.js';
import HeroBanner from './src/backend/models/HeroBanner.js';

async function cleanupRoutes() {
    await connectToDatabase();
    
    // Get all active category slugs
    const categories = await Category.find({});
    const allSlugs = categories.map(c => c.slug);
    
    const checkAndFixRoute = (route) => {
        if (!route) return '';
        if (route === '/services' || route === '') return route;
        
        let slugPart = route.replace('/services/', '').replace('/', '').replace('category:', '');
        
        if (!allSlugs.includes(slugPart)) {
            return ''; // Broken link -> disable
        }
        return route;
    };

    const updateSimpleModel = async (Model) => {
        if(!Model) return;
        const items = await Model.find({});
        for (let item of items) {
            const fixedRoute = checkAndFixRoute(item.route);
            if (fixedRoute !== item.route) {
                item.route = fixedRoute;
                await item.save();
                console.log(`Updated ${Model.modelName} ${item._id} route to ${fixedRoute}`);
            }
        }
    };

    await updateSimpleModel(FeatureBanner);
    await updateSimpleModel(ExclusiveOffer);
    await updateSimpleModel(EssentialService);
    await updateSimpleModel(HomeRenovation);
    await updateSimpleModel(SolarWaterSolution);
    await updateSimpleModel(MostBookedService);

    const heroBanners = await HeroBanner.find({});
    for (let hb of heroBanners) {
        let changed = false;
        for (let i = 0; i <= 3; i++) {
            if (hb[`slide${i}`] && hb[`slide${i}`].route) {
                const fixed = checkAndFixRoute(hb[`slide${i}`].route);
                if (fixed !== hb[`slide${i}`].route) {
                    hb[`slide${i}`].route = fixed;
                    changed = true;
                }
            }
        }
        if (hb.sideCards) {
            hb.sideCards.forEach(sc => {
                if (sc && sc.route) {
                    const fixed = checkAndFixRoute(sc.route);
                    if (fixed !== sc.route) {
                        sc.route = fixed;
                        changed = true;
                    }
                }
            });
        }
        if (changed) {
            hb.markModified('slide0');
            hb.markModified('slide1');
            hb.markModified('slide2');
            hb.markModified('slide3');
            hb.markModified('sideCards');
            await hb.save();
            console.log(`Updated HeroBanner ${hb._id}`);
        }
    }
    console.log('Done cleaning up routes.');
    process.exit(0);
}

cleanupRoutes().catch(console.error);
