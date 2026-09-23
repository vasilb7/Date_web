import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('./src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = content.replace(/Studiova/g, 'JMB');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Replaced Studiova with JMB in: ${file}`);
  }
}

console.log('Brand replacement complete.');
