const fs = require('fs');

const files = [
  'src/components/EssentialServicesSection.js',
  'src/components/HomeRenovationSection.js',
  'src/components/MostBookedSection.js',
  'src/components/ServiceBanners.js',
  'src/components/SolarWaterSection.js',
  'src/components/OffersSection.js',
  'src/components/Hero.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove || '/services' from onClick route passing
    content = content.replace(/handleSmartCardNavigate\(e,\s*([a-zA-Z0-9_.]+)\s*\|\|\s*(['"]\/services['"])\)/g, 'handleSmartCardNavigate(e, $1)');

    // 2. Fix handleSmartCardNavigate empty check
    content = content.replace(/if\s*\(!route\)\s*\{\s*router\.push\(['"]\/services['"]\);\s*return;\s*\}/g, 'if (!route || route === \'#\') {\n        return;\n      }');

    // 3. Fix save forms fallback
    content = content.replace(/route:\s*([a-zA-Z0-9_.]+)\.trim\(\)\s*\|\|\s*(['"]\/services['"])/g, 'route: $1.trim()');
    content = content.replace(/route:\s*([a-zA-Z0-9_.]+)\s*\|\|\s*(['"]\/services['"])/g, 'route: $1');

    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
