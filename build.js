// Build script to inject EmailJS configuration from environment variables
// Usage: node build.js
// Requires: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID env vars

import fs from 'fs';
import path from 'path';

const requiredVars = ['EMAILJS_PUBLIC_KEY', 'EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID'];

for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`❌ Missing required environment variable: ${v}`);
    process.exit(1);
  }
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