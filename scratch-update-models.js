const fs = require('fs');
const path = require('path');

const modelsDir = './src/backend/models';

const schemas = {
  'Category.js': { arr: 'categories', title: true, col: '02_what_are_you_looking_for' },
  'HeroBanner.js': { arr: 'banners', title: true, col: '01_hero_banners' },
  'FeatureBanner.js': { arr: 'banners', title: false, col: '02_feature_banners' },
  'ExclusiveOffer.js': { arr: 'offers', title: true, col: '03_exclusive_offers' },
  'SolarWaterSolution.js': { arr: 'solutions', title: true, col: '04_solar_water_solutions' },
  'HomeRenovation.js': { arr: 'services', title: true, col: '05_home_renovation' },
  'EssentialService.js': { arr: 'services', title: true, col: '06_essential_services' },
  'MostBookedService.js': { arr: 'services', title: true, col: '07_most_booked_services' }
};

for (const [file, config] of Object.entries(schemas)) {
    const filePath = path.join(modelsDir, file);
    const modelName = file.replace('.js', '');
    
    let content = `import mongoose from 'mongoose';\n\nconst schema = new mongoose.Schema({\n    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },\n    ${config.title ? "sectionTitle: { type: String, default: '' },\n" : ""}    ${config.arr}: { type: Array, default: [] }\n}, { timestamps: true, collection: '${config.col}' });\n\nexport default mongoose.models.${modelName} || mongoose.model('${modelName}', schema);\n`;
    
    fs.writeFileSync(filePath, content);
    console.log('Updated model:', file);
}
