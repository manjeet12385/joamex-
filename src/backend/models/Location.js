import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['City', 'Zone', 'Locality', 'Pincode'],
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null
    },
    pincode: {
        type: String,
        trim: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

if (mongoose.models.Location) {
    delete mongoose.models.Location;
}

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
