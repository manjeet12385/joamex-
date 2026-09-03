import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
dotenv.config({ path: join(__dirname, '.env.local') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/joamex';

const WhatAreYouLookingForSchema = new mongoose.Schema({
    key:   { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    route: { type: String, default: '/services' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

const WhatAreYouLookingFor = mongoose.model('WhatAreYouLookingFor', WhatAreYouLookingForSchema);

const DEFAULT_ITEMS = [
    { key: 'ac',          label: 'AC & Appliance Repair',   image: '/categories/ac-repair.png',   route: '/ac-repair',    order: 0 },
    { key: 'electrician', label: 'Electrician & Plumber',   image: '/categories/electrician.png', route: '/electrician',  order: 1 },
    { key: 'cleaning',    label: 'Cleaning & Pest Control', image: '/categories/cleaning.png',    route: '/cleaning',     order: 2 },
    { key: 'renovation',  label: 'Renovation & Interior',   image: '/categories/renovation.png',  route: '/renovation',   order: 3 },
    { key: 'fabrication', label: 'Fabrication & Roofing',   image: '/categories/fabrication.png', route: '/fabrication',  order: 4 },
    { key: 'beauty',      label: "Women's Beauty & Spa",    image: '/categories/beauty.png',      route: '/beauty',       order: 5 },
    { key: 'grooming',    label: "Men's Grooming",          image: '/categories/grooming.png',    route: '/grooming',     order: 6 },
    { key: 'homecare',    label: 'Home Care & Support',     image: '/categories/homecare.png',    route: '/homecare',     order: 7 },
    { key: 'security',    label: 'Home Security & Solar',   image: '/categories/security.png',    route: '/security',     order: 8 },
];

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log('URI:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected!\n');

        // Check existing
        const existing = await WhatAreYouLookingFor.countDocuments();
        console.log(`📊 Existing items: ${existing}`);

        if (existing > 0) {
            console.log('🗑️  Clearing old data...');
            await WhatAreYouLookingFor.deleteMany({});
        }

        console.log('🌱 Seeding 9 items...');
        const inserted = await WhatAreYouLookingFor.insertMany(DEFAULT_ITEMS);

        console.log('\n✅ SUCCESS! Items inserted:\n');
        inserted.forEach(item => {
            console.log(`  [${item.order}] ${item.label}  →  ${item.route}`);
        });

        console.log(`\n🎉 Total: ${inserted.length} items in "whatareyoulookingfors" collection`);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected.');
    }
}

seed();
