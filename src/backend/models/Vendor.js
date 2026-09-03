import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
    agencyName: {
        type: String,
        required: [true, 'Please provide agency name'],
    },
    ownerName: {
        type: String,
        required: [true, 'Please provide owner name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide business email'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number'],
        unique: true,
    },
    password: {
        type: String,
    },
    gstNumber: {
        type: String,
    },
    incorporationCertificate: String,
    
    // Financial details
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,

    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'Suspended', 'Active'],
        default: 'Pending',
    },
    
    technicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    }],

    walletBalance: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

VendorSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
