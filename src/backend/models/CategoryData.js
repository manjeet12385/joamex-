import mongoose from 'mongoose';

const CategoryDataSchema = new mongoose.Schema({
    categoryId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    data: { 
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

delete mongoose.models.CategoryData;
export default mongoose.models.CategoryData || mongoose.model('CategoryData', CategoryDataSchema);
