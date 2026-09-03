import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
    sectionTitle: { type: String, default: '' },
    categories: { type: Array, default: [] }
}, { timestamps: true, collection: '02_what_are_you_looking_for' });

export default mongoose.models.Category || mongoose.model('Category', schema);
