#!/usr/bin/env node
/**
 * sync-embedded.js — Re-sincroniza la copia de datos EMBEBIDA del prototipo.
 *
 * El archivo `prototipo/generador-cv.html` es autocontenido: cuando se abre con
 * doble clic (protocolo file://) NO puede leer `data/*.json` (fetch se lo prohíbe),
 * así que lleva una copia embebida en el bloque `const EMBEDDED = {...}` del
 * <script>. Ese bloque se generó desde los mismos JSON y este script lo regenéra
 * para que nunca quede desactualizado.
 *
 * Uso:
 *   node prototipo/sync-embedded.js                  → escribe la copia si cambió
 *   node prototipo/sync-embedded.js --check          → solo verifica (exit 0/1)
 *   node prototipo/sync-embedded.js [--check] ruta.html  → usa otra ruta de HTML
 *
 * Sin dependencias: solo node:fs, node:path y node:url. ESM (package.json del
 * root tiene "type": "module").
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ *
 *  Configuración por defecto (rutas relativas al script, para que el
 *  cwd no importe). El HTML se puede overridear por argumento.
 * ------------------------------------------------------------------ */
const DEFAULT_HTML = join(HERE, 'generador-cv.html');
const CV_DATA_PATH = join(HERE, 'data', 'cv-data.json');
const PERFILES_PATH = join(HERE, 'data', 'perfiles.json');

/* El bloque exacto que se busca/reemplaza. `.\n` entre `{` y `  cv:` es
 * literal; `[\s\S]*?` cubre el JSON (una sola línea, pero tolera cualquier
 * formato futuro). El cierre es `};` en su propia línea. */
const BLOCK_RE = /const EMBEDDED = \{\n  cv: [\s\S]*?,\n  perfiles: [\s\S]*?\n\};/;

/* ------------------------------------------------------------------ *
 *  Errores "limpios" (sin stack trace) para CLI
 * ------------------------------------------------------------------ */
function fail(msg) {
  console.error('[sync-embedded] ERROR: ' + msg);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 *  Validaciones: fallar temprano con mensaje claro
 * ------------------------------------------------------------------ */
function validate(cv, perfiles) {
  const errors = [];

  if (!cv || typeof cv !== 'object' || Array.isArray(cv)) {
    errors.push('cv-data.json no parsea a un objeto JSON.');
  } else {
    for (const key of ['persona', 'skills', 'experiencia']) {
      if (!(key in cv)) errors.push(`cv-data.json no tiene la clave requerida "${key}".`);
    }
  }

  if (!perfiles || typeof perfiles !== 'object' || Array.isArray(perfiles)) {
    errors.push('perfiles.json no parsea a un objeto JSON.');
  } else {
    const arr = perfiles.perfiles;
    if (!Array.isArray(arr) || arr.length === 0) {
      errors.push('perfiles.json debe tener "perfiles" como un array no vacío.');
    } else {
      arr.forEach((p, i) => {
        if (!p || typeof p !== 'object' || !('id' in p) || !('label' in p)) {
          const prev = (p && typeof p === 'object' && 'id' in p) ? ` (id "${p.id}")` : '';
          errors.push(`El perfil #${i + 1}${prev} no tiene "id" y "label".`);
        }
      });
    }
  }

  return errors;
}

/* ------------------------------------------------------------------ *
 *  Carga + validación de los JSON fuente
 * ------------------------------------------------------------------ */
function loadSourceData() {
  let cv, perfiles;
  try {
    cv = JSON.parse(readFileSync(CV_DATA_PATH, 'utf8'));
  } catch (e) {
    fail(`no se pudo leer/parsear ${CV_DATA_PATH}: ${e.message}`);
  }
  try {
    perfiles = JSON.parse(readFileSync(PERFILES_PATH, 'utf8'));
  } catch (e) {
    fail(`no se pudo leer/parsear ${PERFILES_PATH}: ${e.message}`);
  }

  const errors = validate(cv, perfiles);
  if (errors.length) {
    fail('datos fuente inválidos:\n  - ' + errors.join('\n  - '));
  }

  return { cv, perfiles };
}

/* ------------------------------------------------------------------ *
 *  Extrae / reemplaza el bloque EMBEDDED del HTML
 * ------------------------------------------------------------------ */
function findBlock(html) {
  const found = [...html.matchAll(new RegExp(BLOCK_RE.source, 'g'))];
  if (found.length === 0) {
    fail('no se encontró el bloque "const EMBEDDED = {...}" en el HTML. ' +
      '¿Es el archivo correcto? Se espera el formato exacto:\n' +
      '  const EMBEDDED = {\n  cv: {...},\n  perfiles: {...}\n};');
  }
  if (found.length !== 1) {
    fail('el bloque "const EMBEDDED = {...}" aparece más de una vez en el HTML. Revisá el archivo a mano.');
  }
  const match = found[0];
  const currentBlock = match[0];
  const before = html.slice(0, match.index);
  // OJO: `match.length` sería 1 (cantidad de grupos + 1); el largo real del
  // texto matcheado es `match[0].length`. Usar el primero duplicaría todo
  // el bloque al escribir (after arrancaría dentro del propio bloque).
  const after = html.slice(match.index + currentBlock.length);
  return { before, after, currentBlock };
}

function buildBlock(cv, perfiles) {
  return (
    'const EMBEDDED = {\n' +
    '  cv: ' + JSON.stringify(cv) + ',\n' +
    '  perfiles: ' + JSON.stringify(perfiles) + '\n' +
    '};'
  );
}

/* ------------------------------------------------------------------ *
 *  Main
 * ------------------------------------------------------------------ */
function parseArgs(argv) {
  let check = false;
  let htmlPath = DEFAULT_HTML;
  for (const arg of argv) {
    if (arg === '--check') check = true;
    else if (arg.startsWith('-')) fail(`argumento desconocido: ${arg}`);
    else htmlPath = resolve(arg);
  }
  return { check, htmlPath };
}

const { check, htmlPath } = parseArgs(process.argv.slice(2));

// Leer el HTML (UTF-8, sin BOM; conserva los \n existentes)
let html;
try {
  html = readFileSync(htmlPath, 'utf8');
} catch (e) {
  fail(`no se pudo leer el HTML ${htmlPath}: ${e.message}`);
}

const { cv, perfiles } = loadSourceData();
const newBlock = buildBlock(cv, perfiles);
const { before, after, currentBlock } = findBlock(html);

if (currentBlock === newBlock) {
  console.log('EMBEDDED sincronizado: la copia embebida ya coincide con data/*.json. Sin cambios.');
  console.log(`  HTML: ${isAbsolute(htmlPath) ? htmlPath : resolve(htmlPath)}`);
  console.log(`  cv-data.json:    ${JSON.stringify(cv).length} chars`);
  console.log(`  perfiles.json:   ${JSON.stringify(perfiles).length} chars`);
  process.exit(0);
}

if (check) {
  console.error('[sync-embedded] --check: la copia embebida NO está sincronizada con data/*.json.');
  console.error('  Ejecutá "node prototipo/sync-embedded.js" y commiteá juntos el HTML y los JSON.');
  process.exit(1);
}

const beforeBytes = Buffer.byteLength(html, 'utf8');
const newHtml = before + newBlock + after;
const afterBytes = Buffer.byteLength(newHtml, 'utf8');

try {
  writeFileSync(htmlPath, newHtml, 'utf8');
} catch (e) {
  fail(`no se pudo escribir el HTML ${htmlPath}: ${e.message}`);
}

// Verificación post-escritura: el archivo debe quedar exactamente como se
// calculó (nada de reescribir por fuera del bloque EMBEDDED).
const written = readFileSync(htmlPath, 'utf8');
if (written !== newHtml) {
  fail('la verificación post-escritura no coincidió: el archivo en disco no es el que se generó. ' +
    'Restaurá el archivo con git y revisá el script.');
}
const writtenBlocks = [...written.matchAll(new RegExp(BLOCK_RE.source, 'g'))];
if (writtenBlocks.length !== 1) {
  fail('la verificación post-escritura falló: el bloque EMBEDDED quedó ' + writtenBlocks.length +
    ' veces en el archivo. ¿Algo reescribió el HTML entre medio?');
}

console.log('EMBEDDED re-sincronizado desde data/*.json.');
console.log(`  HTML: ${resolve(htmlPath)}`);
console.log(`  bytes: ${beforeBytes} → ${afterBytes} (${afterBytes - beforeBytes >= 0 ? '+' : ''}${afterBytes - beforeBytes})`);
console.log('  Recordá commitear juntos el HTML y los JSON (quien abra el HTML con doble clic usa la copia embebida).');