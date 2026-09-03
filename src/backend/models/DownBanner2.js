import mongoose from 'mongoose';

const DownBanner2Schema = new mongoose.Schema({
    title:       { type: String, default: "Men's Grooming & Massage" },
    description: { type: String, default: '' },
    tags:        { type: [String], default: [] },
    buttonText:  { type: String, default: 'Book Now' },
    buttonLink:  { type: String, default: '/services' },
    image:       { type: String, default: '' },
    theme:       { type: String, default: 'dark' }
}, { timestamps: true, collection: '09_down_banner_2' });

if (mongoose.models.DownBanner2) delete mongoose.models.DownBanner2;
export default mongoose.model('DownBanner2', DownBanner2Schema);
