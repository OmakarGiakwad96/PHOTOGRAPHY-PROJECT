const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Handle `async` and normal functions starting with lowercase letters
  const regex = /(const [a-z][a-zA-Z0-9_]*\s*=\s*(?:async\s*)?\(.*?\)\s*=>\s*\{\r?\n)\s*const \{ t \} = useTranslation\(\);\r?\n\r?/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '$1');
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
  }
});

console.log(`Fixed ${fixedCount} files`);
