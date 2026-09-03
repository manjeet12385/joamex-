import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
    sectionTitle: { type: String, default: '' },
    banners: { type: Array, default: [] }
}, { timestamps: true, collection: '01_hero_banners' });

export default mongoose.models.HeroBanner || mongoose.model('HeroBanner', schema);
