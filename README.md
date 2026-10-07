# Ali Valentin Tovar Morales

**QA Engineer | Manual & Automation Web y Mobile | API Testing | Azure DevOps | Atlassian**

Buenos Aires, Argentina

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)](https://avtovar.github.io/Curriculum-Vitae/)
[![Tests](https://img.shields.io/badge/Tests-Playwright-2EAD33)](https://github.com/avtovar/Curriculum-Vitae/actions)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ali--v--tovar-0A66C2)](https://www.linkedin.com/in/ali-v-tovar)
[![GitHub](https://img.shields.io/badge/GitHub-avtovar-24292f)](https://github.com/avtovar)

---

## 👤 Sobre Mí

Profesional del área de Informática con una sólida trayectoria en **Quality Assurance (QA)**, especializado en garantizar la robustez, eficiencia y alta calidad de productos de software en sectores críticos como **banca digital y fintech**. Cuento con amplia experiencia en pruebas funcionales, testing web, mobile (Android/iOS), back-end y front-end, operando bajo metodologías ágiles (Scrum) y utilizando herramientas líderes como Jira, Xray y Azure DevOps.

Desde 2025, he profundizado en la integración de la **Inteligencia Artificial aplicada** para potenciar la productividad y la automatización. Durante 2026, me he enfocado en soluciones basadas en **IA generativa y agentes inteligentes**, utilizando herramientas como **Claude, Claude Code y Claude Design** para la automatización de flujos de trabajo, generación de documentación técnica y asistencia avanzada en desarrollo y QA.

---

## 💼 Experiencia Destacada

### Brubank — QA Engineer
*abr 2021 — Presente · Buenos Aires, Argentina*

- Automatización de pruebas mobile y web con **Maestro Studio y JavaScript** (Android/iOS)
- Desarrollo de scripts con **Python y PyCharm** para optimizar procesos QA
- Testing de **APIs REST y GraphQL** con Postman
- Proyectos: Fail-Over, Promociones, QR, Tarjetas, eSIM, FCI, Pyme, Invitaciones
- Integración de **IA (Claude Code, Gemini)** para generación y análisis de casos de prueba

### Practia Global — Semi Senior QA Tester
*ago 2020 — mar 2021 · Cliente: Brubank*

- Pruebas en plataformas Android/iOS y Back-end
- Diseño y ejecución de casos de prueba en entornos ágiles

### QA Funcional — QA Tester
*ene 2020 — jul 2020 · Cliente: Edenor*

- Testing Web y Mobile, Testing Manual y Regresión

### Data System Tovar — Analista Tester QA
*sep 2018 — ago 2019 · Argentina*

- Análisis de Requerimientos y Testing Funcional de Caja Negra

### Protección Civil Miranda — Coordinador de Procesos Informáticos
*oct 2011 — may 2017 · Venezuela*

- Pruebas sistemáticas de software institucional y coordinación de infraestructura tecnológica

---

## 🧰 Habilidades

**QA:** Manual & Automation Testing · Web & Mobile Testing · API Testing (REST/GraphQL) · Análisis Funcional · Regresión & Smoke Testing · UX Validation · Gherkin · Documentación QA · Caja Negra / Caja Blanca

**Herramientas:** Maestro Studio · JavaScript · Python · PyCharm · Postman · Jira + Xray · Azure DevOps · GitHub / Git · Bantotal (On Host) · Claude Code · Claude Design · Gemini / ChatGPT · MySQL / SQL · Docker · RabbitMQ · SSH · Oracle JD Edwards

**Metodologías:** Agile & Scrum

**Sectores:** Fintech / Banking

---

## 🎓 Formación

- **Licenciatura en Administración, mención Informática** — Universidad Nacional Experimental Simón Rodríguez
- **Técnico Superior Universitario en Informática** — IUTIRLA

### Certificaciones Destacadas
- FSTC Certified (Software Testing)
- QA Tester / QA Avanzado / AcademiaQA Testing
- Front-End JS 2025
- HTML y CSS — Argentina Programa 4.0
- Git: Desarrollo Colaborativo
- Introducción a IA 2025 / IA: De 0 a Agentes / Aprende Claude desde cero
- Scrum Fundamentals
- Linux · Bases de Datos y SQL · Introducción a UX

---

## 📂 Estructura del Proyecto

Sitio estático de una sola página (SPA) sin frameworks, desplegado en **GitHub Pages**.

```
Curriculum-Vitae/
├── index.html                # Página principal (single-page CV)
├── css/
│   └── style.css             # Variables, layout, dark mode, print, responsive
├── js/
│   └── modules/              # JavaScript modular (ES Modules)
│       ├── main.js           # Toggle idioma, scroll, copy-to-clipboard
│       ├── i18n.js           # Traducciones ES/EN + setLanguage()
│       ├── theme.js          # Dark/light mode + localStorage
│       ├── tabs.js           # Tabs interactivos de diplomas
│       └── form.js           # Validación + EmailJS
├── tests/                    # Suites de Playwright
│   ├── accessibility.spec.js # axe-core (WCAG 2 A/AA)
│   ├── theme.spec.js         # Dark mode, persistencia, screenshots
│   └── form.spec.js          # Validación del formulario
├── .github/workflows/
│   ├── static.yml            # Deploy a GitHub Pages (on push a main)
│   └── tests.yml             # Playwright tests en CI
├── media/                    # Diplomas/, Título/, logos, OG cover
├── Ali_Tovar_CV.pdf          # CV descargable
├── build.js                  # Inyecta EmailJS desde env vars/CI
├── convert-webp.js           # Optimización de imágenes (WebP)
├── playwright.config.js      # Config de tests
├── robots.txt / sitemap.xml  # SEO
└── README.md
```

---

## 🚀 Funcionalidades del CV Interactivo

| Funcionalidad | Descripción |
|---|---|
| **Bilingüe (ES/EN)** | Toggle de idioma con persistencia en `localStorage` y traducción de todo el contenido |
| **Modo oscuro** | Respeta `prefers-color-scheme`, toggle manual con persistencia |
| **Experiencia dinámica** | Calcula automáticamente el tiempo en Brubank desde abril 2021 |
| **Portfolio de diplomas** | Tabs interactivos con 6 categorías y miniaturas visuales |
| **Contacto directo** | Formulario con EmailJS + honeypot anti-spam + copia al portapapeles |
| **Accesibilidad** | Contraste WCAG AA, landmarks semánticos, skip-link, alt decorativos, axe-core en CI |
| **Descarga PDF** | Botón de descarga del CV en formato PDF |
| **SEO** | OG image, canonical, robots.txt y sitemap.xml |
| **Responsive** | Diseño adaptado a desktop, tablet y móvil |

---

## 🛠️ Stack Tecnológico

`HTML5` · `CSS3` (Flexbox/Grid, variables CSS, animaciones) · `JavaScript Vanilla (ES Modules)` · `EmailJS` · `GitHub Pages` · `GitHub Actions` · `Playwright` · `axe-core`

---

## 🧪 Desarrollo y Testing

```bash
# Servidor local (cualquier static server)
npm run serve                # o: npx serve .

# Instalar navegador de tests (una vez)
npm run test:install

# Correr la suite completa de Playwright (16 tests)
npm test

# Optimizar imágenes (si se agregan nuevas)
node convert-webp.js
```

Los tests cubren: **accesibilidad (axe-core WCAG 2 A/AA)**, **dark mode** (persistencia y `prefers-color-scheme`) y **formulario** (validación, honeypot, tipos de input). Corren automáticamente en CI con cada push a `main`.

> ℹ️ En los tests de accesibilidad se desactivan las animaciones CSS porque las transiciones `fadeUp`/`fadeIn` parten de `opacity: 0` y generan falsos positivos de contraste si se escanea a mitad de animación.

---

## 📧 EmailJS (formulario de contacto)

El formulario usa **EmailJS** del lado del cliente. Por seguridad, las claves **nunca se commitean**; el repo mantiene placeholders (`__EMAILJS_PUBLIC_KEY__`, `__EMAILJS_SERVICE_ID__`, `__EMAILJS_TEMPLATE_ID__`).

Para activar el formulario en producción:

1. Crear un servicio y un template en [EmailJS](https://www.emailjs.com/).
2. Añadir 3 secrets en GitHub → **Settings → Secrets and variables → Actions**:
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
3. El workflow `static.yml` ejecuta `node build.js`, que inyecta las claves durante el deploy (si faltan, solo emite un warning y el deploy continúa).

También se puede inyectar localmente:

```bash
EMAILJS_PUBLIC_KEY=xxx EMAILJS_SERVICE_ID=xxx EMAILJS_TEMPLATE_ID=xxx node build.js
```

---

## 🔗 En Vivo

[https://avtovar.github.io/Curriculum-Vitae/](https://avtovar.github.io/Curriculum-Vitae/)

---

© 2026 Ali Valentin Tovar Morales · QA Engineer especializado en automatización y procesos ágiles