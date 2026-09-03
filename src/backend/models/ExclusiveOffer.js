import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
    sectionTitle: { type: String, default: '' },
    offers: { type: Array, default: [] }
}, { timestamps: true, collection: '03_exclusive_offers' });

export default mongoose.models.ExclusiveOffer || mongoose.model('ExclusiveOffer', schema);
