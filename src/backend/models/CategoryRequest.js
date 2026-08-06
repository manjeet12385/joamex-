import mongoose from 'mongoose';

const CategoryRequestSchema = new mongoose.Schema({
    partnerId: {
        type: String,
        required: true,
        ref: 'Partner'
    },
    partnerName: {
        type: String,
        default: 'Partner User'
    },
    partnerEmail: String,
    partnerPhone: String,
    categoryName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    adminRemark: String,
}, { timestamps: true });

CategoryRequestSchema.index({ partnerId: 1, status: 1 });
CategoryRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.CategoryRequest || mongoose.model('CategoryRequest', CategoryRequestSchema);
