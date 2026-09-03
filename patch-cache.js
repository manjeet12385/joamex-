const fs = require('fs');
const path = require('path');

function patchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            patchDir(fullPath);
        } else if (file === 'route.js') {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('force-dynamic')) {
                content = "export const dynamic = 'force-dynamic';\n" + content;
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Patched: ' + fullPath);
            }
        }
    }
}

patchDir(path.join(process.cwd(), 'src/app/api'));
