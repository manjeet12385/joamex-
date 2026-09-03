import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
        banners: { type: Array, default: [] }
}, { timestamps: true, collection: '02_feature_banners' });

export default mongoose.models.FeatureBanner || mongoose.model('FeatureBanner', schema);
