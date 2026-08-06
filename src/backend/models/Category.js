import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Category name is required'], 
        trim: true,
        unique: true 
    },
    slug: { 
        type: String, 
        trim: true,
        lowercase: true 
    },
    description: { 
        type: String, 
        trim: true,
        default: '' 
    },
    icon: { 
        type: String, 
        default: '' 
    },
    image: { 
        type: String, 
        default: '' 
    },
    subcategories: [{ 
        type: String,
        trim: true
    }],
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active' 
    },
    order: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

// Auto-generate slug before saving if missing
CategorySchema.pre('save', function () {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
});

delete mongoose.models.Category;

export default mongoose.model('Category', CategorySchema);
