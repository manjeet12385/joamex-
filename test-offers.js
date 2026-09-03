const fs = require('fs');
fetch('http://localhost:3000/api/offers')
    .then(res => res.json())
    .then(data => {
        fs.writeFileSync('offers-output.json', JSON.stringify(data, null, 2));
        console.log('done');
    });
