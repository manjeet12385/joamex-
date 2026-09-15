import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Service name is required'], 
        trim: true
    },
    category: { 
        type: String, 
        required: [true, 'Category identifier is required'], 
        trim: true,
        index: true
    },
    subcategory: {
        type: String,
        trim: true,
        default: ''
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required']
    },
    originalPrice: { 
        type: Number 
    },
    duration: { 
        type: String, 
        trim: true,
        default: ''
    },
    badge: { 
        type: String, 
        trim: true,
        default: '' 
    },
    bestseller: { 
        type: Boolean, 
        default: false 
    },
    rating: { 
        type: String, 
        default: '4.8' 
    },
    reviews: { 
        type: String, 
        default: '100K' 
    },
    bullets: [{ 
        type: String,
        trim: true
    }],
    image: { 
        type: String, 
        default: '' 
    },
    order: { 
        type: Number, 
        default: 0 
    },
    publishStatus: {
        type: String,
        enum: ['live', 'draft', 'draft_deleted'],
        default: 'live'
    },
    liveServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        default: null
    }
}, { timestamps: true });

delete mongoose.models.Service;
export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
