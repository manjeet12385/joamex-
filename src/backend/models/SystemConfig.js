import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
    serviceRadius: { type: Number, default: 25 },
    commissionPercentage: { type: Number, default: 12 },
    maintenanceMode: { type: Boolean, default: false },
    activeCoupons: { type: Number, default: 0 },
    surgePricingActive: { type: Boolean, default: false },
    surgeMultiplier: { type: Number, default: 1.0 },
    nightSurgeMultiplier: { type: Number, default: 1.5 },
}, { timestamps: true });

export default mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
