const mongoose = require('mongoose');

async function check() {
    const mongoUri = 'mongodb+srv://divyanshiverma484:Verma484@cluster0.p711r.mongodb.net/test?retryWrites=true&w=majority';
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');
        
        const otps = await mongoose.connection.db.collection('otps').find({}).toArray();
        console.log('OTPs in DB:', otps);
        
        const partners = await mongoose.connection.db.collection('partners').find({}).toArray();
        console.log('Partners in DB:', partners.map(p => ({ fullName: p.fullName, phoneNumber: p.phoneNumber })));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
