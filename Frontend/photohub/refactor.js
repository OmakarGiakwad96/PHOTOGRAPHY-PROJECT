const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Photography_project\\Frontend\\photohub\\src';

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // Handle imports
            if (content.includes('import { javaApi, dotnetApi } from')) {
                content = content.replace(/import\s*\{\s*javaApi,\s*dotnetApi\s*\}\s*from/g, 'import { api } from');
                updated = true;
            }
            if (content.includes('import { javaApi } from')) {
                content = content.replace(/import\s*\{\s*javaApi\s*\}\s*from/g, 'import { api } from');
                updated = true;
            }
            if (content.includes('import { dotnetApi } from')) {
                content = content.replace(/import\s*\{\s*dotnetApi\s*\}\s*from/g, 'import { api } from');
                updated = true;
            }

            // Handle usages
            if (content.includes('javaApi.')) {
                content = content.replace(/javaApi\./g, 'api.');
                updated = true;
            }
            if (content.includes('dotnetApi.')) {
                content = content.replace(/dotnetApi\./g, 'api.');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

replaceInFiles(srcDir);
console.log('Refactoring complete!');
