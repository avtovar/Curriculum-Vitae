/**
 * tests/prototipo.spec.js — Tests de humo + funcionales para el prototipo
 * `prototipo/generador-cv.html` (generador de CV dinámico autocontenido).
 *
 * Usa la API mínima `window.__prototipo` que el propio HTML expone (getState,
 * buildDoc, renderAll, generateBytes, settings) y verifica además la UI real
 * (cards de perfil, radios de idioma, preview) y el fallback file://.
 *
 * Los tests 1-7 corren contra el webServer de playwright.config.js
 * (`npx serve . -l 8000`, baseURL http://localhost:8000). El test 8 abre el
 * HTML por file:// para cubrir el escenario "doble clic".
 *
 * El test 6 (generateBytes) descarga pdf-lib + fontkit + Roboto del CDN
 * (jsDelivr): necesita internet y por eso lleva timeout generoso (120 s).
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROTOTIPO_HTML = join(__dirname, '..', 'prototipo', 'generador-cv.html');
const SCREENSHOT_PATH = join(__dirname, 'screenshots', 'prototipo-preview.png');
const PROFILE_IDS = ['generalista', 'qa_manual', 'qa_automation', 'qa_api', 'frontend'];
const NOMBRE_REAL = 'Ali Valentin Tovar Morales';

// Errores de red (favicon 404, failed to load resource) no son errores de la
// app: el HTML no define favicon y Chromium pide /favicon.ico solo.
const isNetNoise = text => /favicon|Failed to load resource/i.test(text);

/** Captura pageerror y console.error de la página y los devuelve al final. */
function collectErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() === 'error' && !isNetNoise(m.text())) errors.push('console: ' + m.text());
  });
  return errors;
}

/** Espera a que loadData() termine (settings() devuelve keys). */
async function waitDataLoaded(page) {
  await expect
    .poll(() => page.evaluate(() => Boolean(window.__prototipo?.settings?.()?.keys)), {
      message: 'el prototipo no terminó de cargar los datos',
      timeout: 15_000,
    })
    .toBe(true);
}

async function readSettings(page) {
  return page.evaluate(() => window.__prototipo.settings());
}

test.describe('Prototipo generador de CV', () => {
  test('1. carga sin errores de consola ni pageerror', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);
    // Margen corto para dejar asomar errores asincrónicos (debounce, renders).
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test('2. settings: dataSource "archivos" y los 5 perfiles esperados', async ({ page }) => {
    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);

    const settings = await readSettings(page);
    expect(settings.dataSource).toBe('archivos');
    expect(settings.keys.perfiles).toEqual(PROFILE_IDS);
    for (const key of ['persona', 'skills', 'experiencia']) {
      expect(settings.keys.cv).toContain(key);
    }
  });

  test('3. existen 5 tarjetas de perfil y "generalista" es el radio por defecto', async ({ page }) => {
    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);

    await expect(page.locator('.perfil-card')).toHaveCount(5);
    await expect(page.locator('.perfil-card input[name="perfil"]')).toHaveCount(5);
    for (const id of PROFILE_IDS) {
      await expect(page.locator(`.perfil-card input[name="perfil"][value="${id}"]`)).toHaveCount(1);
    }
    await expect(page.locator('.perfil-card input[name="perfil"][value="generalista"]')).toBeChecked();
    // Solo el default puede estar checked
    await expect(page.locator('.perfil-card input[name="perfil"]:checked')).toHaveCount(1);
  });

  test('4. el preview renderiza contenido real (nombre) y no queda en "Cargando…"', async ({ page }) => {
    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);

    const preview = page.locator('#preview');
    await expect(preview.locator('h1')).toContainText(NOMBRE_REAL, { timeout: 10_000 });
    await expect(preview).not.toContainText('Cargando vista previa…');
  });

  test('5. cambiar a inglés actualiza el preview (Professional Summary)', async ({ page }) => {
    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);

    const preview = page.locator('#preview');
    await expect(preview).toContainText('Resumen Profesional', { timeout: 10_000 });

    // Los radios de idioma viven dentro del <dialog> (cerrado por defecto):
    // hay que abrirlo como haría un usuario real.
    await page.locator('#openDialog').click();
    await expect(page.locator('#genDialog')).toBeVisible();

    await page.locator('input[name="idioma"][value="en"]').check();
    await expect(preview).toContainText('Professional Summary', { timeout: 10_000 });
    await expect(preview).not.toContainText('Resumen Profesional');
  });

  test('6. generateBytes produce un PDF válido (%PDF, >20 KB, 1-2 páginas)', async ({ page }) => {
    // Descarga el CDN (pdf-lib, fontkit, Roboto) la primera vez.
    test.slow();
    test.setTimeout(120_000);

    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);

    const result = await page.evaluate(async () => {
      const r = await window.__prototipo.generateBytes();
      return {
        isUint8Array: r.bytes instanceof Uint8Array,
        head: Array.from(r.bytes.slice(0, 5))
          .map(b => String.fromCharCode(b))
          .join(''),
        length: r.bytes.length,
        pages: r.pages,
      };
    });

    expect(result.isUint8Array).toBe(true);
    expect(result.head.startsWith('%PDF')).toBe(true);
    expect(result.length).toBeGreaterThan(20480);
    expect(result.pages).toBeGreaterThanOrEqual(1);
    expect(result.pages).toBeLessThanOrEqual(2);
  });

  test('7. guarda screenshot del preview en tests/screenshots/', async ({ page }) => {
    await page.goto('/prototipo/generador-cv.html');
    await waitDataLoaded(page);

    const preview = page.locator('#preview');
    await expect(preview.locator('h1')).toContainText(NOMBRE_REAL, { timeout: 10_000 });

    mkdirSync(dirname(SCREENSHOT_PATH), { recursive: true });
    await preview.screenshot({ path: SCREENSHOT_PATH });

    expect(statSync(SCREENSHOT_PATH).size).toBeGreaterThan(0);
  });

  test('8. file:// usa el fallback: datos embebidos y preview funcionando', async ({ page }) => {
    const fileUrl = pathToFileURL(PROTOTIPO_HTML).href;
    await page.goto(fileUrl);
    await waitDataLoaded(page);

    const settings = await readSettings(page);
    expect(settings.dataSource).toBe('embebido');
    // La copia embebida también trae los 5 perfiles
    expect(settings.keys.perfiles).toEqual(PROFILE_IDS);

    await expect(page.locator('#preview h1')).toContainText(NOMBRE_REAL, { timeout: 10_000 });
    await expect(page.locator('#preview')).not.toContainText('Cargando vista previa…');
  });
});