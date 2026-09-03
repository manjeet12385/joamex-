const mongoose = require('mongoose');

mongoose.connect('mongodb://joamex:joamexpass123@ac-rmssebe-shard-00-00.foaosja.mongodb.net:27017,ac-rmssebe-shard-00-01.foaosja.mongodb.net:27017,ac-rmssebe-shard-00-02.foaosja.mongodb.net:27017/joamex?ssl=true&replicaSet=atlas-x4zbb4-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(async () => {
    const db = mongoose.connection.db;
    const data = await db.collection('02_what_are_you_looking_for').find().toArray();
    
    const paintersData = data.filter(doc => 
        doc.subcategories && doc.subcategories.some(sub => sub.slug.includes('painter'))
    );
    
    console.log(JSON.stringify(paintersData, null, 2));
    
    // Also check if any category has painters
    const allNames = data.map(d => d.name);
    console.log('All categories:', allNames);
    
    process.exit(0);
})
.catch(console.error);
