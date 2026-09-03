import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
    sectionTitle: { type: String, default: '' },
    services: { type: Array, default: [] }
}, { timestamps: true, collection: '07_most_booked_services' });

export default mongoose.models.MostBookedService || mongoose.model('MostBookedService', schema);
