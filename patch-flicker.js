const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Skip if already has isDataLoaded
    if (content.includes('isDataLoaded')) {
        return;
    }

    // Find the main servicesList useState
    const stateRegex = /const \[servicesList, setServicesList\] = useState\([^)]+\);/;
    if (!stateRegex.test(content)) return;

    content = content.replace(stateRegex, match => `${match}\n  const [isDataLoaded, setIsDataLoaded] = useState(false);`);

    // Find useEffect end to set isDataLoaded
    // We look for:
    // window.addEventListener('admin_edit_mode_changed', checkAdmin);
    // return () => {
    const effectEndRegex = /(window\.addEventListener\('admin_edit_mode_changed', checkAdmin\);[\s\S]*?return \(\) => \{)/;
    if (effectEndRegex.test(content)) {
        content = content.replace(effectEndRegex, match => `setIsDataLoaded(true);\n    ${match}`);
    } else {
        return; // Couldn't find injection point
    }

    // Find the main return statement
    const returnRegex = /(return \(\s*<div className="[^"]+-page-wrapper">)/;
    if (returnRegex.test(content)) {
        content = content.replace(returnRegex, match => `  if (!isDataLoaded) {\n    return (\n      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>\n        <Header />\n        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '16px', fontWeight: '600' }}>\n          Loading Details...\n        </div>\n      </div>\n    );\n  }\n\n  ${match}`);
    } else {
        return;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched:', filePath);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'page.js') continue; // skip main services page
        if (file === '[category]') continue; // already patched
        if (file === 'bed-bugs') continue; // already patched

        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const pageJs = path.join(fullPath, 'page.js');
            if (fs.existsSync(pageJs)) {
                patchFile(pageJs);
            }
        }
    }
}

walkDir(servicesDir);
console.log('Done');
