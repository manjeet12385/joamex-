require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Offer = require('./src/backend/models/Offer.js').default || require('./src/backend/models/Offer.js');
    const res = await Offer.updateMany({price: 0}, {$unset: {price: ''}});
    console.log('Removed price=0 from Exclusive Offers', res);
    process.exit(0);
});
