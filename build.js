// Build script to inject EmailJS configuration from environment variables
// Usage: node build.js
// Requires: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID env vars

import fs from 'fs';
import path from 'path';

const requiredVars = ['EMAILJS_PUBLIC_KEY', 'EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID'];

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.warn(`⚠️  EmailJS env vars not set (${missing.join(', ')}).`);
  console.warn('   Skipping injection — placeholders in index.html/Formulario.js will remain.');
  console.warn('   Set them in GitHub Settings → Secrets and variables → Actions to enable the contact form.\n');
  process.exit(0);
}

// Guard: if placeholders were already replaced (e.g. local run after CI),
// detect and warn instead of crashing.
const placeholdersPresent = ['index.html', 'js/Formulario.js'].some((f) => {
  try {
    return fs.readFileSync(f, 'utf8').includes('__EMAILJS_');
  } catch {
    return false;
  }
});

if (!placeholdersPresent) {
  console.warn('⚠️  No __EMAILJS_*__ placeholders found — files may already be injected.');
  console.warn('   Nothing to do. Skipping in-place modification.\n');
  process.exit(0);
}

const replacements = {
  '__EMAILJS_PUBLIC_KEY__': process.env.EMAILJS_PUBLIC_KEY,
  '__EMAILJS_SERVICE_ID__': process.env.EMAILJS_SERVICE_ID,
  '__EMAILJS_TEMPLATE_ID__': process.env.EMAILJS_TEMPLATE_ID,
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [placeholder, value] of Object.entries(replacements)) {
    if (content.includes(placeholder)) {
      content = content.replaceAll(placeholder, value);
      changed = true;
      console.log(`✅ Replaced ${placeholder} in ${filePath}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// Process files
const filesToProcess = [
  'index.html',
  'js/Formulario.js',
];

console.log('🔧 Injecting EmailJS configuration...\n');

for (const file of filesToProcess) {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    replaceInFile(fullPath);
  } else {
    console.warn(`⚠️ File not found: ${file}`);
  }
}

console.log('\n✅ Build complete!');