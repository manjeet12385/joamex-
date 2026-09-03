import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
    sectionTitle: { type: String, default: '' },
    services: { type: Array, default: [] }
}, { timestamps: true, collection: '05_home_renovation' });

export default mongoose.models.HomeRenovation || mongoose.model('HomeRenovation', schema);
