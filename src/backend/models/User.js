import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        // Optional for OAuth/Magic Link users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    profileImage: {
        type: String,
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    referralCodeUsed: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Pending'],
        default: 'Active',
    },
    otp: String,
    otpExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
}, { timestamps: true });

if (mongoose.models.User) {
    delete mongoose.models.User;
}

const User = mongoose.model('User', UserSchema);
export default User;
