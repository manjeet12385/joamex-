import mongoose from 'mongoose';
import SolarWaterSolution from './src/backend/models/SolarWaterSolution.js';

async function clearSolar() {
    await mongoose.connect('mongodb://localhost:27017/joamex');
    await SolarWaterSolution.deleteMany({});
    console.log('Cleared all solar water solutions from database!');
    process.exit(0);
}

clearSolar();
