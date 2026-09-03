const fs = require('fs');
const path = require('path');

const apiDirs = [
    'solar-water-solutions',
    'services',
    'most-booked-services',
    'home-renovation',
    'feature-banners',
    'essential-services',
    'exclusive-offers'
];

const basePath = path.join(__dirname, 'src', 'app', 'api', 'admin');

apiDirs.forEach(dir => {
    const routePath = path.join(basePath, dir, 'route.js');
    if (fs.existsSync(routePath)) {
        let content = fs.readFileSync(routePath, 'utf8');
        
        // Regex to match arrays assigned to const DEFAULT_ITEMS, DEFAULT_OFFERS, DEFAULT_BANNERS, defaultServices
        content = content.replace(/const\s+(DEFAULT_ITEMS|DEFAULT_OFFERS|DEFAULT_BANNERS|defaultServices)\s*=\s*\[[\s\S]*?\];/g, 'const $1 = [];');
        
        fs.writeFileSync(routePath, content);
        console.log(`Cleaned dummy arrays in ${dir}/route.js`);
    } else {
        console.log(`File not found: ${routePath}`);
    }
});
