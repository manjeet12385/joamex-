import mongoose from 'mongoose';

const PayoutSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true,
    },
    partnerName: String,
    partnerEmail: String,
    partnerPhone: String,
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        default: 'Bank Transfer',
    },
    transactionId: String,
    paidAt: Date,
}, { timestamps: true });

if (mongoose.models.Payout) {
    delete mongoose.models.Payout;
}

const Payout = mongoose.model('Payout', PayoutSchema);
export default Payout;
