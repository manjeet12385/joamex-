import mongoose from 'mongoose';
import Offer from './src/backend/models/Offer.js';

async function fixImage() {
    await mongoose.connect('mongodb://localhost:27017/joamex');
    const offer = await Offer.findOne({ title: 'Salon for Women' });
    if (offer && offer.image.includes('justdial')) {
        offer.image = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
        await offer.save();
        console.log('Fixed broken image!');
    } else {
        console.log('No broken image found or already fixed.');
    }
    process.exit(0);
}

fixImage();
