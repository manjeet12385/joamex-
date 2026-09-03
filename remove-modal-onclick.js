const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove from overlay divs. 
    // They usually look like: zIndex: 10000 }} onClick={() => setShowBannerModal(false)}>
    // We can just use a regex that matches the onClick on the div but not the button.
    // The div overlay has: background: 'rgba(0,0,0,0.6)' and onClick
    // Let's replace: `}} onClick={() => setShow[a-zA-Z]+Modal(false)}>` with `}}>`
    
    // Pattern 1: `}} onClick={() => setShowBannerModal(false)}>`
    content = content.replace(/}} onClick=\{\(\) => setShowBannerModal\(false\)\}>/g, '}}>');
    content = content.replace(/}} onClick=\{\(\) => setShowCategoryModal\(false\)\}>/g, '}}>');
    content = content.replace(/}} onClick=\{\(\) => setShowPackageModal\(false\)\}>/g, '}}>');
    content = content.replace(/}} onClick=\{\(\) => setShowDetailsModal\(false\)\}>/g, '}}>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Patched:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
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
