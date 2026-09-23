import fs from 'node:fs';

let content = fs.readFileSync('src/pages/index.astro', 'utf8');

// Normalize line endings to \n
const isCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

// 1. Update title
content = content.replace(
  'title="Studiova - Creative Agency & Portfolio"',
  'title="JMB - Специална покана за среща"'
);

// 2. Replace Hero Banner section
const heroStart = content.indexOf('<!--  Banner Section -->');
const heroEnd = content.indexOf('<!--  Stats & Facts Section -->');

if (heroStart !== -1 && heroEnd !== -1) {
  const newHero = `<!--  Banner Section -->
    <section class="banner-section position-relative d-flex align-items-center justify-content-center min-vh-100 overflow-hidden">
      <video class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" autoplay muted loop playsinline>
        <source src="/assets/images/backgrounds/banner-video.mp4" type="video/mp4" />
      </video>
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-35 pointer-events-none"></div>

      <div class="container position-relative z-1 d-flex flex-column align-items-center justify-content-center text-center py-5">
        <HeroJerryInput />
      </div>
    </section>

    `;
  content = content.substring(0, heroStart) + newHero + content.substring(heroEnd);
  console.log('Hero section replaced with centered HeroJerryInput only!');
} else {
  console.error('Hero boundaries not found!');
}

// 3. Update Section 1 (Stats & facts -> Date invitation intro)
content = content.replace(
  '<span class="badge text-bg-dark">Stats & facts</span>',
  '<span class="badge text-bg-dark">JMB Покана</span>'
);
content = content.replace(
  '<h2 class="mb-0">High quality web design solutions you can trust.</h2>',
  '<h2 class="mb-0">Специален момент, създаден само за теб.</h2>'
);
content = content.replace(
  `<p class="fs-5 mb-0">When selecting a web design agency, it's essential to consider its reputation,
                      experience, and the specific needs of your project.</p>`,
  `<p class="fs-5 mb-0">Защото най-хубавите моменти заслужават специално внимание, уютна атмосфера и незабравими спомени заедно.</p>`
);
content = content.replace(
  'People who have launched their websites',
  'Внимание към всеки детайл'
);
content = content.replace(
  'Experienced professionals ready to assist',
  'Идеи за перфектна среща'
);
content = content.replace(
  'Support through messages and live consultations',
  'Споделени усмивки и емоции'
);
content = content.replace(
  '<span class="btn-text">Who we are</span>',
  '<span class="btn-text">Виж идеите за среща</span>'
);
content = content.replace(
  'href="/about-us" class="btn"',
  'href="#plans" class="btn"'
);

// 4. Update Section 2 (Featured projects -> Date plans)
content = content.replace(
  '<section class="featured-projects py-5 py-lg-11 py-xl-12 bg-light-gray">',
  '<section class="featured-projects py-5 py-lg-11 py-xl-12 bg-light-gray" id="plans">'
);
content = content.replace(
  '<span class="badge text-bg-dark">Portfolio</span>',
  '<span class="badge text-bg-dark">Идеи за среща</span>'
);
content = content.replace(
  '<h2 class="mb-0">Featured projects</h2>',
  '<h2 class="mb-0">Избери нашето преживяване</h2>'
);
content = content.replace(
  `<p class="fs-5 mb-0">A glimpse into our creativity—exploring innovative designs, successful
                      collaborations, and transformative digital experiences.</p>`,
  `<p class="fs-5 mb-0">Пет прекрасни плана за перфектната среща – избери това, което звучи най-примамливо за нашата вечер.</p>`
);

// Update slider card titles
content = content.replace(
  '<h3 class="mb-0">Snapclear</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">UX Strategy</span>\n                    <span class="badge text-dark border">UI Design</span>',
  '<h3 class="mb-0">Уютна вечеря & вино</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">Класика</span>\n                    <span class="badge text-dark border">Романтика</span>'
);
content = content.replace(
  '<h3 class="mb-0">Amber Bottle</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">Web development</span>\n                    <span class="badge text-dark border">Digital design</span>',
  '<h3 class="mb-0">Кафе, разходка & десерт</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">Непринудено</span>\n                    <span class="badge text-dark border">Сладки изкушения</span>'
);
content = content.replace(
  '<h3 class="mb-0">Pixelforge</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">UI/UX design</span>\n                    <span class="badge text-dark border">Web development</span>',
  '<h3 class="mb-0">Гледка на залез с питие</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">Панорама</span>\n                    <span class="badge text-dark border">Залез</span>'
);
content = content.replace(
  '<h3 class="mb-0">BioTrack LIMS</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">Brand identity</span>\n                    <span class="badge text-dark border">Digital design</span>',
  '<h3 class="mb-0">Кино вечер с пуканки</h3>\n                  <div class="hstack gap-2">\n                    <span class="badge text-dark border">Уютно</span>\n                    <span class="badge text-dark border">Хубав филм</span>'
);

// Restore line endings if needed
if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync('src/pages/index.astro', content, 'utf8');
console.log('Successfully updated index.astro with JMB date invite branding!');
