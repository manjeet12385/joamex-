import mongoose from 'mongoose';

const SectionTitlesSchema = new mongoose.Schema({
    status:      { type: String, enum: ['live', 'draft'], default: 'live' },
    most_booked: { type: String, default: 'Most Booked Services' },
    essential:   { type: String, default: 'Essential Services' },
    renovation:  { type: String, default: 'Home Renovation Services' },
    solarwater:  { type: String, default: 'Solar & Water Solutions' },
    offers:      { type: String, default: 'Exclusive Offers' },
}, { timestamps: true, collection: 'section_titles' });

delete mongoose.models.SectionTitles;
export default mongoose.models.SectionTitles || mongoose.model('SectionTitles', SectionTitlesSchema);
