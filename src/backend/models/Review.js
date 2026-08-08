import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userName: String,
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
    },
    partnerName: String,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: String,
    status: {
        type: String,
        enum: ['Approved', 'Hidden'],
        default: 'Approved',
    },
}, { timestamps: true });

if (mongoose.models.Review) {
    delete mongoose.models.Review;
}

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
