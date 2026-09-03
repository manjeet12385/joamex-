import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userType: { type: String, enum: ['Partner', 'Vendor'], required: true },
    
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Withdrawal'], default: 'Withdrawal' },
    
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Processed'],
        default: 'Pending'
    },
    
    // Bank details at the time of request
    bankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String
    },
    
    adminRemarks: String,
    transactionReference: String, // Bank transfer ID

}, { timestamps: true });

WalletSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
