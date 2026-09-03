import mongoose from 'mongoose';

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/joamex');
        console.log('Connected to LOCAL MongoDB\n');

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('ALL Collections in localhost/joamex:');
        collections.forEach(c => console.log('  -', c.name));

        // Check whatareyoulookingfors
        const col = mongoose.connection.db.collection('whatareyoulookingfors');
        const count = await col.countDocuments();
        console.log('\nwhatareyoulookingfors count:', count);

        if (count > 0) {
            const docs = await col.find({}).toArray();
            docs.forEach(d => console.log('  [' + d.order + '] ' + d.label));
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}
check();
