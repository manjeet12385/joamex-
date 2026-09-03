import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: { type: String }, // Can be customer, partner, or vendor
    userType: { type: String, enum: ['Customer', 'Partner', 'Vendor', 'Admin'] },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Credit', 'Debit'], required: true },
    
    // E.g., 'Job Payout', 'Commission Cut', 'Withdrawal', 'Customer Payment'
    description: { type: String },
    
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    
    // For tracking external gateways like Razorpay/Stripe
    gatewayTransactionId: { type: String },
    paymentMethod: { type: String },

}, { timestamps: true });

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ bookingId: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
