const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const srcPath = path.join(__dirname, 'src');

walkDir(srcPath, (filePath) => {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(/text-\[10px\]/g, 'text-[12px]')
            .replace(/text-\[11px\]/g, 'text-[12px]')
            .replace(/::after\s*{[^}]*rotate\(-35deg\)[^}]*}/g, ''); // Eliminar la línea diagonal si aparece en CSS
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Actualizado: ${filePath}`);
        }
    }
});
