# Memoria de Trabajo — CV Ali Tovar Morales

**Fecha:** 4 de octubre de 2026  
**Sitio:** https://avtovar.github.io/Curriculum-Vitae/  
**Regla obligatoria:** Todo cambio pasa por este flujo:

> **Solicitud de cambio → `@frontend-specialist` implementa → `@visual-reviewer` audita → SÍ hay bugs/comentar → `@frontend-specialist` corrige → `@visual-reviewer` re-audita → ENTREGAR**

---

## Registro de cambios (histórico)

### 2026-10-04 — Sesión 1: Auditoría inicial + Semana 1 crítica
| # | Cambio solicitado | Agente ejecutor | Estado | Notas visual-reviewer |
|---|---|---|---|---|
| 1 | Revisar proyecto y detectar bugs | @testing-test-results-analyzer | ✅ | 13 bugs P0/P1 encontrados |
| 2 | Fix hero invisible (textos blancos sobre blanco) | @frontend-specialist | ✅ | Aprobado — gradiente navy en header |
| 3 | Fix sticky nav no se pega | @frontend-specialist | ✅ | Aprobado — `overflow: clip` |
| 4 | Fix nav desalineada (margins negativos) | @frontend-specialist | ✅ | Aprobado |
| 5 | Fix "Presente (Presente...)" | @frontend-specialist | ✅ | Aprobado |
| 6 | Fix og-cover.jpg faltante | @frontend-specialist | ✅ | Aprobado — creado 1200×630 |
| 7 | Fix click email solo copiaba | @frontend-specialist | ✅ | Corregido después de @visual-reviewer: ahora copia y navega |
| 8 | Fix "Ver todos" pierde estado | @frontend-specialist | ✅ | Aprobado |
| 9 | Añadir 8 claves i18n faltantes | @frontend-specialist | ✅ | Aprobado |
| 10 | FSTC dice PDF pero era PNG | @frontend-specialist | ✅ | Corregido href a `certificate-fstc.pdf` |
| 11 | Nivel inglés inconsistente | @frontend-specialist | ✅ | HTML → "Básico" |
| 12 | Nav Contacto apuntaba a idiomas | @frontend-specialist | ✅ | `#contact-form` en footer |
| 13 | CSS duplicado + dorado residual | @frontend-specialist | ✅ | Limpieza parcial |

### 2026-10-04 — Sesión 2: Accesibilidad + limpieza
| # | Cambio solicitado | Agente ejecutor | Estado | Notas visual-reviewer |
|---|---|---|---|---|
| 14 | Auditoría WCAG 2.1 AA | @testing-accessibility-auditor | ✅ | 19 items encontrados |
| 15 | All parches de accesibilidad | @frontend-specialist | ✅ | `<main>`, skip link, ARIA tabs, aria-invalid, role=status, contrast form message, placeholder 0.65, focus visible global, print nav/back-to-top ocultos, reduced-motion JS |
| 16 | package.json type:module + CI guard | @engineering-devops-automator | ✅ | build.js no destructivo, CI falla sin secrets |
| 17 | Repo cleanup zip/folder/screenshot | @engineering-devops-automator | ✅ | `files(1).zip`, `Captura*`, `general.png`, `linkedin.png` borrados |

### 2026-10-04 — Sesión 3: Visual refinements
| # | Cambio solicitado | Agente ejecutor | Estado | Notas visual-reviewer |
|---|---|---|---|---|
| 18 | Remove dark mode toggle (luego restaurado) | Chat user | ↩️ Revertido | @frontend-specialist restauró dark mode por petición |
| 19 | Edenor dentro de Practia Global | @frontend-specialist | ✅ | HTML reestructurado, claves `exp.practia.edenor.*` |
| 20 | English level → "Básico" | Chat | ✅ | HTML + `langavail.english` ES/EN |
| 21 | 2 nuevos demo projects (math apps, job search) | @frontend-specialist | ✅ | +i18n ES/EN |
| 22 | Hover shadow más visible en project-cards | @frontend-specialist | ✅ | `0 20px 40px rgba(0,0,0,0.12)` / `0 20px 50px rgba(21,128,61,0.25)` |
| 23 | Skill tags Scrum/Fintech/IAApplied sin `.tool` | Chat user | ✅ | Añadida clase `.tool` a 3 tags |
| 24 | langavail li muy oscuro en dark mode | Chat user | ✅ | Cambiado a `#e2e8f0` |
| 25 | Subproject h4 sin sombra | Chat user | ✅ | border-left accent + text-shadow al hover |
| 26 | Sticky nav text invisible en light mode | Chat user | ✅ | `--text-muted` → `#0f172a` light / `#e2e8f0` dark |

---

## Próximas tareas pendientes (según audit report)

| Prioridad | Tarea | Estimación | Agente sugerido |
|-----------|-------|------------|----------------|
| P0 | Medir Lighthouse móvil y lograr >90 | 30 min | @testing-performance-benchmarker |
| P1 | Añadir `sitemap.xml` + `robots.txt` | 15 min | @frontend-specialist |
| P1 | Probar formulario EmailJS de extremo a extremo | 20 min | @testing-api-tester (local) + chat |
| P2 | README.md con captura + instrucciones | 20 min | @frontend-specialist |
| P2 | Pinear repo GitHub + topics + descripción | 10 min | Chat |
| P3 | Comprimir `curso-ia-de-0-a-agentes-domina-ia.pdf` (9.3 MB) | 10 min | @engineering-devops-automator |

---

## Checklist pre-deploy (obligatorio)

- [ ] `og:image` carga en Facebook/LinkedIn debuggers
- [ ] `canonical` = `https://avtovar.github.io/Curriculum-Vitae/`
- [ ] No hay "calculando..." ni "No completar este campo" visibles
- [ ] Formulario envía email real (test con EmailJS)
- [ ] Versión EN traduce **todo** (meta tags, certificados, formulario)
- [ ] Lighthouse móvil >90 (Perf, A11y, Best Practices, SEO)
- [ ] Print styles OK (oculta controles, muestra todo tabs, diplomas 4 cols)
- [ ] No archivos con espacios/acentos en `media/`
- [ ] Claves EmailJS **no** en repo (placeholders + secrets en Actions)
- [ ] `node --check js/Formulario.js` pasa
- [ ] `@visual-reviewer` último run sin bugs P0/P1 abiertos

---

## Notas de implementación (de la auditoría)

- **Subpath obligatorio**: Toda URL absoluta incluye `/Curriculum-Vitae/`
- **i18n**: Texto nuevo → clave en `translations.es` + `translations.en` + `data-i18n="key"` en HTML
- **Certificados**: Preview `.jpg`/`.png` para cada PDF; archivo = kebab-case
- **Colores**: Cambiar en `:root` (`--accent`, `--navy`, etc.) propaga a todo
- **Dark mode**: `body.dark-mode` overridea variables; `--white` **NO** se redefine en dark
- **Claves EmailJS**: NUNCA en repo. Placeholders `__EMAILJS_*__` + secrets en GitHub Actions