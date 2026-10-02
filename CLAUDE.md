# RIASCOS & BARRERA — sitio institucional

Especificación completa y fuente de verdad: @docs/ESPECIFICACION.md
Ante conflicto entre este archivo y la especificación, manda la especificación.

## Reglas que no se negocian

1. **No inventes contenido.** Todo el texto sale del Anexo A. Lo que falte se marca
   `[PENDIENTE: descripción]`. Nunca rellenes con texto plausible.
2. **Nada ficticio.** Sin testimonios, logos de clientes, cifras, premios, casos ni fotos de
   personas que no sean de la firma. Tampoco fotos de banco ni generadas por IA.
3. **Nunca prometas resultados.** "Nunca prometemos resultados. Prometemos una forma de
   trabajar." Aplica también a botones y mensajes de interfaz.
4. **Trato de "usted"** en todo el sitio.
5. **No redactes textos legales.** Las políticas las entrega la firma.
6. **El repositorio es público.** Nunca subas secretos, `.env.local`, `docs/insumos/` ni las
   fuentes Breve.
7. **No pidas claves por el chat.** Indica el archivo o el panel donde configurarlas.
8. **Logotipos tal cual.** No los redibujes, recolorees, deformes ni les añadas efectos.
9. **Sin datos personales del equipo.** El canal público es la línea institucional.
10. **Ante ambigüedad, pregunta.** No cambies el alcance en silencio.

## Tono

Técnico cuando hace falta, ejecutivo para decidir, cercano para dar confianza, pedagógico para
explicar. Nada de triunfalismo, prepotencia, alarmismo ni jerga jurídica innecesaria.
En texto corrido, siempre "Riascos & Barrera", con "&".

## Stack

Next.js App Router con `output: 'export'` · JavaScript con JSDoc, **no TypeScript** ·
Tailwind CSS · Motion con `LazyMotion` · Supabase (Postgres, Auth, Storage, Edge Functions) ·
TipTap + DOMPurify · Vitest, Testing Library, Playwright · ESLint y Prettier.

**Gestor de paquetes: pnpm.** Nunca npm, yarn ni bun.

Entorno: Node LTS vía nvm, pnpm vía corepack. Los shells no interactivos no cargan nvm:
antepón `source ~/.nvm/nvm.sh &&` a los comandos de Node y pnpm.

## Despliegue

GitHub Pages vía GitHub Actions. Hasta la Fase 7 el sitio vive en
`https://oscarnarvaez.github.io/pg_web_riascos_Barrera/` (`NEXT_PUBLIC_BASE_PATH=/pg_web_riascos_Barrera`),
con `noindex` global y `PERMITIR_PENDIENTES=true`. El dominio `riascosbarrera.com` tiene su DNS
en **Squarespace**, no en Namecheap, y aloja el correo de Google Workspace: no se toca el DNS sin
respaldo previo y confirmación registro por registro.

## Diseño

Cinco colores, ninguno más, ni blanco ni negro puros:
`--color-verde #133B36` · `--color-verde-gris #61726C` · `--color-oro #8C8264` ·
`--color-oliva #949378` · `--color-marfil #F9F8F2`

Oro solo para texto grande, íconos y foco (3,6:1). Verde-gris nunca sobre verde (2,4:1).
Nunca texto de cuerpo sobre oliva sólido.

Tipografías: Breve Sans Title (titulares) · Breve News (frases editoriales) ·
IBM Plex Sans (cuerpo e interfaz). Si Breve no está disponible, respaldo automático sin fallar.

Los tokens de CSS son la única fuente de colores, tipografías, espaciados, radios y curvas.
Nunca escribas un color literal en un componente.

Animación: solo `transform`, `opacity` y `filter`. Solo los seis momentos coreografiados de
§9.6. **No animes la entrada de cada bloque.** Respeta `prefers-reduced-motion` y
`prefers-reduced-transparency`.

El vidrio es para controles flotantes, nunca para bloques de texto de lectura.

## Accesibilidad y responsive

WCAG 2.1 AA. Anillo de foco en oro. Objetivos táctiles de 44 × 44 px. `dvh`/`svh`, nunca `vh`.
`env(safe-area-inset-*)` en barra, menú y botón flotante. Verificación obligatoria en 320, 375,
390, 430, 768, 1024, 1280, 1440, 1920 y 2560 px.

## Forma de trabajo

Trabaja por fases. Al cerrar cada una: pruebas, resumen, decisiones, pendientes, commit y
**detente a esperar aprobación**.

Commits pequeños y descriptivos, en español, sin atribuciones. Antes de cada commit verifica que
no entren secretos, `.env.local`, `docs/insumos/` ni fuentes Breve.

Los textos viven en `src/content/es/`, nunca dentro de los componentes.
Los datos de la firma viven en `src/config/firma.js`.
