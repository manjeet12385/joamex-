import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String },
    role: { type: String, default: 'admin' },
    permissions: [{ type: String }],
    profileImage: { type: String },
    twoFactorEnabled: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
