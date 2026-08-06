import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide full legal name'],
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
    experience: {
        type: String,
        enum: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'],
        default: 'Less than 1 year',
    },
    serviceCategory: {
        type: String,
        required: [true, 'Please select a service category'],
    },

    idCardFront: String,
    idCardBack: String,
    professionalLicense: String,

    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,

    profileImage: String,
    secondaryEmail: String,
    timezone: { type: String, default: 'UTC-05:00 (Eastern Time)' },
    language: { type: String, default: 'English (US)' },

    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'Suspended', 'Active'],
        default: 'Pending',
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    otp: String,
    otpExpiry: Date,

}, { timestamps: true });

PartnerSchema.index({ status: 1, createdAt: -1 });
PartnerSchema.index({ serviceCategory: 1 });

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
