import mongoose from 'mongoose';
import Offer from './src/backend/models/Offer.js';

async function fixSalonOffer() {
    await mongoose.connect('mongodb://localhost:27017/joamex');
    const offer = await Offer.findOne({ title: 'salon' });
    if (offer) {
        offer.badge = '';
        offer.buttonText = '';
        offer.price = 0;
        offer.route = '';
        await offer.save();
        console.log('Fixed salon offer!');
    } else {
        console.log('Salon offer not found.');
    }
    process.exit(0);
}

fixSalonOffer();
