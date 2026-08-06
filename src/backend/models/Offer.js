import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Offer title is required'], 
        trim: true
    },
    subtitle: { 
        type: String, 
        trim: true,
        default: '' 
    },
    badge: { 
        type: String, 
        trim: true,
        default: '' 
    },
    buttonText: { 
        type: String, 
        trim: true,
        default: 'Explore →' 
    },
    price: { 
        type: Number, 
        default: 0 
    },
    route: { 
        type: String, 
        trim: true,
        default: '/services' 
    },
    image: { 
        type: String, 
        default: '' 
    },
    bgColor: {
        type: String,
        default: '#FCE4EC'
    },
    textColor: {
        type: String,
        default: '#C2185B'
    },
    order: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

delete mongoose.models.Offer;
export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
