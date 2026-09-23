import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('./src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip data-aos attributes
  const updated = content
    .replace(/\s*data-aos="[^"]*"/g, '')
    .replace(/\s*data-aos-delay="[^"]*"/g, '')
    .replace(/\s*data-aos-duration="[^"]*"/g, '');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Cleaned AOS from: ${file}`);
  }
}

console.log('AOS attributes removal completed.');
