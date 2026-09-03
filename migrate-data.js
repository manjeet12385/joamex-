const mongoose = require('mongoose');

// Import models
const Category = require('d:/OFFICE/joamex-web-main/src/backend/models/Category').default || require('d:/OFFICE/joamex-web-main/src/backend/models/Category');
const ExclusiveOffer = require('d:/OFFICE/joamex-web-main/src/backend/models/ExclusiveOffer').default || require('d:/OFFICE/joamex-web-main/src/backend/models/ExclusiveOffer');
const FeatureBanner = require('d:/OFFICE/joamex-web-main/src/backend/models/FeatureBanner').default || require('d:/OFFICE/joamex-web-main/src/backend/models/FeatureBanner');
const HeroBanner = require('d:/OFFICE/joamex-web-main/src/backend/models/HeroBanner').default || require('d:/OFFICE/joamex-web-main/src/backend/models/HeroBanner');
const MostBookedService = require('d:/OFFICE/joamex-web-main/src/backend/models/MostBookedService').default || require('d:/OFFICE/joamex-web-main/src/backend/models/MostBookedService');
const EssentialService = require('d:/OFFICE/joamex-web-main/src/backend/models/EssentialService').default || require('d:/OFFICE/joamex-web-main/src/backend/models/EssentialService');
const HomeRenovation = require('d:/OFFICE/joamex-web-main/src/backend/models/HomeRenovation').default || require('d:/OFFICE/joamex-web-main/src/backend/models/HomeRenovation');
const SolarWaterSolution = require('d:/OFFICE/joamex-web-main/src/backend/models/SolarWaterSolution').default || require('d:/OFFICE/joamex-web-main/src/backend/models/SolarWaterSolution');

// We don't import SiteContent model, we just query the 01_hero_banner collection directly.
mongoose.connect('mongodb://127.0.0.1:27017/joamex').then(async () => {
    const db = mongoose.connection.db;
    
    // First, fetch the global document (SiteContent data) before we touch 01_hero_banners
    const siteContentDoc = await db.collection('01_hero_banner').findOne({ documentId: 'global' }) || await db.collection('01_hero_banner').findOne({ documentId: 'live' });
    
    if (!siteContentDoc || !siteContentDoc.data) {
        console.log('No SiteContent found, skipping migration');
    } else {
        const data = siteContentDoc.data;
        console.log('Migrating data...');
        
        const migrations = [
            { model: Category, dataKey: 'admin_custom_categories', arrKey: 'categories', titleKey: 'admin_categories_title', dbKey: 'sectionTitle' },
            { model: ExclusiveOffer, dataKey: 'admin_exclusive_offers', arrKey: 'offers', titleKey: 'admin_offers_title', dbKey: 'sectionTitle' },
            { model: FeatureBanner, dataKey: 'admin_feature_banners', arrKey: 'banners' },
            { model: HeroBanner, dataKey: 'admin_hero_banners', arrKey: 'banners', titleKey: 'admin_hero_title', dbKey: 'sectionTitle' },
            { model: MostBookedService, dataKey: 'admin_most_booked_services', arrKey: 'services', titleKey: 'admin_most_booked_title', dbKey: 'sectionTitle' },
            { model: EssentialService, dataKey: 'admin_essential_services', arrKey: 'services', titleKey: 'admin_essential_title', dbKey: 'sectionTitle' },
            { model: HomeRenovation, dataKey: 'admin_renovation_services', arrKey: 'services', titleKey: 'admin_renovation_title', dbKey: 'sectionTitle' },
            { model: SolarWaterSolution, dataKey: 'admin_solarwater_services', arrKey: 'solutions', titleKey: 'admin_solarwater_title', dbKey: 'sectionTitle' }
        ];

        for (const mig of migrations) {
            const items = data[mig.dataKey];
            if (items) {
                // Clear out original collection just in case it had old "single row" items
                await mig.model.deleteMany({});
                
                // Create Live
                const liveObj = { status: 'live', [mig.arrKey]: items };
                if (mig.titleKey && data[mig.titleKey]) liveObj[mig.dbKey] = data[mig.titleKey];
                await mig.model.create(liveObj);
                
                // Create Draft (same as Live initially)
                const draftObj = { status: 'draft', [mig.arrKey]: items };
                if (mig.titleKey && data[mig.titleKey]) draftObj[mig.dbKey] = data[mig.titleKey];
                await mig.model.create(draftObj);
                
                console.log('Migrated', mig.model.modelName);
            }
        }
    }
    
    // Now cleanup the duplicates
    const collectionsToDrop = [
        '02_categories', '04_feature_banners', '06_solar_water'
    ];
    for (let c of collectionsToDrop) {
        try {
            await db.dropCollection(c);
            console.log('Dropped duplicate', c);
        } catch (e) { }
    }

    console.log('Migration Complete.');
    mongoose.disconnect();
}).catch(console.error);
