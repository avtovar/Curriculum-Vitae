# AGENTS.md — Curriculum-Vitae (Static CV Site)

## Project Overview
Static personal CV/portfolio for **Ali Valentin Tovar Morales — QA Engineer**, deployed to **GitHub Pages** at `https://avtovar.github.io/Curriculum-Vitae/`. Single-page, bilingual (ES/EN), dark/light mode, EmailJS contact form.

## Tech Stack
- **HTML/CSS/JS** (vanilla, no framework)
- **GitHub Pages** for hosting (static export)
- **EmailJS** for contact form (client-side only)
- **Google Fonts**: Playfair Display (headings) + DM Sans (body)
- Build scripts: `build.js`, `convert-webp.js` (image optimization)

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Single-page CV: header, contact bar, about, skills, experience, projects, certs (tabs), education, footer/form |
| `css/style.css` | All styles: variables, reset, layout, components, dark mode, print, responsive, tabs, animations |
| `js/Formulario.js` | i18n (ES/EN), experience calculator, dark mode, language toggle, tabs, copy-to-clipboard, EmailJS form |
| `.github/workflows/static.yml` | Deploys `main` branch to GitHub Pages on push |
| `media/` | Logos, diplomas, degree images, OG cover (needs creation) |
| `Ali_Tovar_CV.pdf` | Downloadable CV |

## Developer Commands
```bash
# Local preview (any static server)
npx serve .          # or: python -m http.server 8000

# Image optimization (run before deploy if adding new images)
node convert-webp.js
node convert-webp2.js

# Build (if build.js does anything custom)
node build.js
```

## Critical Fixes Needed (from audit)
1. **OG image**: Create `media/og-cover.jpg` (1200×630) with photo + "QA Engineer | Fintech & Banking"; update meta tags in `index.html` lines 12, 15, 19, 22, 40 to use `https://avtovar.github.io/Curriculum-Vitae/media/og-cover.jpg`
2. **Canonical URL**: Fix `og:url` and `canonical` to `https://avtovar.github.io/Curriculum-Vitae/`
3. **"calculando..."**: Replace with static "Presente" in HTML (line 159); JS only appends duration
4. **Honeypot**: Already hidden via CSS (`.honeypot-field`), verify `aria-hidden="true"` on label
5. **Certificate links**: Rename files to kebab-case (no spaces/accents); fix mismatched extensions (e.g., `Fundamental Testing Certified` links to `.png` but says PDF); add `target="_blank" rel="noopener"`
6. **Consistent logos**: Add Edenor & Data System Tovar logos or use initials placeholder for all

## i18n System
- Translations in `js/Formulario.js` → `translations` object (ES/EN)
- HTML uses `data-i18n`, `data-i18n-content`, `data-i18n-placeholder`, `data-i18n-alt`, `data-i18n-aria`, `data-i18n-skill`, `data-i18n-tag`
- `setLanguage(lang)` updates all; persists in `localStorage.lang`
- **Adding new text**: add key to both `es` and `en` objects, add `data-i18n="key"` to element

## Dark Mode
- CSS variables in `:root` (light) and `body.dark-mode` (dark)
- Toggle persists in `localStorage.theme`; respects `prefers-color-scheme` if no stored pref
- Toggle button: `#darkToggle` (🌙/☀️)

## EmailJS Form
- Config placeholders in `index.html` line 536: `__EMAILJS_PUBLIC_KEY__`, `__EMAILJS_SERVICE_ID__`, `__EMAILJS_TEMPLATE_ID__`
- Replace with real values before deploy
- Honeypot field: `#honeypot` (hidden via CSS)
- Validation: required fields, email regex, min 10 chars message

## GitHub Pages Deploy
- Push to `main` → workflow `.github/workflows/static.yml` publishes to `gh-pages` branch
- Site lives at `/Curriculum-Vitae/` subpath → **all absolute URLs must include this prefix**
- Custom domain not configured

## Print Styles
- `@media print` hides: floating controls, contact bar, download button, footer, tabs
- Shows all tab content, compresses diplomas grid to 4 columns

## Common Tasks
| Task | Files to Edit |
|------|---------------|
| Add certificate | `index.html` (two places: featured + tabs), add image to `media/Diplomas/` |
| Update experience | `index.html` (experience bullets), `js/Formulario.js` (translations) |
| Change colors | `css/style.css` → `:root` variables (`--accent`, `--navy`, etc.) |
| Add language | Extend `translations` object, add case in `setLanguage()` |
| Fix OG image | Create `media/og-cover.jpg`, update `index.html` meta tags |

## Gotchas
- **Subpath**: All `og:url`, `og:image`, `twitter:image`, `canonical` must include `/Curriculum-Vitae/`
- **Certificate images**: Some are PDFs linked via `.jpg` preview — ensure preview exists
- **File names**: Spaces/accents break on GitHub Pages; use kebab-case
- **EmailJS keys**: Never commit real keys; use placeholders in repo, inject via GitHub Actions secrets if needed