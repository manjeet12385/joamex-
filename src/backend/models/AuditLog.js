import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    adminUser: {
        type: String,
        required: true,
        trim: true
    },
    action: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    ipAddress: {
        type: String,
        default: ''
    }
}, { timestamps: true });

if (mongoose.models.AuditLog) {
    delete mongoose.models.AuditLog;
}

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
