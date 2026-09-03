import mongoose from 'mongoose';

const DownBanner1Schema = new mongoose.Schema({
    title:       { type: String, default: 'Professional Cleaning' },
    description: { type: String, default: '' },
    tags:        { type: [String], default: [] },
    buttonText:  { type: String, default: 'Book Now' },
    buttonLink:  { type: String, default: '/services' },
    image:       { type: String, default: '' },
    theme:       { type: String, default: 'light' }
}, { timestamps: true, collection: '08_down_banner_1' });

if (mongoose.models.DownBanner1) delete mongoose.models.DownBanner1;
export default mongoose.model('DownBanner1', DownBanner1Schema);
