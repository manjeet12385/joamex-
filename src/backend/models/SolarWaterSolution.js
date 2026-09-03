import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    status: { type: String, enum: ['live', 'draft'], required: true, default: 'live' },
    sectionTitle: { type: String, default: '' },
    solutions: { type: Array, default: [] }
}, { timestamps: true, collection: '04_solar_water_solutions' });

export default mongoose.models.SolarWaterSolution || mongoose.model('SolarWaterSolution', schema);
