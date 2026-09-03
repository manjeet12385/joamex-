import mongoose from 'mongoose';

const SOLAR_DATA = [
    { title: 'Solar Panels',           subtitle: 'Installation & Maintenance',   image: '/solar/solar-panels.jpg',  route: '/solar-panels',  order: 0, isActive: true },
    { title: 'Solar Water Heaters',    subtitle: 'Eco-friendly heating systems', image: '/solar/solar-heater.jpg',  route: '/solar-heaters', order: 1, isActive: true },
    { title: 'Borewell & Water Pumps', subtitle: 'Pumping & drilling services',  image: '/solar/borewell.jpg',      route: '/borewell',      order: 2, isActive: true },
    { title: 'Water Tank Cleaning',    subtitle: 'Deep cleaning & disinfection', image: '/solar/tank-cleaning.jpg', route: '/tank-cleaning', order: 3, isActive: true },
];

const RENOVATION_DATA = [
    { title: 'Bathroom Renovation', subtitle: 'Full bathroom makeover',       image: '/renovation/bathroom.jpg',   route: '/bathroom-renovation', order: 0, isActive: true },
    { title: 'Painter',             subtitle: 'Interior & exterior painting', image: '/renovation/painter.jpg',    route: '/painter',             order: 1, isActive: true },
    { title: 'Waterproofing',       subtitle: 'Leak-proof solutions',         image: '/renovation/waterproof.jpg', route: '/waterproofing',       order: 2, isActive: true },
    { title: 'Civil Works',         subtitle: 'Structural & civil services',  image: '/renovation/civil.jpg',      route: '/civil-works',         order: 3, isActive: true },
];

const ESSENTIAL_DATA = [
    { title: 'Refrigerator',      subtitle: 'Repair & Gas refill',    image: '/essential/fridge.jpg',    price: '₹899',  route: '/refrigerator',  order: 0, isActive: true },
    { title: 'Geyser',            subtitle: 'Service & Installation', image: '/essential/geyser.jpg',    price: '₹699',  route: '/geyser',         order: 1, isActive: true },
    { title: 'RO Water Purifier', subtitle: 'Repair & Service',       image: '/essential/ro.jpg',        price: '₹799',  route: '/ro-purifier',    order: 2, isActive: true },
    { title: 'Gas Stove',         subtitle: 'Sales & Servicing',      image: '/essential/gas-stove.jpg', price: '₹599',  route: '/gas-stove',      order: 3, isActive: true },
];

const MOSTBOOKED_DATA = [
    { title: 'AC Gas Refilling',       subtitle: 'Quick AC gas top-up',    image: '/mostbooked/ac-gas.jpg',   price: '₹1,299', route: '/ac-gas-refilling',  order: 0, isActive: true },
    { title: 'Bathroom Deep Cleaning', subtitle: 'Sanitize & deep clean',  image: '/mostbooked/bathroom.jpg', price: '₹499',   route: '/bathroom-cleaning', order: 1, isActive: true },
    { title: 'Switch Repair',          subtitle: 'Electrical switch fix',  image: '/mostbooked/switch.jpg',   price: '₹99',    route: '/switch-repair',     order: 2, isActive: true },
    { title: 'Flush Repair',           subtitle: 'Flush tank & valve fix', image: '/mostbooked/flush.jpg',    price: '₹149',   route: '/flush-repair',      order: 3, isActive: true },
    { title: 'Spin Issue Fix',         subtitle: 'Washing machine repair', image: '/mostbooked/washing.jpg',  price: '₹599',   route: '/spin-issue-fix',    order: 4, isActive: true },
];

async function seedCollection(db, name, data) {
    const cols = await db.listCollections({ name }).toArray();
    if (cols.length > 0) {
        await db.collection(name).drop();
        console.log('  Dropped old:', name);
    }
    const result = await db.collection(name).insertMany(data);
    console.log('  Inserted ' + result.insertedCount + ' items into: ' + name);
    data.forEach(d => console.log('    - ' + d.title + (d.price ? ' (' + d.price + ')' : '')));
}

async function main() {
    console.log('Connecting to LOCAL MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/joamex');
    console.log('Connected!\n');

    const db = mongoose.connection.db;

    console.log('[1] Solar & Water Solutions → solarwatersolutions');
    await seedCollection(db, 'solarwatersolutions', SOLAR_DATA);

    console.log('\n[2] Home Renovation → homerenovation');
    await seedCollection(db, 'homerenovation', RENOVATION_DATA);

    console.log('\n[3] Essential Services → essentialservices');
    await seedCollection(db, 'essentialservices', ESSENTIAL_DATA);

    console.log('\n[4] Most Booked Services → mostbookedservices');
    await seedCollection(db, 'mostbookedservices', MOSTBOOKED_DATA);

    // Final list
    const all = (await db.listCollections().toArray()).map(c => c.name).sort();
    console.log('\nAll collections (alphabetical):');
    const highlight = ['sitecontents','sitelookingfor','siteoffers','solarwatersolutions','homerenovation','essentialservices','mostbookedservices'];
    all.forEach(n => {
        const mark = highlight.includes(n) ? ' <---' : '';
        console.log('  - ' + n + mark);
    });

    await mongoose.disconnect();
    console.log('\nDone! Atlas NOT touched.');
}

main();
