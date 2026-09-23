import fs from 'node:fs';
import path from 'node:path';

const htmlDir = path.resolve('./html');
const pagesDir = path.resolve('./src/pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const pageConfigs = [
  {
    src: 'index.html',
    dest: 'index.astro',
    title: 'Studiova - Creative Agency & Portfolio',
    activePage: 'home',
    hasHeaderFooter: true,
  },
  {
    src: 'about-us.html',
    dest: 'about-us.astro',
    title: 'About Us - Studiova',
    activePage: 'about',
    hasHeaderFooter: true,
  },
  {
    src: 'projects.html',
    dest: 'projects.astro',
    title: 'Projects - Studiova',
    activePage: 'projects',
    hasHeaderFooter: true,
  },
  {
    src: 'projects-detail.html',
    dest: 'projects-detail.astro',
    title: 'Project Detail - Studiova',
    activePage: 'projects',
    hasHeaderFooter: true,
  },
  {
    src: 'blog.html',
    dest: 'blog.astro',
    title: 'Blog - Studiova',
    activePage: 'blog',
    hasHeaderFooter: true,
  },
  {
    src: 'blog-detail.html',
    dest: 'blog-detail.astro',
    title: 'Blog Detail - Studiova',
    activePage: 'blog',
    hasHeaderFooter: true,
  },
  {
    src: 'contact.html',
    dest: 'contact.astro',
    title: 'Contact - Studiova',
    activePage: 'contact',
    hasHeaderFooter: true,
  },
  {
    src: 'terms-and-conditions.html',
    dest: 'terms-and-conditions.astro',
    title: 'Terms & Conditions - Studiova',
    activePage: '',
    hasHeaderFooter: true,
  },
  {
    src: 'privacy-policy.html',
    dest: 'privacy-policy.astro',
    title: 'Privacy Policy - Studiova',
    activePage: '',
    hasHeaderFooter: true,
  },
  {
    src: 'sign-in.html',
    dest: 'sign-in.astro',
    title: 'Sign In - Studiova',
    activePage: '',
    hasHeaderFooter: false,
  },
  {
    src: 'sign-up.html',
    dest: 'sign-up.astro',
    title: 'Sign Up - Studiova',
    activePage: '',
    hasHeaderFooter: false,
  },
  {
    src: '404.html',
    dest: '404.astro',
    title: 'Page Not Found - Studiova',
    activePage: '',
    hasHeaderFooter: false,
  },
];

function transformLinks(content) {
  return content
    .replace(/\.\.\/assets\//g, '/assets/')
    .replace(/\.\/assets\//g, '/assets/')
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="about-us\.html"/g, 'href="/about-us"')
    .replace(/href="projects\.html"/g, 'href="/projects"')
    .replace(/href="projects-detail\.html"/g, 'href="/projects-detail"')
    .replace(/href="blog\.html"/g, 'href="/blog"')
    .replace(/href="blog-detail\.html"/g, 'href="/blog-detail"')
    .replace(/href="contact\.html"/g, 'href="/contact"')
    .replace(/href="terms-and-conditions\.html"/g, 'href="/terms-and-conditions"')
    .replace(/href="privacy-policy\.html"/g, 'href="/privacy-policy"')
    .replace(/href="sign-in\.html"/g, 'href="/sign-in"')
    .replace(/href="sign-up\.html"/g, 'href="/sign-up"')
    .replace(/href="404\.html"/g, 'href="/404"');
}

for (const config of pageConfigs) {
  const filePath = path.join(htmlDir, config.src);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }

  const rawHtml = fs.readFileSync(filePath, 'utf8');
  let mainContent = '';

  if (config.hasHeaderFooter) {
    const headerEndIdx = rawHtml.indexOf('</header>');
    const footerStartIdx = rawHtml.indexOf('<footer');
    if (headerEndIdx !== -1 && footerStartIdx !== -1) {
      mainContent = rawHtml.substring(headerEndIdx + '</header>'.length, footerStartIdx).trim();
    } else {
      console.warn(`Could not find header/footer boundary in ${config.src}`);
    }
  } else {
    const bodyStartIdx = rawHtml.indexOf('<body>');
    const templateIdx = rawHtml.indexOf('<div class="get-template');
    const scriptIdx = rawHtml.indexOf('<script');
    const endBoundary = templateIdx !== -1 ? templateIdx : (scriptIdx !== -1 ? scriptIdx : rawHtml.indexOf('</body>'));
    if (bodyStartIdx !== -1 && endBoundary !== -1) {
      mainContent = rawHtml.substring(bodyStartIdx + '<body>'.length, endBoundary).trim();
    }
  }

  const transformedContent = transformLinks(mainContent);

  const astroTemplate = `---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="${config.title}"
  ${config.activePage ? `activePage="${config.activePage}"` : ''}
  ${!config.hasHeaderFooter ? 'showHeader={false}\n  showFooter={false}' : ''}
>
${transformedContent}
</Layout>
`;

  const destPath = path.join(pagesDir, config.dest);
  fs.writeFileSync(destPath, astroTemplate, 'utf8');
  console.log(`Generated: ${config.dest}`);
}

console.log('Migration complete.');
