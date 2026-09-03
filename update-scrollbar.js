const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'globals.css');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('.hero-modal-content::-webkit-scrollbar {\n  width: 8px;\n}', '.hero-modal-content::-webkit-scrollbar {\n  width: 12px;\n}');
content = content.replace('background: #cbd5e1;', 'background: #94a3b8; /* Darker gray for visibility */\n  border: 3px solid #f1f5f9; /* Creates a nice padding effect */');
content = content.replace('background: #94a3b8;', 'background: #64748b;');
content = content.replace('scrollbar-color: #cbd5e1 #f1f5f9;', 'scrollbar-color: #94a3b8 #f1f5f9;');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated scrollbar CSS');
