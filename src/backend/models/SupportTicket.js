import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        unique: true,
        required: true,
        default: () => 'TKT-' + Math.floor(100000 + Math.random() * 900000).toString()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    userName: String,
    userEmail: String,
    userPhone: String,
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Initial message is required']
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    messages: [{
        sender: {
            type: String,
            enum: ['Admin', 'User', 'System'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

if (mongoose.models.SupportTicket) {
    delete mongoose.models.SupportTicket;
}

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
