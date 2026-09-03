import mongoose from 'mongoose';

const DEFAULT_OFFERS = [
    { title: 'Salon for Women',     description: 'Save up to 40% OFF',            image: '/offers/salon.jpg',       badge: 'TRENDING',   badgeColor: '#FF4757', buttonText: 'Explore', buttonColor: '#FF4757', route: '/salon',       order: 0, isActive: true },
    { title: 'Home Cleaning',       description: 'Up to 40% OFF on Deep Cleaning', image: '/offers/cleaning.jpg',    badge: 'POPULAR',    badgeColor: '#8B5CF6', buttonText: 'Explore', buttonColor: '#8B5CF6', route: '/cleaning',    order: 1, isActive: true },
    { title: 'Plumbing',            description: 'Expert Plumbing Services',        image: '/offers/plumbing.jpg',    badge: 'NEW',        badgeColor: '#0D9488', buttonText: 'Explore', buttonColor: '#0D9488', route: '/plumbing',    order: 2, isActive: true },
    { title: 'AC Service & Repair', description: 'Up to 30% OFF',                  image: '/offers/ac.jpg',          badge: 'HOT DEAL',   badgeColor: '#16A34A', buttonText: 'Explore', buttonColor: '#16A34A', route: '/ac-repair',   order: 3, isActive: true },
    { title: 'Electrician',         description: 'Top Electrical Services',         image: '/offers/electrician.jpg', badge: 'BEST VALUE', badgeColor: '#F97316', buttonText: 'Explore', buttonColor: '#F97316', route: '/electrician', order: 4, isActive: true },
];

async function main() {
    await mongoose.connect('mongodb://localhost:27017/joamex');
    console.log('Connected to LOCAL MongoDB\n');

    const db = mongoose.connection.db;
    const cols = (await db.listCollections().toArray()).map(c => c.name);

    // Drop old collections
    for (const name of ['siteexclusiveoffers', 'siteoffers']) {
        if (cols.includes(name)) {
            await db.collection(name).drop();
            console.log('Dropped:', name);
        }
    }

    // Insert into siteoffers
    const result = await db.collection('siteoffers').insertMany(DEFAULT_OFFERS);
    console.log('\nInserted ' + result.insertedCount + ' offers into siteoffers\n');

    // Show final alphabetical order
    const final = (await db.listCollections().toArray()).map(c => c.name).sort();
    console.log('Final collections order:');
    final.forEach(n => {
        const mark = ['sitecontents','sitelookingfor','siteoffers'].includes(n) ? ' <---' : '';
        console.log('  - ' + n + mark);
    });

    await mongoose.disconnect();
    console.log('\nDone! Atlas NOT touched.');
}

main();
