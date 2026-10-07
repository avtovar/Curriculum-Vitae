// Build script to inject EmailJS configuration from environment variables or local config file
// Usage: node build.js
// Requires: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID env vars
// OR a local config file at no_subir/emailjs-config.json (never committed)

import fs from 'fs';
import path from 'path';

const requiredVars = ['EMAILJS_PUBLIC_KEY', 'EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID'];

// Try to load from local config file (no_subir/emailjs-config.json)
function loadLocalConfig() {
  const configPath = path.resolve('no_subir/emailjs-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);
      console.log('📁 Loaded EmailJS config from no_subir/emailjs-config.json');
      return config;
    } catch (e) {
      console.warn('⚠️  Error reading no_subir/emailjs-config.json:', e.message);
    }
  }
  return null;
}

const localConfig = loadLocalConfig();

// Resolve each var: env var > local config > undefined
const config = {};
for (const key of requiredVars) {
  config[key] = process.env[key] || (localConfig ? localConfig[key] : undefined);
}

const missing = requiredVars.filter((v) => !config[v]);

if (missing.length > 0) {
  console.warn(`⚠️  EmailJS config incomplete (missing: ${missing.join(', ')}).`);
  console.warn('   Set them via:');
  console.warn('   1. Environment variables (EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID)');
  console.warn('   2. OR edit no_subir/emailjs-config.json with your keys');
  console.warn('   Skipping injection — placeholders in index.html/Formulario.js will remain.\n');
  process.exit(0);
}

// Guard: if placeholders were already replaced (e.g. local run after CI),
// detect and warn instead of crashing.
const placeholdersPresent = ['index.html', 'js/modules/form.js'].some((f) => {
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
  '__EMAILJS_PUBLIC_KEY__': config.EMAILJS_PUBLIC_KEY,
  '__EMAILJS_SERVICE_ID__': config.EMAILJS_SERVICE_ID,
  '__EMAILJS_TEMPLATE_ID__': config.EMAILJS_TEMPLATE_ID,
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
  'js/modules/form.js',
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