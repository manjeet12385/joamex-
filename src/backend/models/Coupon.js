import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Flat'],
        default: 'Percentage'
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required']
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

if (mongoose.models.Coupon) {
    delete mongoose.models.Coupon;
}

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
