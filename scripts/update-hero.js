import fs from 'node:fs';

let content = fs.readFileSync('src/pages/index.astro', 'utf8');

// Normalize line endings to \n temporarily for easy matching
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const target = `<div class="row align-items-center">
            <div class="col-xl-4">
              <div class="d-flex align-items-center gap-4">
                <img src="/assets/images/svgs/primary-leaf.svg" alt="" class="img-fluid animate-spin">
                <p class="mb-0 text-white fs-5 text-opacity-70">We create <span
                    class="text-primary">high-performing</span> digital designs that elevate brands and enhance
                  conversions.</p>
              </div>
            </div>
          </div>`;

const replacement = `<div class="row align-items-end justify-content-between g-4">
            <div class="col-lg-6 col-xl-5">
              <div class="d-flex align-items-center gap-4">
                <img src="/assets/images/svgs/primary-leaf.svg" alt="" class="img-fluid animate-spin">
                <p class="mb-0 text-white fs-5 text-opacity-70">We create <span
                    class="text-primary">high-performing</span> digital designs that elevate brands and enhance
                  conversions.</p>
              </div>
            </div>
            <div class="col-lg-6 col-xl-5">
              <HeroJerryInput />
            </div>
          </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync('src/pages/index.astro', content, 'utf8');
  console.log('Successfully updated index.astro with HeroJerryInput!');
} else {
  console.error('Target banner block not found in src/pages/index.astro');
}
