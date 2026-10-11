# Generador de CV dinámico (prototipo)

> Prototipo **autocontenido**: genera en el navegador un PDF de CV ATS-friendly
> distinto según **idioma** (ES/EN), **perfil objetivo** y —si activás el modo
> reclutador— la **descripción de puesto** que pegás.
>
> ⚠️ **Importante:** este prototipo **NO toca `index.html`, `css/` ni `js/` del
> sitio real**. Vive en su propia carpeta (`prototipo/`) y **nada se inventa**:
> solo **selecciona, reordena y resalta** datos reales que ya existen en
> `prototipo/data/*.json`.

Único archivo HTML (~1050 líneas, ~88 KB), sin frameworks y sin build:
CSS y JavaScript van inline en `prototipo/generador-cv.html`. El PDF se arma y
descarga 100% en el navegador con [pdf-lib](https://pdf-lib.js.org/) +
[fontkit](https://github.com/Hopding/fontkit) + la fuente Roboto, todos servidos
por CDN (jsDelivr).

---

## Cómo abrirlo

| Método | Comando | Qué datos usa |
|--------|---------|---------------|
| **(a) Doble clic** en `prototipo/generador-cv.html` | — | La **copia embebida** (`EMBEDDED`) |
| **(b) Con servidor local** (recomendado para desarrollar) | `npx serve .` y entrá a `http://localhost:8000/prototipo/generador-cv.html` | `data/*.json` **en vivo** |

El badge verde de la topbar (`Datos: <b>data/*.json</b> (en vivo)` o
`Datos: <b>copia embebida</b>…`) te dice exactamente cuál de las dos fuentes
está usando el prototipo en ese momento.

**¿Por qué dos fuentes?** El navegador **prohíbe `fetch()` de archivos locales**
bajo el protocolo `file://` (doble clic). Para que el prototipo funcione
aunque no haya servidor, el HTML lleva embebida una copia de los JSON en el
bloque `const EMBEDDED = {...}`. Cuando hay servidor (`http://`), el prototipo
da prioridad a `fetch('./data/...')` y lee los archivos reales.

---

## Flujo de edición obligatorio

Si editás los datos (que es la forma de cambiar el CV generado):

```text
1. Editá  prototipo/data/cv-data.json   y/o   prototipo/data/perfiles.json
2. Corré  node prototipo/sync-embedded.js
3. Commiteá JUNTOS  el HTML  y  los JSON
```

**¿Por qué es obligatorio el paso 2?** Quien abra el prototipo con **doble clic**
usa la *copia embebida*, no los JSON. Si editás los JSON pero no re-sincronizás,
ese usuario verá **datos viejos** sin darse cuenta. El script re-escribe el
bloque `EMBEDDED` dentro del HTML con exactamente el mismo `JSON.stringify()`
de los archivos fuente, y **no toca ninguna otra parte del archivo**.

> Si `sync-embedded.js` dice *"Sin cambios"* no hay nada que commitear de más:
> la copia ya coincide con los JSON. Correlo siempre igual, es idempotente.

---

## Verificación

```bash
# ¿La copia embebida del HTML está sincronizada con los JSON? (exit 0 sí / 1 no)
node prototipo/sync-embedded.js --check

# Suite de tests del sitio (incluye tests/prototipo.spec.js)
npx playwright test tests/prototipo.spec.js

# Suite completa (no romper nada del sitio real)
npx playwright test
```

En `package.json` del root hay atajos: `npm run proto:sync` y `npm run proto:check`.

---

## Requisitos

- **Internet** para el CDN: el botón *Descargar PDF* carga en runtime
  `pdf-lib@1.17.1`, `@pdf-lib/fontkit@1.1.1` y las fuentes **Roboto** (regular y
  bold) desde jsDelivr.
- **Sin internet**: la vista previa HTML **sí funciona** (no usa el CDN), pero
  la descarga del PDF **falla** con un mensaje claro en la barra de estado.
- Node.js ≥ 18 solo para el sync y los tests; el HTML en sí no necesita Node.

---

## Anatomía del archivo (`prototipo/generador-cv.html`)

Líneas aproximadas (pueden moverse al evolucionar el prototipo):

| Bloque | Línea aprox. | Qué hace |
|--------|------|----------|
| `<style>` | 8–217 | CSS completo: topbar, cards de perfil, hoja A4, dialog, responsive |
| `EMBEDDED` | 343–346 | Copia embebida de `cv-data.json` + `perfiles.json` (**la re-genera `sync-embedded.js`**) |
| `state` | 349–356 | Estado global: idioma, perfil, reclutador, descripción (persistido en `localStorage`) |
| `SECC` | 359–367 | Etiquetas de sección ES/EN (Resumen Profesional, Skills, …) |
| Utilidades | 369–374 | `$`, `$$`, `esc`, `L()` (selector bilingüe), `debounce` |
| `norm` / `STOPWORDS` / `tokenizeDescripcion` / `analyze` | 376–434 | Motor de **match ATS** determinista: normaliza el texto, saca stopwords y calcula match % por sección/keyword |
| `buildDoc` | 436–543 | Arma el documento (objeto) según idioma + perfil + descripción |
| `renderPreview` | 544–614 | Pinta la vista previa HTML (hoja A4) + badge de config |
| `renderMatch` | 616–650 | Panel "match con el puesto": % y chips de keywords encontradas/faltantes |
| `layoutPDF` | 786–852 | Convierte el doc a coordenadas PDF (escala, columnas, wraps) |
| `fitToPages` | 853–862 | **Ajusta a máx. 2 páginas** achicando la escala |
| `drawPDF` | 863–888 | Dibuja el PDF con pdf-lib (texto real y seleccionable) |
| `generateBytes` / `generateAndDownload` | 893–930 | Descarga el CDN, genera el PDF y lo descarga |
| `loadData` | 942–961 | `fetch('./data/*.json')`; si falla (`file://`) usa `EMBEDDED` |
| UI / eventos | 965–1047 | Cards de perfil, sync de la UI, dialog, `init()` |
| `window.__prototipo` | 1050–1056 | API mínima para tests automatizados (no afecta la UI) |

---

## Perfiles disponibles

Definidos en `prototipo/data/perfiles.json` (lista `perfiles[]`, cada uno con
`id`, `label` es/en, `descripcion`, `headline`, `resumen`, `orden_secciones`,
`prioridad_skills`, `keywords_ats`, …):

| `id` | Label (ES) |
|------|------------|
| `generalista` | Generalista QA (perfil por defecto) |
| `qa_manual` | QA Manual |
| `qa_automation` | QA Automation |
| `qa_api` | QA API |
| `frontend` | Frontend QA |

Si agregás un perfil nuevo, el prototipo lo muestra solo (las cards se generan
desde el JSON): **no hay que tocar el HTML**, pero sí correr el sync.

---

## Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---------|----------------|-----------|
| El PDF no se descarga y el status dice algo de CDN/internet | Sin conexión o CDN bloqueado | Revisá la conexión, mirá la consola del navegador (F12). La vista previa no depende del CDN |
| La vista previa se queda en *"Cargando vista previa…"* | Error de JS al renderizar | Abrí la consola: cualquier excepción aparece ahí |
| El CV muestra datos viejos | La copia embebida está desactualizada | `node prototipo/sync-embedded.js --check` → si falla, corré `node prototipo/sync-embedded.js` y commiteá juntos HTML + JSON |
| El PDF sale con **máximo 2 páginas** | **Es a propósito** | `fitToPages(doc, fonts, 2)` achica la escala para que quepa en 2 páginas ATS-friendly |
| Al abrir con doble clic dice "copia embebida" | Normal | Es la limitación de `file://`: no puede leer los JSON. Usá el sync para mantenerla al día |

---

## Para tests automatizados

El prototipo expone `window.__prototipo` con `getState()`, `buildDoc()`,
`renderAll()`, `generateBytes()` y `settings()` (devuelve `dataSource` y los
`keys` de los datos cargados). Lo usa `tests/prototipo.spec.js` (Playwright)
para verificar carga, preview, idioma, generación de PDF y el fallback `file://`
sin depender de selectores frágiles de la UI.

---

*Este README es la fuente de verdad para el archivo `prototipo/README.md`
referenciado en el footer del propio HTML (`generador-cv.html`, línea ~330).*