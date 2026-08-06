import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userDetails: {
        name: String,
        email: String,
        phone: String,
        address: Object
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    scheduledDate: String,
    scheduledTimeSlot: String,
    partner: {
        id: String,
        name: String,
        phone: String
    }
}, { timestamps: true });

BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ category: 1 });

if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Booking;
}

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
