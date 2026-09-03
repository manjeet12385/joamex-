import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
    title: { 
        type: String, 
        trim: true,
        default: ''
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
        default: '' 
    },
    price: { 
        type: Number
    },
    route: { 
        type: String, 
        trim: true,
        default: '' 
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
}, { timestamps: true, collection: '03_exclusive_offers' });

delete mongoose.models.Offer;
export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
