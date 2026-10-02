# Especificación del proyecto — Sitio web institucional RIASCOS & BARRERA (Fase 1)

> Documento fuente de verdad del proyecto. Ubicación en el repositorio: `docs/ESPECIFICACION.md`.
> Repositorio: https://github.com/OscarNarvaez/pg_web_riascos_Barrera
> Desarrollador responsable: Oscar Julián Narváez. Versión 2.0 — 2 de octubre de 2026.
> La versión 2.0 reemplaza por completo a la 1.0: cambian el hosting, la base de datos, el stack y la dirección visual.
> **Revisión 2.0.1 (2 de octubre de 2026, cierre de la Fase 0):** gestor de paquetes pnpm; el dominio está registrado y con DNS en Squarespace, no en Namecheap; ruta de paginación de publicaciones; `PERMITIR_PENDIENTES` durante las Fases 1–6; `noindex` mientras el sitio viva en github.io.
> **Revisión 2.0.2 (2 de octubre de 2026, Fase 1):** decisiones del cliente sobre A.2.5 (se omite), cobertura (regional con alcance nacional), Equipo (activo solo con la ficha de Marcela Riascos Eraso), nombre de la sección de casos ("Casos de éxito") y licencia del repositorio (todos los derechos reservados). El dominio propio se configura al final del proyecto.

---

## 1. Contexto del proyecto

**Cliente.** RIASCOS & BARRERA es una firma boutique de asesoría y litigio estratégico con sede en Pasto (Nariño, Colombia), especializada en derecho público, contratación estatal, litigio administrativo, derecho laboral y derecho privado. Su concepto de marca es **"Inteligencia para decidir"**. Atiende a entidades públicas, empresas privadas, contratistas del Estado, sociedades comerciales, inversionistas y personas naturales.

**Propósito del sitio.** Presentar de forma detallada y profesional a la firma, su enfoque, sus áreas de práctica, su método y su equipo; habilitar canales de contacto que capturen información útil para la estrategia comercial (origen del contacto, recomendaciones, pauta digital); y disponer de un espacio propio de publicación de contenido jurídico, administrable por la firma.

**Audiencia.** Directivos de entidades públicas, gerentes y áreas jurídicas de empresas, contratistas del Estado, inversionistas y personas naturales que enfrentan decisiones jurídicas de alto impacto. Es un público exigente, que juzga la seriedad de la firma por la seriedad del sitio.

**Fase del proyecto.** Este documento cubre únicamente la **Fase 1 – Portafolio de servicios generales**. Existe un contrato firmado con alcance cerrado. Todo lo listado en la sección 18 ("Fuera de alcance") **no se construye**, aunque la arquitectura debe permitir añadirlo después sin rehacer el trabajo.

**Plazo.** El cliente necesita el sitio pronto. Prioriza un resultado sólido, elegante y rápido sobre funcionalidades accesorias.

---

## 2. Reglas no negociables

Estas reglas prevalecen sobre cualquier otra instrucción del documento. Si alguna tarea entra en conflicto con ellas, detente y pregunta.

1. **No inventes contenido.** Todo el texto institucional sale del **Anexo A**. Donde falte información, usa un marcador visible con este formato exacto: `[PENDIENTE: descripción de lo que falta]`. Nunca rellenes con texto plausible.
2. **Nada ficticio.** Prohibido usar testimonios, logos de clientes, cifras, premios, reconocimientos, casos o estadísticas inventados. Prohibido usar fotografías de personas que no sean integrantes reales de la firma, incluidas fotos de banco o generadas por IA. Mientras no haya fotografías, se usan los espacios definidos en el **Anexo B**.
3. **Nunca prometer resultados.** Es la promesa central de la marca: *"Nunca prometemos resultados. Prometemos una forma de trabajar."* Ningún texto del sitio, incluidos mensajes de interfaz, botones o casos, puede sugerir resultados garantizados.
4. **Trato de "usted".** Todo el sitio se dirige al visitante en segunda persona formal ("Agende su consulta", "Escríbanos").
5. **Tono de marca:** técnico cuando el contexto lo requiera, ejecutivo para facilitar decisiones, cercano para generar confianza y pedagógico para explicar lo complejo. Evitar el lenguaje excesivamente jurídico, el triunfalismo, la prepotencia, el alarmismo y las promesas imposibles.
6. **No redactes textos legales.** La política de privacidad y la de tratamiento de datos personales las entrega la firma. Mientras tanto, esas páginas muestran un marcador `[PENDIENTE: ...]`.
7. **Información confidencial.** Nada sobre estructura societaria, honorarios, metas de facturación, remuneración del equipo o alianzas comerciales internas aparece en el sitio, en el código, en los comentarios ni en los datos de prueba.
8. **Datos personales del equipo.** No publiques números de teléfono personales de los abogados. El canal público es la línea institucional de la firma.
9. **Contenido de terceros.** Las "Lecturas recomendadas" muestran únicamente título, fuente, enlace y un comentario breve escrito por la firma. Nunca se reproduce el contenido del artículo externo.
10. **Logotipos oficiales.** Los logotipos están en la carpeta `logos/` del repositorio. Úsalos tal cual: no los redibujes, no los recolorees fuera de las variantes entregadas, no los deformes ni les añadas efectos.
11. **El repositorio es público.** GitHub Pages en plan gratuito exige repositorio público: **todo lo que se suba al repositorio es visible para cualquiera.** Que sea visible no significa que sea reutilizable: el repositorio no tiene licencia de uso, todos los derechos están reservados (ver `LICENSE`). Nunca subas claves secretas, el archivo `.env.local`, documentos del cliente (`docs/insumos/`) ni archivos de fuentes con licencia comercial (ver 9.4). La seguridad de los datos depende de las políticas RLS de Supabase, no de ocultar código.
12. **Secretos fuera de la conversación.** No pidas al desarrollador que pegue claves secretas en el chat. Indica en qué archivo o en qué panel de secretos deben configurarse.
13. **No cambies el alcance en silencio.** Si algo de esta especificación es contradictorio, ambiguo o imposible con la arquitectura definida, detente, explícalo y pregunta.

---

## 3. Arquitectura y stack

### 3.1 Restricciones de infraestructura
- **Hosting:** GitHub Pages, desde el repositorio `OscarNarvaez/pg_web_riascos_Barrera`. Solo sirve archivos estáticos: no hay servidor, no hay PHP, no hay Node.js en ejecución, no se pueden configurar cabeceras HTTP ni redirecciones del lado del servidor.
- **Dominio:** `riascosbarrera.com`, registrado en **Squarespace Domains**, con DNS gestionado en Squarespace. Hoy sirve una página "Próximamente" de Squarespace. Se apuntará a GitHub Pages en la Fase 7 (16.2); hasta entonces el sitio vive en la URL de github.io (4.2).
- **Datos, autenticación, archivos y lógica de servidor:** **Supabase**, proyecto `https://duhmgtjnlvwfgvdoqngz.supabase.co` (Postgres, Auth, Storage y Edge Functions).

### 3.2 Por qué prerenderizado y no una SPA pura
GitHub Pages no soporta bien el enrutamiento de una aplicación de una sola página: una ruta profunda como `/la-firma` solo funciona redirigiendo desde `404.html`, que se sirve con código HTTP 404. Eso perjudica la indexación en Google y hace que las vistas previas al compartir una publicación en WhatsApp o LinkedIn muestren siempre la misma tarjeta genérica, porque esos rastreadores no ejecutan JavaScript.

Por eso el sitio se **prerenderiza a HTML estático en el momento de compilar**: cada página y cada publicación existe como un archivo `index.html` real, con sus metadatos y su vista previa propia, servido con código 200.

### 3.3 Stack
- **Framework:** **Next.js** (App Router) en su versión estable más reciente, con **exportación estática** (`output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`). Next.js es React: cumple el requisito de React y resuelve el prerenderizado.
- **Lenguaje:** **JavaScript** (no TypeScript). Usa JSDoc donde ayude a la claridad.
- **Estilos:** **Tailwind CSS** en su versión estable más reciente. Los tokens de diseño se definen en CSS (con `@theme` si es Tailwind 4) y son la única fuente de colores, tipografías, espaciados, radios y curvas de animación.
- **Animación:** **Motion** (`motion/react`, sucesor de Framer Motion), cargado de forma diferida (`LazyMotion`) para no penalizar el peso del JavaScript.
- **Datos:** `@supabase/supabase-js` con la **clave pública** (anon / publishable) en el navegador y en la compilación. La clave secreta (service role) **solo** existe dentro de las Edge Functions.
- **Editor del panel:** TipTap. Todo HTML se sanea con DOMPurify (versión isomórfica) tanto al renderizar en compilación como en el navegador.
- **Calidad:** ESLint y Prettier. Pruebas con Vitest y Testing Library; pruebas de extremo a extremo con Playwright.
- **Gestor de paquetes:** **pnpm** (lockfile `pnpm-lock.yaml`). No se usan npm, yarn ni bun.
- **Entorno local:** Ubuntu Linux con Node.js LTS (vía nvm), pnpm (vía corepack) y la CLI de Supabase.

### 3.4 Diagrama

```
Visitante ─► GitHub Pages (HTML prerenderizado, dominio propio, HTTPS)
               │
               ├─ lectura pública en el navegador (clave anon + RLS)
               │     └─► Supabase Postgres: buscador, respaldo de publicaciones nuevas
               │
               └─ envío de formularios
                     └─► Edge Function "enviar-formulario"
                            ├─► valida, Turnstile, límite de envíos
                            ├─► inserta en tabla leads (service role)
                            └─► correos vía Resend

Panel /panel (React en el navegador) ─► Supabase Auth + Postgres + Storage (RLS por rol)
        │
        └─ cambio de contenido publicado
              └─► Webhook de base de datos ─► Edge Function "reconstruir-sitio"
                     └─► GitHub repository_dispatch ─► GitHub Actions
                            └─► next build (lee Supabase) ─► despliegue en GitHub Pages
```

### 3.5 Publicación de contenido sin servidor
- Las páginas de publicaciones se generan **en la compilación**, leyendo de Supabase.
- Cuando el panel publica, edita o retira contenido, un **webhook de base de datos** invoca la Edge Function `reconstruir-sitio`, que dispara un evento `repository_dispatch` (tipo `contenido-actualizado`) en GitHub. El flujo de GitHub Actions recompila y despliega. El sitio se actualiza en pocos minutos.
- El flujo de Actions usa un grupo de concurrencia con cancelación del despliegue en curso, de modo que varias ediciones seguidas producen una sola compilación final.
- **Publicación programada:** el flujo también corre **cada hora** por `schedule`. Una publicación con `published_at` futuro aparece en la primera compilación posterior a esa hora.
- **Respaldo inmediato:** si alguien visita una publicación recién creada antes de que termine la compilación, `404.html` detecta las rutas `/publicaciones/{slug}/` y la carga desde Supabase en el navegador. Es un respaldo; la versión prerenderizada sigue siendo la principal.
- El panel muestra tras publicar: "Su publicación estará visible en el sitio en unos minutos." y ofrece un botón "Actualizar el sitio ahora" que invoca la misma función.

---

## 4. Arquitectura de información

### 4.1 Rutas públicas (con barra final por `trailingSlash`)

| Ruta | Página | Generación |
|---|---|---|
| `/` | Inicio | Estática |
| `/la-firma/` | La Firma | Estática |
| `/areas-de-practica/` | Áreas de Práctica (una página con anclas por área) | Estática |
| `/equipo/` | Equipo (activable por configuración) | Estática |
| `/publicaciones/` | Artículos y casos de la firma | Estática, en compilación |
| `/publicaciones/pagina/{n}/` | Páginas 2 en adelante del listado (5.5) | Estática, en compilación |
| `/publicaciones/{slug}/` | Detalle de una publicación | Estática, en compilación |
| `/publicaciones/etiqueta/{slug}/` | Publicaciones por etiqueta | Estática, en compilación |
| `/publicaciones/casos/` | Listado de casos | Estática, en compilación |
| `/lecturas-recomendadas/` | Lecturas recomendadas (sección aparte) | Estática, en compilación |
| `/buscar/?q=` | Resultados del buscador | Página estática; resultados en el navegador |
| `/contacto/` | Contacto, formularios, mapa y cobertura | Estática |
| `/contacto/gracias/` | Confirmación tras enviar un formulario | Estática |
| `/politica-de-privacidad/` | Política de privacidad | Estática |
| `/politica-de-tratamiento-de-datos/` | Política de tratamiento de datos | Estática |
| `/panel/...` | Panel de administración | Estática; funciona en el navegador |
| `/sitemap.xml`, `/robots.txt` | SEO | Generados en compilación |

### 4.2 Ruta base
Mientras el dominio propio no esté activo, el sitio vive en `https://oscarnarvaez.github.io/pg_web_riascos_Barrera/`. La ruta base se controla con `NEXT_PUBLIC_BASE_PATH` (vacía con dominio propio, `/pg_web_riascos_Barrera` sin él). Todos los enlaces, imágenes, fuentes y recursos deben respetarla. Mientras `NEXT_PUBLIC_SITE_URL` apunte a github.io, todo el sitio lleva `noindex` (10) para que Google no indexe la URL temporal.

### 4.3 Navegación
- **Encabezado:** logotipo horizontal · La Firma · Áreas de Práctica · Equipo (si está activo) · Publicaciones · Contacto · icono de búsqueda · botón **"Agende su consulta"** (lleva a `/contacto/#consulta`).
- **Móvil:** menú a pantalla completa con transición elegante; el botón principal visible en todo momento.
- **Pie de página:** logotipo, línea "Boutique Legal Strategy · Público · Privado", dirección, canales confirmados, navegación por columnas, enlaces a las dos políticas y año en curso.
- **Botón flotante de WhatsApp** en todas las páginas públicas (8.5).

> "Agende su consulta" lleva al formulario de solicitud de consulta. En esta fase **no existe agendamiento con calendario**: no construyas calendarios, disponibilidad ni reservas.

---

## 5. Especificación por página

Los textos están en el **Anexo A** y las imágenes en el **Anexo B**. Aquí se define estructura y comportamiento. Las animaciones se detallan en 9.6.

### 5.1 Inicio
Cada sección transmite **una sola idea** y ocupa, en escritorio, aproximadamente una pantalla. El texto A.2.5 ("Propuesta de valor") **no se publica**, por decisión del cliente. Orden:

1. **Hero.** "Inteligencia para decidir." y "Estrategia jurídica para decisiones que importan." Acciones: "Agende su consulta" y "Conozca nuestras áreas". Imagen `inicio-hero` (escritorio) e `inicio-hero-movil` (móvil). Sin carruseles.
2. **Qué hacemos.** "Más que asesoría jurídica, aportamos criterio para decidir." Las cuatro lógicas se iluminan una a una con el desplazamiento. Imagen `inicio-que-hacemos`.
3. **El nuevo entorno.** Los cinco factores y la conclusión, sobre fondo verde profundo.
4. **Pensamos antes de litigar.** Secuencia fija con desplazamiento: los cuatro verbos del modelo reactivo se transforman en los cuatro de la estrategia de la firma. **Es el momento visual distintivo del sitio.**
5. **Áreas de práctica.** Las cuatro áreas en una cuadrícula tipo mosaico de tamaños distintos, cada una enlazada a su ancla en `/areas-de-practica/`.
6. **Las cuatro perspectivas.** Jurídica, institucional, empresarial y estratégica, y la comparación "firma tradicional / Riascos & Barrera".
7. **Nuestro método.** Los cuatro pasos 01–04 con una línea de progreso que avanza con el desplazamiento.
8. **Nuestra promesa.** La frase central en gran formato con la tipografía secundaria, y los seis compromisos.
9. **Equipo (vista previa).** Solo si la sección está activa.
10. **Cobertura.** Resumen de la cobertura territorial con enlace a Contacto.
11. **Publicaciones recientes.** Las tres últimas de la firma. Si no hay ninguna, la sección no se muestra.
12. **Cierre.** "Cuando las decisiones importan, el criterio marca la diferencia." Imagen `inicio-cierre` y llamado a la acción.

### 5.2 La Firma
Encabezado con `firma-portada`. Presentación, propósito, visión, posicionamiento, atributos de marca, "¿Por qué elegirnos?", galería con `firma-oficina-01` y `firma-oficina-02`, y la promesa extendida. Ver A.3.

### 5.3 Áreas de Práctica
Una sola página con **subnavegación fija** con las cuatro áreas, que resalta el área visible. Introducción, las cuatro áreas con ancla propia (`#derecho-publico`, `#litigio-administrativo`, `#derecho-laboral`, `#derecho-privado`) y su imagen (`area-...`), los servicios del acompañamiento integral, el párrafo de las cuatro perspectivas y llamado a la acción. Las páginas individuales por área **son de la Fase 2**: no las crees.

### 5.4 Equipo
- Controlada por `NEXT_PUBLIC_EQUIPO_ACTIVO` (por defecto `true`). Si está en `false`, la página no se genera, desaparece del menú, de la vista previa de Inicio y del sitemap.
- Integrantes definidos en `src/config/firma.js` (los actualiza el desarrollador en esta fase).
- **Decisión del cliente:** la sección arranca activa **solo con la ficha de Marcela Riascos Eraso**, la única con biografía. Mientras su cargo siga pendiente, la ficha se publica sin cargo. Los demás integrantes se añaden a medida que la firma los confirme.
- Encabezado con `equipo-grupal`. Ficha: retrato (`equipo-...`), nombre, cargo, enfoque, "Aporta criterio..." y biografía si existe; la biografía larga se despliega en un panel o modal accesible.
- La información está **pendiente de confirmación** (A.5 y sección 20).

### 5.5 Publicaciones
- **Listado:** artículos y casos de la firma, más recientes primero, 9 por página (paginación estática `/publicaciones/pagina/2/`), filtros por etiqueta y por tipo, lista de etiquetas.
- **Detalle:** título, fecha, autor, minutos de lectura, portada con texto alternativo, contenido con tipografía de lectura cuidada, etiquetas enlazadas, botones de compartir (LinkedIn, WhatsApp, copiar enlace; sin scripts de terceros) y hasta 3 **publicaciones relacionadas** por etiquetas compartidas.
- **Casos:** llevan al final, obligatoriamente: *"Cada asunto es distinto. La experiencia en casos anteriores no garantiza resultados en casos futuros."* El nombre visible de la sección ("Casos de éxito", "Casos" o "Aprendizajes") es configurable. **Decisión del cliente: "Casos de éxito".** Como ese nombre roza la regla 3, el aviso aparece también en el encabezado del listado de casos, no solo al final de cada caso.
- **Lecturas recomendadas:** sección aparte, no mezclada con las publicaciones propias. Cada elemento: título, fuente, fecha, comentario de la firma y enlace externo (`target="_blank" rel="noopener noreferrer nofollow"`). Comparten el sistema de etiquetas.
- **Etiquetas:** página propia por etiqueta. Solo se generan etiquetas con al menos un contenido publicado.
- **Sin portada:** las publicaciones sin imagen usan una portada tipográfica generada con los tokens de la marca (no una foto genérica).

### 5.6 Buscador
- Se abre desde el icono del encabezado como **capa superpuesta** a pantalla completa con campo de búsqueda, resultados en vivo (con retardo de 250 ms) y etiquetas sugeridas. También existe la página `/buscar/?q=` para resultados completos y enlaces directos.
- Busca en publicaciones **publicadas** y lecturas recomendadas mediante una función RPC de Postgres con búsqueda de texto completo en español, insensible a tildes y mayúsculas (6.4).
- Resultados con conteo y fragmento resaltado. Estado vacío útil: etiquetas populares y enlace a contacto.
- La página de resultados lleva `noindex`.

### 5.7 Contacto
- Datos de contacto confirmados (los no confirmados no se muestran en producción, ver 14.4).
- Dos formularios (sección 8): **contacto general** y **solicitud de consulta** (ancla `#consulta`).
- **Ubicación:** Google Maps incrustado (iframe, sin API de pago) de la sede en el Edificio Hito, cargado mediante **fachada**: se muestra `contacto-edificio-hito` con el botón "Ver mapa", y solo al hacer clic se carga el iframe.
- **Cobertura:** mapa SVG simplificado del suroccidente colombiano que resalta los departamentos configurados (por defecto, según la reunión del 30 de septiembre: **Nariño, Putumayo y Cauca**). Cartografía de dominio público o licencia libre (por ejemplo, Natural Earth); documenta la fuente en el código.
- **Criterio de cobertura (decisión del cliente): regional con alcance nacional.** El mapa resalta Nariño, Putumayo y Cauca como presencia prioritaria, y la página indica que la firma atiende en todo el país de forma virtual. Así no contradice A.3.1 ("cobertura en todo el territorio nacional"), que se publica tal cual. El párrafo de cobertura sigue pendiente de redacción por la firma.

### 5.8 Políticas legales
Dos páginas que renderizan archivos Markdown (`src/content/legal/politica-privacidad.md` y `src/content/legal/politica-tratamiento-datos.md`). Mientras la firma no los entregue, contienen `[PENDIENTE: texto entregado por la firma]`. Cada archivo lleva en su encabezado la versión y la fecha de vigencia; la versión se registra con cada consentimiento (8.3).

### 5.9 Páginas de sistema
- **404:** con la identidad del sitio, salida útil (inicio, publicaciones, contacto) y la lógica de respaldo de publicaciones nuevas (3.5).
- Los errores explican qué pasó y qué hacer; no se disculpan ni son vagos.

---

## 6. Base de datos (Supabase)

### 6.1 Reglas generales
- Todo el esquema se versiona como migraciones SQL en `supabase/migrations/` y se aplica con la CLI de Supabase. Nada se crea a mano en el panel de Supabase sin reflejarlo en una migración.
- **RLS activado en todas las tablas**, sin excepción. Las políticas se prueban (sección 15).
- Registro público de usuarios **desactivado** en Supabase Auth. Los usuarios del panel los crea un administrador.

### 6.2 Tablas

**`profiles`** — `id` (= `auth.users.id`), `full_name`, `job_title`, `role` (`admin` | `editor`), `created_at`. Funciones auxiliares `es_editor()` y `es_admin()` (`security definer`, con `search_path` fijo) para las políticas.

**`posts`** — artículos y casos de la firma:
- `type`: `articulo` | `caso`
- `title`, `slug` (único; generado del título con transliteración de tildes y eñes; editable)
- `excerpt` (máx. 300 caracteres)
- `body_html` (HTML saneado) y `body_text` (texto plano para el buscador)
- `cover_path` y `cover_alt` (texto alternativo obligatorio si hay portada)
- `author_id` → `profiles`
- `practice_area`: nulo o una de las cuatro áreas
- `status`: `borrador` | `publicado`
- `published_at` (fecha futura = programada)
- `is_anonymized` (booleano; **restricción en base de datos: un caso publicado debe tenerlo en `true`**)
- `meta_title`, `meta_description`, `og_image_path`
- `reading_minutes`, `previous_slugs` (arreglo, para redirecciones)
- `created_at`, `updated_at`, `deleted_at` (borrado lógico)
- `search_vector` (ver 6.4)

**`external_reads`** — lecturas recomendadas: `title`, `source_name`, `url`, `comment` (máx. 500), `status`, `published_at`, `created_at`, `updated_at`, `deleted_at`, `search_vector`.

**`tags`** — `name`, `slug`, `description`. Tablas de relación `post_tags` y `external_read_tags`.

Etiquetas iniciales (semilla, modificables por la firma): Criterio, Normativa, Preguntas frecuentes, SECOP, Contratación estatal, Litigio administrativo, Derecho laboral, Derecho privado, Cumplimiento normativo.

**`leads`** — contactos recibidos:
- `form_type` (`contacto` | `consulta`), `name`, `email`, `phone`, `organization`, `client_type`, `practice_area`, `message`
- `how_found`, `referred_by`, `referral_code`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `landing_page`, `referrer_url`
- `consent_accepted`, `consent_at`, `consent_policy_version`, `consent_ip`, `consent_user_agent`
- `status` (`nuevo` | `atendido` | `descartado`), `internal_notes`, `created_at`

**`referral_partners`** — `name`, `code` (único, mayúsculas sin espacios), `active`, `notes`.

**`rate_limits`** — registro de envíos por IP con hash, para el límite de la Edge Function. Sin acceso público.

### 6.3 Políticas RLS

| Tabla | Público (anon) | Editor | Admin |
|---|---|---|---|
| `posts`, `external_reads` | Leer solo si `status = 'publicado'`, `published_at <= now()` y `deleted_at is null` | Todo | Todo |
| `tags` y relaciones | Leer | Todo | Todo |
| `leads` | **Nada** (ni leer ni insertar) | Nada | Leer y actualizar estado y notas |
| `referral_partners` | Nada | Nada | Todo |
| `profiles` | Nada | Leer el propio | Todo |
| `rate_limits` | Nada | Nada | Nada |

Los contactos **solo** se insertan desde la Edge Function con la clave secreta. Un editor nunca ve datos personales de contactos.

### 6.4 Búsqueda
- Extensión `unaccent`, envuelta en una función `IMMUTABLE` para poder usarla en columnas generadas e índices.
- `search_vector` generado con `to_tsvector('spanish', ...)` sobre título (peso A), extracto y etiquetas (peso B) y texto del cuerpo (peso C), con índice GIN.
- Función RPC `buscar_contenido(q text, limite int)` (`security invoker`) que devuelve solo contenido publicado, con ranking, fragmento resaltado (`ts_headline`) y soporte de prefijos para palabras incompletas.

### 6.5 Storage
- Bucket **`publicaciones`**: lectura pública; escritura solo para editores y administradores.
- El plan gratuito de Supabase no incluye transformación de imágenes: el panel **redimensiona y convierte a WebP en el navegador** antes de subir (7.3).

---

## 7. Panel de administración (`/panel`)

Aplicación React dentro del mismo proyecto, renderizada en el navegador, con `noindex`, excluida del sitemap y bloqueada en `robots.txt`. Su seguridad depende de Supabase Auth y de RLS, no de que la ruta sea secreta.

### 7.1 Acceso
- Inicio de sesión con correo y contraseña (Supabase Auth). Recuperación de contraseña en `/panel/restablecer/`.
- Cierre de sesión por inactividad tras 60 minutos.
- Roles **editor** (publicaciones, lecturas, etiquetas) y **admin** (todo, más contactos, referentes y usuarios). La interfaz oculta lo que el rol no puede usar; RLS lo impide de verdad.

### 7.2 Módulos
- **Tablero:** contactos de los últimos 30 días por origen, referente y campaña (solo admin); publicaciones recientes; botón "Actualizar el sitio ahora".
- **Publicaciones:** listado con búsqueda y filtros; crear, editar, previsualizar con el mismo componente del sitio público, publicar, programar, despublicar y enviar a la papelera. Editor TipTap con títulos, párrafos, listas, negritas, cursivas, citas y enlaces; imágenes con texto alternativo obligatorio. Selector de tipo; si es "caso", la casilla **"Confirmo que este caso está anonimizado y no revela la identidad del cliente"** es obligatoria para publicar. Pestaña SEO con contador de caracteres y vista previa de cómo se verá en Google.
- **Lecturas recomendadas:** CRUD con validación de URL.
- **Etiquetas:** CRUD; eliminar una etiqueta en uso exige confirmación explícita.
- **Contactos (solo admin):** listado con filtros por fecha, tipo, cómo nos conoció, referente, campaña y estado; detalle; edición de estado y notas; **exportación a CSV** en el navegador.
- **Referentes (solo admin):** CRUD; cada ficha muestra el enlace listo para compartir (`https://riascosbarrera.com/?ref=CODIGO`) con botón de copiar y el número de contactos atribuidos.
- **Usuarios (solo admin):** listado e invitación de nuevos usuarios mediante una Edge Function `invitar-usuario`.

### 7.3 Imágenes en el panel
Al seleccionar una imagen: validar tipo (JPEG, PNG, WebP) y tamaño (máx. 10 MB); en el navegador, eliminar metadatos, convertir a WebP y generar dos variantes (1600 px y 800 px de ancho); subir ambas al bucket con nombre único.

### 7.4 Diseño del panel
Usa los mismos tokens que el sitio, con prioridad en la claridad y la eficiencia, no en la animación. Todo en español.

---

## 8. Formularios, captación y medición

### 8.1 Formulario de contacto general
Nombre*, correo*, teléfono, mensaje*, ¿Cómo nos conoció?*, ¿Quién nos recomendó? (visible solo si eligió "Recomendación"), consentimiento*.

### 8.2 Formulario de solicitud de consulta (`#consulta`)
Los campos anteriores, más: área de interés* (las cuatro áreas y "No estoy seguro"), tipo de cliente (Entidad pública, Empresa privada, Contratista del Estado, Persona natural, Otro) y organización.

**Opciones de "¿Cómo nos conoció?":** Recomendación de un cliente, colega o aliado · Búsqueda en Google · Redes sociales · Publicidad digital · Evento o conferencia · Pendón o código QR · Otro.

### 8.3 Consentimiento (Ley 1581 de 2012)
- Casilla **no marcada por defecto**, obligatoria: "Autorizo a Riascos & Barrera el tratamiento de mis datos personales de acuerdo con su Política de Tratamiento de Datos Personales." El nombre de la política enlaza a su página.
- La Edge Function registra fecha, versión vigente de la política, IP (tomada de la petición) y agente de usuario como evidencia.

### 8.4 Atribución: origen, referentes y pauta digital
- Un script ligero captura, en la primera visita, `utm_*`, `gclid`, `fbclid` y `ref`, la página de aterrizaje y el referrer, y los guarda en `localStorage` con fecha. Modelo de **primer contacto**: no se sobrescribe durante 90 días.
- Al enviar un formulario, esa atribución viaja con los datos a la Edge Function.
- Si `ref` corresponde a un referente activo, la función registra el código; si no existe, lo ignora.
- El pendón institucional de la firma usará un código QR. Documenta en el manual cómo construir esa URL (por ejemplo `?utm_source=pendon&utm_medium=qr&utm_campaign=evento`).

### 8.5 Edge Function `enviar-formulario`
1. Verifica el token de **Cloudflare Turnstile** (gratuito, sin cookies de seguimiento).
2. Rechaza si el campo trampa (honeypot) viene lleno o si el formulario se envió en menos de 3 segundos.
3. Aplica el límite de 5 envíos por hora por IP usando `rate_limits`.
4. Valida todos los campos en el servidor y exige el consentimiento.
5. Inserta el contacto con la clave secreta.
6. Envía la notificación a `LEADS_EMAIL` con los datos, la atribución y el enlace al registro en el panel, y, si está activado, el correo de confirmación al usuario en tono de marca (la firma se compromete a responder en menos de 24 horas).
7. Responde con un error claro por campo o con éxito; el navegador redirige a `/contacto/gracias/`.

Correo transaccional mediante **Resend**, con el dominio `riascosbarrera.com` verificado por DNS (ver 16.3).

### 8.6 WhatsApp
- Botón flotante con efecto de vidrio, respetando las zonas seguras del dispositivo (`env(safe-area-inset-*)`), y enlace en Contacto: `https://wa.me/{numero}?text={mensaje}` con el mensaje "Hola, me comunico desde el sitio web de Riascos & Barrera. Quisiera recibir orientación sobre..."
- Número desde `NEXT_PUBLIC_WHATSAPP`. **Si no está configurado, el botón no se muestra.**

### 8.7 Medición para la agencia digital
- **Google Tag Manager** mediante `NEXT_PUBLIC_GTM_ID` (sin valor, no se carga nada).
- Eventos al `dataLayer`: `generate_lead` (con `form_type` y `practice_area`), `whatsapp_click`, `phone_click`, `email_click`.
- `/contacto/gracias/` es la URL de conversión, con `noindex`.
- **Aviso de cookies** sencillo y elegante: con `NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=true` (por defecto), GTM solo se carga tras aceptar. La preferencia se recuerda.

---

## 9. Sistema de diseño — "Apple 2026"

### 9.1 Qué significa "estilo Apple" en este proyecto
Se adopta el **lenguaje de diseño** de Apple, no sus recursos. Prohibido usar la tipografía SF Pro (su licencia no permite usarla en sitios ajenos), los íconos de Apple o cualquier activo de su marca. Lo que se adopta son sus principios:

- **La tipografía es la protagonista.** Titulares de gran tamaño, interletraje ajustado, frases cortas, mucho aire.
- **Una idea por pantalla.** Secciones amplias que narran en secuencia, en lugar de páginas saturadas.
- **Espacio en blanco generoso** como señal de calidad.
- **Alternancia de superficies:** secciones claras en marfil y secciones dramáticas en verde profundo, como Apple alterna blanco y negro.
- **Materiales translúcidos** (lenguaje "Liquid Glass" de Apple): vidrio esmerilado con desenfoque en la barra de navegación, la subnavegación, el botón de WhatsApp, el buscador superpuesto y los menús. **El vidrio es para controles flotantes, nunca para bloques de texto de lectura.**
- **Mosaicos (bento)** de tamaños distintos para agrupar contenido, **sin sombras**: la jerarquía se crea con tamaño, color y espacio.
- **Imagen a sangre**, grande, en contenedores de esquinas amplias.
- **Movimiento que acompaña la lectura:** animaciones vinculadas al desplazamiento, sobrias y precisas.
- **Botones en forma de píldora** y enlaces secundarios con el chevrón "›", como en apple.com.

### 9.2 Paleta (definitiva)

| Token | Hex | Rol |
|---|---|---|
| `--color-verde` | `#133B36` | Primario. Texto principal sobre marfil; fondo de secciones dramáticas; botón principal. |
| `--color-verde-gris` | `#61726C` | Texto secundario sobre marfil. |
| `--color-oro` | `#8C8264` | Acento: titulares grandes, íconos, filetes, anillo de foco. |
| `--color-oliva` | `#949378` | Apoyo decorativo y fondos de mosaicos (en tinte). |
| `--color-marfil` | `#F9F8F2` | Fondo principal; texto sobre verde profundo. |

**Solo se usan estos cinco colores.** Se permiten tintes y transparencias derivados de ellos (por ejemplo, verde al 8 % para bordes de vidrio, oliva al 15 % sobre marfil para mosaicos, marfil al 72 % para la barra translúcida). No se introducen tonos nuevos, ni blanco puro, ni negro puro.

### 9.3 Contraste (WCAG 2.1 AA) — valores aproximados calculados

| Combinación | Contraste | Uso permitido |
|---|---|---|
| Verde sobre marfil | ≈ 11,6:1 | Cualquier texto |
| Verde-gris sobre marfil | ≈ 4,8:1 | Cualquier texto |
| Oro sobre marfil | ≈ 3,6:1 | Solo texto grande (≥ 24 px, o ≥ 19 px en negrita), íconos y foco |
| Oro sobre verde | ≈ 3,2:1 | Solo texto grande, íconos y foco |
| Marfil sobre verde | ≈ 11,6:1 | Cualquier texto |
| Verde-gris sobre verde | ≈ 2,4:1 | **Prohibido** para texto |
| Cualquier texto sobre oliva sólido | < 4,5:1 | **Prohibido** para texto de cuerpo |

En secciones verdes, el texto secundario es marfil con opacidad del 75 %. Sobre superficies de vidrio, verifica el contraste contra el peor fondo posible detrás del vidrio; si no se garantiza, aumenta la opacidad del material.

### 9.4 Tipografía (definitiva)

| Rol | Familia | Uso |
|---|---|---|
| Principal | **Breve Sans Title** | Titulares y textos de gran formato |
| Secundaria | **Breve News** | Frases editoriales destacadas: la promesa, el cierre, citas, entradillas de publicaciones |
| Cajas de texto | **IBM Plex Sans** | Cuerpo de texto, interfaz, formularios, panel |

**Licencias y repositorio público — obligatorio:**
- Breve Sans Title y Breve News son **tipografías comerciales**. Su uso web requiere una licencia web vigente, que debe confirmarse (sección 20).
- Como el repositorio es público, **los archivos de Breve no se suben al repositorio**: hacerlo los dejaría descargables para cualquiera, lo que viola las licencias habituales. Se guardan en un **repositorio privado aparte** (por ejemplo `OscarNarvaez/rb-fuentes-privadas`) y el flujo de GitHub Actions los descarga en `src/fonts/breve/` durante la compilación con un token de solo lectura (`FONTS_REPO_TOKEN`); `next/font/local` los publica en `_next/static/media/`. `src/fonts/breve/` está en `.gitignore` (no se usa `public/`, que los publicaría por duplicado).
- **IBM Plex Sans** tiene licencia SIL OFL: puede ir en el repositorio.
- **Respaldo:** si los archivos de Breve no están disponibles (por ejemplo, en local sin acceso), la compilación no falla: usa IBM Plex Sans y una serif del sistema como respaldo, y lo advierte en consola.
- Todas las fuentes se sirven desde el propio sitio (`next/font/local`), en woff2, subconjunto latino con tildes y eñe, `font-display: swap`, precarga de la principal. Sin Google Fonts.

**Escala tipográfica fluida** (con `clamp()`), a afinar en el plan de diseño:
- Display (hero): de ~44 px en móvil a ~96 px en pantallas grandes; interletraje −0,025 em; interlineado 1,05.
- Título de sección: de ~32 px a ~64 px; interletraje −0,02 em.
- Subtítulo: de ~22 px a ~32 px.
- Cuerpo: 17–19 px; interlineado 1,5; líneas de menos de 80 caracteres.
- Texto pequeño: 13–14 px, nunca por debajo de 12 px.

### 9.5 Composición y responsive total
- **Anchos:** contenedor de lectura de unos 980 px; contenedor amplio de 1200–1440 px; secciones e imágenes a sangre cuando la narrativa lo pida.
- **Espaciado vertical** de sección fluido, de unos 80 px en móvil a 160 px en escritorio.
- **Radios** generosos y consistentes por jerarquía (contenedores grandes, mosaicos, botones píldora), definidos como tokens.
- **Responsive real, de 320 px a 2560 px y más.** Verificación obligatoria en 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 y 2560 px de ancho, en vertical y horizontal. Contempla teléfonos plegables y tabletas en ambas orientaciones.
- Alturas de pantalla con `dvh`/`svh`, no `vh`, para evitar saltos por las barras del navegador móvil.
- Zonas seguras del dispositivo (`env(safe-area-inset-*)`) en la barra fija, el botón de WhatsApp y el menú móvil.
- Efectos de `hover` solo en dispositivos que lo soportan (`@media (hover: hover)`); en táctiles, estados de presión.
- Objetivos táctiles de al menos 44 × 44 px.
- Dirección de arte por dispositivo: las imágenes con versión móvil (`-movil`) usan `<picture>` con su encuadre propio.

### 9.6 Animación

**Principios:** precisas, sobrias y con propósito. Solo se animan `transform`, `opacity` y `filter`. Objetivo: 60 fps en un teléfono de gama media. Nada de rebotes, giros, parallax recargado ni desplazamiento suavizado artificial (el desplazamiento es nativo).

**Tokens de movimiento:**
- `--ease-salida: cubic-bezier(0.16, 1, 0.3, 1)` para entradas.
- `--ease-estandar: cubic-bezier(0.4, 0, 0.2, 1)` para transiciones de interfaz.
- Duraciones: 200 ms (microinteracciones), 400 ms (interfaz), 700–900 ms (revelados).

**Momentos coreografiados (y solo estos):**
1. **Entrada del hero:** el titular aparece por palabras (opacidad, desenfoque de 8 px a 0 y desplazamiento de 24 px), luego el subtítulo y los botones; la imagen pasa de escala 1,06 a 1 en unos 1,6 s.
2. **Qué hacemos:** cada una de las cuatro lógicas pasa de verde-gris a verde cuando cruza el centro de la pantalla (resaltado progresivo, como en apple.com).
3. **Pensamos antes de litigar:** sección fija mientras se desplaza; cada verbo reactivo se transforma en su par estratégico (Reaccionar → Anticipar, Defender → Proteger, Resolver → Prevenir, Litigar → Estrategizar). **Es la firma visual del sitio.**
4. **Método:** línea de progreso que se completa a medida que se recorren los cuatro pasos.
5. **Barra de navegación:** vidrio translúcido que se compacta al desplazarse; en móvil se oculta al bajar y reaparece al subir.
6. **Microinteracciones:** botones que se reducen levemente al presionar, subrayados que crecen, transición del menú móvil y del buscador.

El resto del contenido aparece sin animación o con un fundido mínimo. **No pongas animación de entrada en cada bloque.**

**Accesibilidad del movimiento:** con `prefers-reduced-motion: reduce`, todo el contenido es visible de inmediato y las secuencias fijas se convierten en contenido estático apilado. Con `prefers-reduced-transparency: reduce` (o sin soporte de `backdrop-filter`), el vidrio se reemplaza por superficies sólidas. En móviles de bajo rendimiento, la secuencia 3 puede simplificarse a una transición por pasos.

### 9.7 Logotipos
- Archivos oficiales en `logos/` del repositorio. En la Fase 0, inspecciona la carpeta, informa qué formatos hay y, si no hay SVG, solicítalo (un PNG no escala bien en pantallas de alta densidad).
- Logotipo horizontal en la barra de navegación y el pie; logotipo principal en los contextos de marca.
- Genera desde el logotipo los íconos del sitio: `favicon.svg`, `favicon.ico`, `apple-touch-icon` de 180 px e íconos de 192 y 512 px con su `manifest`.
- Respeta un área de protección alrededor del logotipo y un tamaño mínimo legible.

### 9.8 Proceso de diseño obligatorio
Antes de maquetar páginas:
1. Propón un plan de diseño: roles de color, escala tipográfica, radios, espaciados y curvas; wireframes ASCII de Inicio en escritorio y móvil; y la definición de los seis momentos de animación.
2. Revísalo contra este brief: si alguna parte se parece a lo que harías para cualquier firma de abogados, revísala y explica qué cambiaste. Evita las señas de sitio genérico: etiquetas en mayúsculas espaciadas sobre cada título, contenido partido en tarjetas idénticas con sombra, flechas "→" en todos los botones y degradados decorativos.
3. Espera aprobación.
4. Construye `/guia-de-estilos` (solo en desarrollo) con tokens, tipografía, botones, formularios, vidrio, mosaicos, estados de foco y una demostración de cada animación.

---

## 10. SEO técnico

- `<html lang="es-CO">`. Un único `h1` por página y jerarquía de títulos correcta.
- Metadatos con la API de metadatos de Next.js: título `{Título} | Riascos & Barrera`, descripción, URL canónica, Open Graph y Twitter Card en cada página. Cada publicación genera su propia vista previa al compartir. Imagen social por defecto: `social-compartir` (Anexo B).
- **Datos estructurados JSON-LD:**
  - `LegalService` con nombre, URL, logotipo, dirección (`PostalAddress`, Pasto, Nariño, CO), `areaServed` (departamentos configurados), teléfono cuando esté confirmado y `knowsAbout` con las áreas.
  - `WebSite` con `SearchAction` hacia `/buscar/?q=`.
  - `BreadcrumbList` en páginas internas.
  - `BlogPosting` en cada publicación; `Person` para el equipo.
- `sitemap.xml` generado en la compilación: páginas, publicaciones publicadas, etiquetas con contenido y lecturas recomendadas. Excluye borradores, programadas, búsqueda, gracias y panel.
- `robots.txt`: bloquea `/panel/`; enlaza el sitemap.
- `noindex` en búsqueda, gracias y panel.
- `noindex` global mientras `NEXT_PUBLIC_SITE_URL` sea la URL de github.io (4.2), para evitar contenido duplicado al mudar al dominio propio. Se deriva automáticamente de la variable.
- **Slugs modificados:** como GitHub Pages no admite redirecciones de servidor, cuando cambie el slug de una publicación se genera en la ruta anterior una página con `<meta http-equiv="refresh">` y canónica hacia la nueva.
- Documenta en el manual el registro en Google Search Console.

---

## 11. Rendimiento

**Metas en Lighthouse móvil:** Rendimiento ≥ 90; Accesibilidad, Buenas prácticas y SEO ≥ 95. LCP < 2,5 s; CLS < 0,1; INP < 200 ms.

- **Imágenes locales:** script `scripts/optimizar-imagenes.mjs` (con `sharp`) que se ejecuta antes de compilar: toma los originales de `imagenes/originales/`, genera WebP en 640, 1024, 1600 y 2400 px más un marcador de baja resolución (LQIP) para una carga suave, y produce `src/data/imagenes.generated.json` con las imágenes disponibles y sus dimensiones (ver Anexo B).
- Componente `<Imagen nombre="...">` con `srcset`, `sizes`, `width` y `height` explícitos, `loading="lazy"` fuera del primer pantallazo y prioridad alta en la imagen del hero.
- JavaScript mínimo en el sitio público: componentes de servidor por defecto y componentes de cliente solo donde haya interacción o animación. Motion con `LazyMotion`. El panel no carga código en el sitio público.
- Mapa de Google solo bajo demanda (fachada).
- Presupuesto: JavaScript inicial del sitio público por debajo de unos 150 KB comprimidos.

---

## 12. Accesibilidad

WCAG 2.1 nivel AA: navegación completa por teclado, foco visible (anillo oro), enlace "Saltar al contenido", puntos de referencia (`header`, `nav`, `main`, `footer`), etiquetas en todos los campos, errores asociados al campo y anunciados (`aria-live`), contraste verificado (9.3), texto alternativo obligatorio, objetivos táctiles de 44 × 44 px, respeto de `prefers-reduced-motion` y `prefers-reduced-transparency`, y trampas de foco correctas en el menú móvil, el buscador y los modales.

---

## 13. Seguridad

- **RLS en todas las tablas** con pruebas automatizadas (15).
- La clave secreta de Supabase **solo** existe en los secretos de las Edge Functions. Nunca en el navegador, en el repositorio ni en GitHub Actions si no es imprescindible.
- Las Edge Functions validan todo en el servidor; el navegador nunca es fuente de verdad.
- `reconstruir-sitio` exige un secreto compartido en la cabecera de la petición del webhook.
- El token de GitHub para disparar compilaciones es **de granularidad fina**, limitado a este repositorio y al permiso mínimo necesario (verifica en la documentación de GitHub cuál exige `repository_dispatch`).
- HTML saneado con DOMPurify al guardar y al renderizar.
- GitHub Pages no permite cabeceras HTTP propias: define una política de seguridad de contenido (CSP) y la política de referrer mediante etiquetas `<meta>`, permitiendo solo lo necesario (Supabase, GTM, Google Maps, Turnstile). Documenta las limitaciones que no pueden resolverse sin cabeceras.
- **HTTPS obligatorio** activado en la configuración de GitHub Pages.
- Supabase Auth con registro público desactivado, contraseñas robustas y URL de redirección limitadas al dominio del sitio.

---

## 14. Configuración

### 14.1 `src/config/firma.js`
Centraliza los datos de la firma: nombre, descriptor, conceptos de marca, dirección, coordenadas, teléfono, WhatsApp, correo, redes, departamentos y texto de cobertura, nombre visible de la sección de casos, integrantes del equipo y bandera del equipo.

### 14.2 Textos
Los textos institucionales y de interfaz viven en `src/content/es/` (JavaScript o JSON), no escritos dentro de los componentes. La versión en inglés es de una fase posterior; esta estructura la deja preparada sin construirla.

### 14.3 Variables y secretos

**Públicas (`.env.local` en local; variables del repositorio en GitHub Actions):**
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_SUPABASE_URL` (`https://duhmgtjnlvwfgvdoqngz.supabase.co`), `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EQUIPO_ACTIVO`.

**Secretos de GitHub Actions:** `FONTS_REPO_TOKEN`.

**Secretos de las Edge Functions (Supabase):** `SUPABASE_SERVICE_ROLE_KEY` (provista por la plataforma), `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `LEADS_EMAIL`, `MAIL_FROM`, `GITHUB_DISPATCH_TOKEN`, `REBUILD_WEBHOOK_SECRET`, `SITE_URL`.

Incluye un `.env.example` documentado. `.env.local` está en `.gitignore`.

### 14.4 Marcadores `[PENDIENTE]`
En desarrollo se muestran resaltados. En producción, un elemento con un dato pendiente **se oculta**. La compilación de producción lista en consola todos los pendientes visibles y falla si alguna página obligatoria (por ejemplo, las políticas legales) sigue pendiente, salvo que se compile con `PERMITIR_PENDIENTES=true` para una vista previa.

Durante las **Fases 1–6**, `PERMITIR_PENDIENTES=true` está definida como variable del repositorio en GitHub Actions, de modo que el despliegue funciona desde la Fase 1 (16.1) aunque las políticas legales sigan pendientes. Toda compilación lista igualmente los pendientes. En la **Fase 7** se retira la variable y la verificación bloqueante entra en vigor.

---

## 15. Pruebas

- **Base de datos (pgTAP o pruebas SQL con la CLI de Supabase):** un visitante anónimo no puede leer borradores, programadas ni eliminadas, ni leer o insertar contactos; un editor no lee contactos ni referentes; un caso no puede publicarse sin `is_anonymized`.
- **Edge Functions:** validación de campos, consentimiento obligatorio, Turnstile, honeypot, tiempo mínimo, límite por IP, registro de atribución y referente, y envío de correos (simulado).
- **Componentes (Vitest):** `<Imagen>` con y sin archivo disponible, ocultación del botón de WhatsApp sin número, aviso de casos, captura de atribución.
- **Extremo a extremo (Playwright):** navegación completa, menú móvil, buscador, envío de formulario contra un entorno de prueba, y **capturas de pantalla en todos los anchos de 9.5** para revisión visual.
- **Lighthouse** en el flujo de CI sobre Inicio, una publicación y Contacto, con las metas de la sección 11.

---

## 16. Despliegue

Documenta todo en `docs/DESPLIEGUE.md`.

### 16.1 GitHub Actions y GitHub Pages
- Fuente de Pages: **GitHub Actions** (no una rama).
- Flujo `.github/workflows/desplegar.yml` con disparadores: `push` a `main`, `repository_dispatch` de tipo `contenido-actualizado`, `schedule` cada hora y `workflow_dispatch` manual.
- Pasos: obtener código → obtener fuentes del repositorio privado → instalar Node LTS y pnpm → `pnpm install --frozen-lockfile` → optimizar imágenes → `next build` (lee contenido publicado de Supabase) → subir el artefacto de Pages → desplegar.
- Concurrencia con cancelación del despliegue en curso.
- Despliega un esqueleto **desde la Fase 1** para validar temprano GitHub Pages, la ruta base y, luego, el dominio.

### 16.2 Dominio (DNS en Squarespace)
El dominio está registrado en **Squarespace Domains** y su DNS se gestiona en el panel de Squarespace (nameservers `nse1`–`nse4.squarespacedns.com`). Por decisión de la Fase 0, el cambio de dominio se hace en la **Fase 7**; hasta entonces el sitio vive en github.io (4.2).

**Estado verificado el 2 de octubre de 2026:**

| Registro | Valor actual | Qué hacer |
|---|---|---|
| A `@` | `198.49.23.144`, `198.49.23.145`, `198.185.159.144`, `198.185.159.145` (Squarespace) | Reemplazar por los de GitHub Pages |
| CNAME `www` | `ext-sq.squarespace.com` | Reemplazar por `oscarnarvaez.github.io.` |
| MX `@` | `1 smtp.google.com.` (Google Workspace) | **No tocar** |
| TXT `@` (SPF) | `v=spf1 include:_spf.google.com ~all` | **No tocar** |
| TXT `google._domainkey` (DKIM) | Clave RSA de Google | **No tocar** |
| TXT `_dmarc` | No existe | Fuera de alcance; recomendable que la firma lo configure |

**Pasos (Fase 7):**
- **Antes de nada**, exportar la zona completa a `docs/dns-respaldo-<fecha>.txt` (o capturas del panel) y confirmar cada cambio registro por registro.
- En el panel DNS de Squarespace, quitar los registros que apuntan al sitio de Squarespace (A de `@` y CNAME de `www`) y crear:
  - Registros **A** para `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
  - Registros **AAAA** opcionales para `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
  - Registro **CNAME** para `www` → `oscarnarvaez.github.io.`
- Esto reemplaza la página "Próximamente" de Squarespace: coordinar la fecha con la firma.
- En GitHub: **Settings → Pages → Custom domain**: `riascosbarrera.com`; luego activar **Enforce HTTPS** cuando el certificado esté emitido.
- **Verificar el dominio** en la configuración de la cuenta de GitHub (registro TXT) para impedir que otra cuenta lo reclame.
- **ADVERTENCIA:** la firma ya usa correos `@riascosbarrera.com` con Google Workspace. **No modificar ni eliminar los registros MX, ni los TXT de SPF y DKIM existentes.**
- Al activar el dominio: `NEXT_PUBLIC_BASE_PATH` vacío y `NEXT_PUBLIC_SITE_URL=https://riascosbarrera.com` (lo que retira también el `noindex` temporal).
- Transferir el dominio a otro registrador no es necesario. Si algún día se quisiera, hoy tiene el bloqueo `client transfer prohibited` y habría que desbloquearlo.

### 16.3 Supabase y Resend
- Vincular el proyecto con la CLI (`supabase link --project-ref duhmgtjnlvwfgvdoqngz`; las credenciales las introduce el desarrollador en su terminal).
- Aplicar migraciones, desplegar Edge Functions y configurar sus secretos.
- Crear el webhook de base de datos hacia `reconstruir-sitio` sobre los cambios en `posts`, `external_reads`, `tags` y tablas de relación.
- En Auth: desactivar el registro público, definir la URL del sitio y las URL de redirección permitidas, y personalizar en español los correos de invitación y recuperación.
- En Resend: verificar el **subdominio** `send.riascosbarrera.com` (no el dominio raíz), agregando sus registros en el DNS de Squarespace. Así tiene SPF y DKIM propios y no se toca ningún registro del correo de Google Workspace. Hasta la Fase 7 las Edge Functions se prueban con el remitente de pruebas de Resend.
- **Plan gratuito de Supabase:** pausa los proyectos inactivos durante un periodo prolongado. La compilación programada cada hora consulta la base de datos y mantiene actividad, pero verifica la política vigente del plan y documenta la alternativa.

### 16.4 Primer administrador
Procedimiento para crear el primer usuario administrador desde el panel de Supabase y asignarle el rol en `profiles`.

---

## 17. Entregables documentales

- `README.md`: instalación y ejecución local en Ubuntu, estructura del proyecto, comandos.
- `docs/DESPLIEGUE.md`: sección 16, paso a paso.
- `docs/MANUAL_ADMINISTRACION.md`: manual para personal **no técnico**, en español, trato de usted, con espacios para capturas de pantalla. Cubre: iniciar sesión y recuperar la contraseña, crear y editar una publicación, imágenes y texto alternativo, etiquetas, publicar un caso anonimizado, lecturas recomendadas, programar y despublicar, cuánto tarda en verse un cambio, consultar y exportar contactos, crear referentes y compartir su enlace, construir la URL del código QR del pendón y buenas prácticas de SEO al escribir.
- `docs/IMAGENES.md`: cómo agregar las fotografías del Anexo B (nombres, proporciones, dónde ponerlas, comando de optimización) y la guía para la sesión fotográfica.
- `docs/PENDIENTES_CLIENTE.md`: lista generada con `pnpm pendientes` de todos los `[PENDIENTE: ...]` y de las imágenes faltantes del Anexo B.
- `docs/CREDENCIALES_PLANTILLA.md`: plantilla vacía para entregar accesos. **Nunca** escribas credenciales reales en el repositorio.

---

## 18. Fuera de alcance (no construir)

- Versión del sitio en otros idiomas (solo se deja la estructura de textos preparada).
- Páginas individuales ampliadas por área de práctica y perfiles extendidos de abogados (Fase 2).
- Agendamiento real de citas, calendarios o reservas (Fase 3).
- Área privada de clientes o consulta de estado de procesos (Fase 3).
- Edición autogestionable de las páginas institucionales (Fase 3). En esta fase solo se autogestionan publicaciones, lecturas, etiquetas, contactos, referentes y usuarios.
- Pagos en línea, boletín de correo, comentarios en publicaciones, chat o asistentes automáticos.
- Formularios para enviar datos personales de un tercero ("recomiende a un conocido"): la estrategia de referidos se resuelve con códigos de referente (8.4).
- Configuración de correos corporativos y campañas de pauta (las gestiona la agencia).

---

## 19. Forma de trabajo

### 19.1 Reglas generales
- Trabaja **por fases**. Al cierre de cada fase: ejecuta las pruebas, resume lo hecho, lista decisiones y pendientes, haz commit y **detente a esperar aprobación**.
- Commits pequeños y descriptivos. Antes de cada commit, verifica que no se incluyan secretos, `.env.local`, `docs/insumos/` ni fuentes Breve.
- Ante ambigüedad o conflicto con la arquitectura, pregunta antes de decidir.
- Mantén `CLAUDE.md` en la raíz, conciso, con las reglas vigentes e importando este documento con `@docs/ESPECIFICACION.md`.

### 19.2 Fases

**Fase 0 — Verificación y plan (sin escribir código)**
1. Lee este documento completo.
2. Inspecciona el repositorio y la carpeta `logos/`; informa qué archivos y formatos hay.
3. Pídeme confirmar: acceso a la CLI de Supabase y al proyecto; si el repositorio está configurado para Pages con GitHub Actions; si existe el repositorio privado de fuentes y la licencia web de Breve; acceso al DNS del dominio y una copia de los registros actuales (sobre todo MX y TXT); y cuenta de Resend.
4. Lista tus preguntas sobre ambigüedades de la especificación.
5. Propón el plan detallado por fases y el contenido de `CLAUDE.md`.

**Fase 1 — Base y sistema de diseño.** Proyecto Next.js con exportación estática, Tailwind, tokens, tipografías con su flujo de descarga, logotipos e íconos, plan de diseño (9.8), barra de vidrio, menú móvil, pie, componentes base, `<Imagen>` con sus espacios, guía de estilos y **flujo de despliegue en GitHub Pages funcionando** con un esqueleto.

**Fase 2 — Páginas institucionales.** Inicio con sus momentos animados, La Firma, Áreas de Práctica, Equipo, políticas y 404, con el contenido del Anexo A y todos los espacios de imagen del Anexo B.

**Fase 3 — Base de datos y publicaciones públicas.** Migraciones, RLS y sus pruebas, búsqueda, Storage, generación estática de publicaciones, etiquetas, casos, lecturas recomendadas, relacionadas, buscador superpuesto y página de resultados, respaldo de publicaciones nuevas en 404.

**Fase 4 — Panel de administración.** Autenticación, roles, publicaciones con TipTap y carga de imágenes, lecturas, etiquetas, contactos con exportación, referentes, usuarios y botón de actualizar el sitio.

**Fase 5 — Captación y automatización.** Formularios, consentimiento, atribución, Edge Functions (`enviar-formulario`, `reconstruir-sitio`, `invitar-usuario`), Turnstile, Resend, webhook de reconstrucción, compilación programada, WhatsApp, mapa de ubicación con fachada, mapa de cobertura, GTM y aviso de cookies.

**Fase 6 — Calidad.** SEO técnico, rendimiento, accesibilidad, seguridad, revisión responsive en todos los anchos, pruebas completas e informe de Lighthouse.

**Fase 7 — Dominio y entrega.** Configuración del dominio en el DNS de Squarespace (con la advertencia del correo), verificación de Resend, retirada de `PERMITIR_PENDIENTES` y del `noindex` temporal, HTTPS, documentación de la sección 17, revisión de pendientes y lista de verificación final.

---

## 20. Pendientes conocidos

| Pendiente | Efecto en el desarrollo |
|---|---|
| Confirmar la licencia web de Breve Sans Title y Breve News | Sin ella no pueden publicarse; respaldo con IBM Plex Sans |
| Logotipos en SVG (en `logos/` solo hay WebP de 580 × 221 y 322 × 393 px) | Necesario para nitidez en alta densidad, `favicon.svg` y el ícono de 512 px |
| Variante del logotipo en marfil o monocroma | El wordmark verde es invisible sobre verde profundo (1,00:1): bloquea el pie oscuro, las secciones verdes y `social-compartir` |
| Fotografías del Anexo B | Espacios definidos con marcador hasta recibirlas |
| Cargo y retrato de Marcela Riascos Eraso; datos de los demás integrantes | Equipo arranca solo con la ficha de Marcela (5.4); los demás se añaden al confirmarse |
| Número de WhatsApp institucional | Botón oculto hasta configurarlo |
| Teléfono, correo y redes institucionales | Se ocultan hasta confirmarlos |
| Correo que recibirá los formularios | Necesario antes de producción |
| Textos de política de privacidad y de tratamiento de datos | Bloquean la publicación definitiva |
| Texto de cobertura para Contacto | Criterio ya decidido (5.7); falta la redacción de la firma |
| Acceso al panel DNS de Squarespace | Indispensable en la Fase 7. Registros actuales ya inventariados en 16.2 |
| Cuenta de Cloudflare para Turnstile | Necesaria para los formularios (8.5) |
| Cuenta de Resend | Necesaria para los correos (8.5); verificación de dominio en la Fase 7 |

---

# ANEXO A — Contenido aprobado

Fuente: documentos institucionales entregados por la firma (Contenido Institucional, septiembre de 2026; presentación institucional; plataforma estratégica de marca). Es la **única fuente de texto** del sitio. Se corrigieron erratas evidentes sin alterar el sentido; están señaladas con *(corregido)*.

**Convención de nombre:** en el texto corrido usa "Riascos & Barrera", siempre con el signo "&". Las mayúsculas sostenidas quedan para el logotipo y los elementos de marca. Los documentos de la firma alternan "RIASCOS BARRERA" y "RIASCOS & BARRERA"; la forma oficial es con "&".

---

## A.1 Elementos de marca

- **Nombre:** Riascos & Barrera
- **Descriptor:** Abogados · Consultores
- **Concepto:** Inteligencia para decidir.
- **Subtítulo:** Estrategia jurídica para decisiones que importan.
- **Línea de posicionamiento:** Boutique Legal Strategy · Público · Privado
- **Promesa:** Nunca prometemos resultados. Prometemos una forma de trabajar.
- **Frase diferenciadora:** Una firma tradicional resuelve problemas legales. Riascos & Barrera anticipa decisiones de negocio y de vida.
- **Cierre institucional:** Cuando las decisiones importan, el criterio marca la diferencia.
- **Cierre extendido:** En Riascos & Barrera creemos que las mejores decisiones no nacen de la incertidumbre, sino del criterio.

> Los mockups de la agencia de identidad usan frases como "¿Hacia dónde avanzar? Estrategia para decidir." Son textos de presentación de la agencia, **no copy aprobado**. No los uses.

---

## A.2 Inicio

### A.2.1 Hero
- Inteligencia para decidir.
- Estrategia jurídica para decisiones que importan.

### A.2.2 Qué hacemos
**Más que asesoría jurídica, aportamos criterio para decidir.**

Entendemos, desde adentro, las cuatro lógicas que determinan el resultado de cualquier decisión de alto impacto:
- Cómo piensa el Estado.
- Cómo decide un juez.
- Cómo opera una empresa.
- Cómo se desarrolla un negocio.

Esa diferencia lo cambia todo.

### A.2.3 El nuevo entorno
**Toda organización toma decisiones.** Algunas impulsan su crecimiento. Otras comprometen su patrimonio, su reputación y su futuro.

La diferencia no está en la decisión. Está en la estrategia que la respalda.

El contexto empresarial e institucional exige mucho más que conocimiento jurídico. Hoy las organizaciones enfrentan:
- Cambios regulatorios permanentes.
- Contratación pública compleja.
- Mayor supervisión de las autoridades.
- Riesgos laborales y corporativos.
- Impacto financiero y reputacional.

El derecho deja de ser una función reactiva para convertirse en un elemento estratégico de gestión.

### A.2.4 Pensamos antes de litigar
En Riascos & Barrera creemos que el mejor litigio es el que pudo evitarse mediante una estrategia jurídica sólida. *(corregido: el original decía "es que el pudo evitarse")*

Por eso acompañamos a nuestros clientes desde la prevención, la estructuración y la toma de decisiones hasta la representación judicial cuando es necesario.

| Modelo reactivo | Estrategia Riascos & Barrera |
|---|---|
| Reaccionar | Anticipar |
| Defender | Proteger |
| Resolver | Prevenir |
| Litigar | Estrategizar |

### A.2.5 Propuesta de valor
> **No se publica** (decisión del cliente, ver 5.1). Se conserva como referencia.

**Convertimos conocimiento institucional y jurídico en criterio para tomar mejores decisiones.**
- **Decisiones complejas** con seguridad, criterio y visión estratégica.
- **Experiencia integrada:** Rama Judicial, Rama Ejecutiva, Estado y sector privado.
- **Capacidades** en innovación, desarrollo empresarial y estrategia comercial.

Dimensiones de análisis: Jurídico · Institucional · Financiero · Operativo · Reputacional.

No solo aportamos estrategia: aportamos criterio estratégico.

### A.2.6 No resolvemos problemas legales. Analizamos decisiones.
No analizamos solo el problema legal: examinamos cada decisión desde cuatro perspectivas.

| Perspectiva | Qué mira |
|---|---|
| Jurídica | Alcance legal y cumplimiento. |
| Institucional | Cómo decide el Estado. |
| Empresarial | Cómo opera el negocio. |
| Estratégica | Riesgos y oportunidades. |

- **Firma tradicional:** "Cumple la ley."
- **Riascos & Barrera:** "Cumple la ley y además revela riesgos, implicaciones regulatorias y oportunidades estratégicas."

### A.2.7 Nuestro método
1. **Comprender.** Escuchamos, analizamos y diagnosticamos la situación real para entender los objetivos de fondo.
2. **Diseñar.** Construimos una estrategia jurídica sólida y personalizada, anticipando posibles escenarios de riesgo.
3. **Ejecutar.** Implementamos las acciones necesarias con rigor técnico y agilidad operativa en cada fase.
4. **Acompañar.** Medimos resultados, realizamos ajustes estratégicos y mantenemos un seguimiento permanente.

### A.2.8 Nuestra promesa
**Nunca prometemos resultados. Prometemos una forma de trabajar.**
- Rigor técnico en cada concepto y actuación.
- Respuesta oportuna, en menos de 24 horas.
- Estrategias personalizadas para cada cliente.
- Cercanía y seguimiento permanente.
- Confidencialidad absoluta.
- Comunicación permanente, con procesos ágiles y documentación segura en la nube.

### A.2.9 Cierre
**Cuando las decisiones importan, el criterio marca la diferencia.**
En Riascos & Barrera creemos que las mejores decisiones no nacen de la incertidumbre, sino del criterio.

---

## A.3 La Firma

### A.3.1 Presentación
Riascos & Barrera es una firma boutique de asesoría y litigio estratégico, especializada en derecho público, contratación estatal, litigio administrativo y derecho laboral. Con sede principal en Pasto y cobertura en todo el territorio nacional, acompaña a entidades públicas, empresas privadas, contratistas del Estado, sociedades comerciales e inversionistas en la toma de decisiones jurídicas de alto impacto, en un modelo que combina rigor técnico, cercanía y una estructura operativa ágil y eficiente.

Más que asesoría jurídica tradicional, la firma aporta criterio para decidir. Entiende, desde adentro, las cuatro lógicas que determinan el resultado de cualquier decisión de alto impacto: cómo piensa el Estado, cómo decide un juez, cómo opera una empresa y cómo se desarrolla un negocio. Esa mirada integral —jurídica, institucional, empresarial y estratégica— es lo que distingue a la firma y lo que le permite anticipar riesgos, proteger intereses y construir soluciones inteligentes antes de que el conflicto se convierta en un problema mayor.

Su modelo de atención combina especialización jurídica, uso intensivo de tecnología y una estructura de dirección técnica organizada por áreas de práctica, lo que le permite ofrecer un acompañamiento de alto nivel en cualquier ciudad del país sin renunciar a la atención personalizada propia de una firma boutique. Esta estructura sostiene un acompañamiento integral que va desde la estructuración de negocios y la gestión de riesgos hasta la defensa judicial de los intereses de cada cliente.

El nombre de la firma reúne los apellidos de sus fundadores y representa una firma construida desde la independencia profesional y la convicción de que los asuntos jurídicos de alta complejidad exigen un criterio superior. Más que crecer en volumen, la aspiración de Riascos & Barrera es consolidarse como un referente regional y nacional en la defensa de intereses empresariales e institucionales, reconocida por la calidad de sus decisiones, la confianza que inspira y el valor que aporta a cada cliente.

### A.3.2 Propósito: por qué existimos
En Riascos & Barrera somos aliados estratégicos para las decisiones que importan. No acompañamos procesos: acompañamos decisiones que pueden transformar el patrimonio, la reputación o el futuro de una organización. Por eso nuestro propósito no se agota en representar clientes dentro de un proceso legal, sino en comprender el contexto, anticipar los riesgos y ofrecer la mejor ruta posible antes de que el conflicto escale. Esta convicción es, precisamente, el origen de nuestro eslogan: inteligencia para decidir.

La firma entiende que detrás de cada decisión existe una organización, un patrimonio, una reputación o un proyecto de vida que merece ser protegido mediante inteligencia jurídica y criterio profesional.

### A.3.3 Visión
Convertirse en una firma jurídica de referencia en Colombia en derecho público, contratación estatal, litigio administrativo y derecho laboral empresarial e individual, reconocida por su capacidad para anticipar riesgos, construir soluciones inteligentes y acompañar decisiones de alto impacto con criterio, rigor y cercanía, tanto en el sector público como en el privado.

### A.3.4 Posicionamiento
Riascos & Barrera ocupa un lugar que pocas firmas se atreven a disputar: el de aliado estratégico en las decisiones que definen el futuro de una organización o de una persona. Riascos & Barrera se posiciona como una firma jurídica especializada para personas, empresas y entidades que enfrentan decisiones complejas y necesitan mucho más que representación legal.

No competimos por volumen, ni por procesos; competimos por criterio. Mientras el mercado jurídico tradicional vende horas y procesos, nosotros ofrecemos una ventaja real: anticipar lo que otros solo enfrentan después de que ya ocurrió. Para las entidades públicas, empresas, contratistas del Estado e inversionistas que no pueden permitirse el error, Riascos & Barrera es la firma que convierte la complejidad jurídica en una decisión segura.

### A.3.5 Atributos de marca
- **Inteligencia:** analizamos cada escenario antes de recomendar una decisión.
- **Estrategia:** cada acción responde a una visión de largo plazo.
- **Cercanía:** construimos relaciones basadas en confianza.
- **Honestidad:** comunicamos la realidad jurídica sin falsas expectativas.
- **Solidez:** el rigor técnico respalda cada recomendación.
- **Prevención:** buscamos evitar conflictos futuros.

### A.3.6 ¿Por qué elegirnos?
- **Boutique especializada.** No somos una firma generalista. Nos concentramos en áreas donde generamos verdadero valor técnico.
- **Atención personalizada.** Cada cliente tiene acceso directo al abogado responsable de su caso, sin intermediarios.
- **Estrategia.** Cada asunto comienza con un análisis integral del riesgo jurídico antes de cualquier acción.
- **Tecnología.** Procesos ágiles. Comunicación permanente y documentación segura en la nube.
- **Cercanía.** Comprendemos el negocio y los objetivos de nuestros clientes antes de emitir cualquier concepto.

### A.3.7 Promesa extendida
Riascos & Barrera se compromete a ofrecer una representación profesional basada en honestidad, criterio y estrategia, actuando siempre como un aliado comprometido con los intereses de cada cliente. La firma promete acompañar cada decisión con responsabilidad, claridad y un profundo compromiso con la calidad del servicio.

Riascos & Barrera nunca prometerá resultados que no dependen exclusivamente de su gestión. No promete ganar todos los procesos; promete ofrecer la mejor estrategia posible para defender los intereses de quienes confían en la firma.

---

## A.4 Áreas de Práctica

### A.4.1 Introducción
La especialización estratégica de la firma se concentra en cuatro áreas donde genera un valor técnico real.

### A.4.2 Las cuatro áreas
**Derecho Público** (`#derecho-publico`)
Contratación estatal y SECOP I y II. El núcleo de la operación institucional y de la defensa administrativa de la firma.

**Litigio Administrativo** (`#litigio-administrativo`)
Representación de alto nivel ante la Jurisdicción de lo Contencioso Administrativo y ante los órganos de control.

**Derecho Laboral** (`#derecho-laboral`)
Asesoría preventiva y defensa estratégica para empleadores y empleados. Auditorías y procesos disciplinarios.

**Derecho Privado** (`#derecho-privado`)
Gestión de riesgos contractuales, estructuración de negocios y cumplimiento normativo corporativo.

### A.4.3 Las cuatro perspectivas
En cada una de estas áreas, la firma examina cada decisión desde cuatro perspectivas: la jurídica (alcance legal y cumplimiento), la institucional (cómo decide el Estado), la empresarial (cómo opera el negocio) y la estratégica (riesgos y oportunidades). Ese enfoque de cuatro perspectivas es nuestro verdadero diferencial competitivo: no se compra, se construye con años de trayectoria dentro y fuera del Estado. Es la razón por la que las organizaciones y personas que más tienen en juego eligen a Riascos & Barrera como su firma de cabecera, y no como un simple abogado de turno.

### A.4.4 Servicios: un acompañamiento integral
El servicio de Riascos & Barrera se organiza como un acompañamiento integral —no como una intervención puntual— y cubre desde la prevención hasta la representación judicial cuando es necesaria.
- Asesoría y estructuración de procesos de contratación estatal, incluyendo el manejo de SECOP I y II.
- Defensa administrativa y representación ante la Jurisdicción de lo Contencioso Administrativo y organismos de control.
- Asesoría laboral preventiva y correctiva para empleadores y empleados, incluyendo auditorías y procesos disciplinarios.
- Gestión de riesgos contractuales, estructuración de negocios y cumplimiento normativo corporativo (compliance).
- Diagnóstico y análisis integral de riesgo jurídico, institucional, financiero y reputacional antes de tomar decisiones de alto impacto.
- Acompañamiento permanente en la toma de decisiones estratégicas, con seguimiento y ajuste continuo.

---

## A.5 Equipo — PENDIENTE DE CONFIRMACIÓN

> La firma debe confirmar quiénes aparecen publicados, con qué cargo y con qué fotografía. Los datos siguientes son la base actual; hay inconsistencias señaladas que deben resolverse antes de producción. **No publiques teléfonos personales.**

### A.5.1 Introducción
Riascos & Barrera construye sus soluciones desde un ecosistema de conocimiento especializado. Su diferencial no depende de un eslogan, sino de la trayectoria real de quienes integran la firma.

La firma amplía su criterio a través de un grupo de aliados estratégicos que aportan perspectivas complementarias —judicial, administrativa y empresarial— para entregar mucho más que asesoría jurídica.

### A.5.2 Marcela Riascos Eraso
- **Cargo:** `[PENDIENTE: confirmar cargo]`. El material usa "Dirección Jurídica · Socia Fundadora" y, en otra sección, "Directora General".
- **Enfoque:** Estrategia jurídica · Derecho público · Contratación estatal y privada · Transparencia · Anticorrupción · Derecho laboral empresarial e individual.
- **Aporta:** criterio institucional, regulatorio y de gestión pública.
- **Correo:** `[PENDIENTE: confirmar si se publica]`
- **Biografía:**

Abogada de la Universidad de Nariño, especialista en Gestión Pública e Instituciones Administrativas de la Universidad de los Andes y magíster en Derecho con énfasis en Responsabilidad Contractual y Extracontractual, Civil y del Estado de la Universidad Externado de Colombia.

Con más de veinte años de trayectoria, Marcela ha ocupado posiciones de máxima responsabilidad en las instituciones que definen las reglas de la contratación pública y el control del Estado en Colombia. En Colombia Compra Eficiente —la entidad rectora del Sistema de Compra Pública— participó en la elaboración de los proyectos de ley y decretos que hoy rigen la contratación estatal en el país, y fue encargada como Secretaria General y Subdirectora de Gestión Contractual. En la Procuraduría General de la Nación asesoró al Despacho del Procurador General y fue encargada como Procuradora Delegada para la Vigilancia Preventiva de la Función Pública. Como Veedora Distrital Delegada para la Contratación, supervisó la transparencia y la eficacia de la ejecución de recursos públicos de Bogotá D.C.

Su experiencia se completa con su paso por el Instituto de Desarrollo Urbano —gestión contractual de la fase III de TransMilenio—, la Gobernación de Nariño, la DIAN y el Ministerio del Deporte, así como su trabajo actual como asesora legal externa de empresas privadas y consultora en compra y contratación pública y privada.

Esta trayectoria, construida dentro y fuera del Estado, es la que hoy aporta a Riascos & Barrera un criterio institucional y regulatorio que pocas firmas pueden ofrecer: el de alguien que ha estado en el lugar donde se toman las decisiones que hoy asesora a otros a tomar.

### A.5.3 José Camilo Guzmán Santos
- **Cargo:** Aliado estratégico
- **Enfoque:** Derecho constitucional · Gestión y defensa de lo público · Litigio estratégico · Formación jurídica · Rama Judicial y Rama Ejecutiva.
- **Aporta:** criterio judicial y constitucional.
- **Biografía:** `[PENDIENTE: biografía]`

### A.5.4 Diego Moreno Montenegro
- **Cargo:** `[PENDIENTE: confirmar cargo]`. El material lo presenta como "Aliado estratégico" y, en otra sección, como "Director Asociado de Litigio Administrativo".
- **Enfoque:** Derecho administrativo · Procedimiento contencioso administrativo.
- **Aporta:** criterio administrativo y judicial.
- **Correo:** `[PENDIENTE: confirmar si se publica]`
- **Biografía:** `[PENDIENTE: biografía]`

### A.5.5 Diana Maldonado
- **Cargo:** Aliada estratégica
- **Enfoque:** Innovación · Desarrollo empresarial · Estrategia comercial · Relaciones corporativas · Crecimiento de negocios.
- **Aporta:** criterio empresarial, comercial y de innovación.
- **Biografía:** `[PENDIENTE: biografía]`

---

## A.6 Cobertura

**Criterio definitivo (decisión del cliente):** regional con alcance nacional (ver 5.7). El texto de cobertura para Contacto sigue pendiente de redacción por la firma.

**Acordado en la reunión del 30 de septiembre de 2026 (valor por defecto):** el mapa muestra cobertura en **Nariño, Putumayo y Cauca**.

**Material institucional (anterior a la reunión):**
- Sede principal: Pasto, Nariño.
- Influencia prioritaria: Nariño y Putumayo.
- Puntos de atención: Bogotá y Cali.
- Modelo digital: atención en todo el país.
- Audiencias virtuales: gestión remota total.
- Desplazamientos: movilidad estratégica según la necesidad del caso.

Ambas versiones deben poder representarse desde `src/config/firma.js` sin tocar plantillas. Texto provisional sugerido para la página de Contacto, a confirmar con la firma: `[PENDIENTE: confirmar texto de cobertura]`.

---

## A.7 Datos de contacto

- **Dirección:** Edificio Hito, Oficina 1103, Carrera 37 N.º 19B-35, Pasto, Nariño, Colombia.
- **Sitio web:** https://www.riascosbarrera.com
- **WhatsApp institucional:** `[PENDIENTE: número propio de la firma]`
- **Teléfono:** `[PENDIENTE]`
- **Correo institucional:** `[PENDIENTE]`
- **Correo que recibe los formularios:** `[PENDIENTE]`
- **Redes sociales:** `[PENDIENTE]`

---

## A.8 Textos de interfaz sugeridos

Puedes ajustarlos manteniendo el tono y el trato de usted.

- Botón principal: **Agende su consulta**
- Botón secundario del hero: **Conozca nuestras áreas**
- Envío de formulario: **Enviar mensaje** / **Solicitar consulta**
- Página de gracias: **Recibimos su mensaje.** Le responderemos en menos de 24 horas. Mientras tanto, puede conocer nuestras publicaciones.
- Error de validación: indicar el campo y cómo corregirlo, por ejemplo "Escriba un correo válido, por ejemplo nombre@empresa.com."
- Búsqueda sin resultados: **No encontramos publicaciones con "{término}".** Pruebe con otra palabra o explore estos temas: {etiquetas}.
- 404: **Esta página no existe o cambió de dirección.** Vuelva al inicio, consulte nuestras publicaciones o escríbanos.
- Aviso al final de los casos: *Cada asunto es distinto. La experiencia en casos anteriores no garantiza resultados en casos futuros.*

---

# ANEXO B — Espacios de imagen

Todavía no hay fotografías. El sitio se construye con **todos los espacios ya ubicados y con su nombre definitivo**, para que agregar una foto sea solo copiar el archivo y compilar.

## B.1 Cómo funciona

1. Las fotografías originales se guardan en `imagenes/originales/` con **exactamente** el nombre de la tabla. Se acepta `.jpg`, `.jpeg`, `.png` o `.webp`; la extensión no importa, el nombre sí.
2. `pnpm imagenes` (también se ejecuta antes de cada compilación) genera las versiones optimizadas en `public/imagenes/` y actualiza `src/data/imagenes.generated.json`.
3. El componente `<Imagen nombre="inicio-hero" />` busca el nombre en ese archivo:
   - **Si existe:** muestra la imagen optimizada con su marcador de baja resolución.
   - **Si no existe:** muestra un espacio con la **proporción exacta** de la imagen, relleno con un tinte de la paleta y, solo en desarrollo, el nombre del archivo esperado y sus medidas. En producción, el espacio se ve como un bloque de color sobrio y nunca muestra texto técnico.
4. `pnpm pendientes` incluye la lista de imágenes faltantes.

## B.2 Inventario

| Nombre del archivo | Proporción | Original mínimo | Dónde aparece | Qué debe mostrar |
|---|---|---|---|---|
| `inicio-hero` | 16:9 | 2880 × 1620 | Inicio, hero (escritorio y tableta) | Imagen principal del sitio: espacio de la oficina, detalle arquitectónico sobrio o retrato de la Socia Fundadora. Debe admitir texto superpuesto en un costado. |
| `inicio-hero-movil` | 4:5 | 1290 × 1612 | Inicio, hero (móvil) | Mismo motivo que `inicio-hero`, en encuadre vertical. |
| `inicio-que-hacemos` | 4:3 | 2000 × 1500 | Inicio, "Qué hacemos" | Trabajo de análisis: documentos, reunión de trabajo. Sin rostros de clientes. |
| `inicio-cierre` | 21:9 | 2880 × 1234 | Inicio, cierre | Panorámica de Pasto o del entorno institucional. |
| `firma-portada` | 21:9 | 2880 × 1234 | La Firma, encabezado | Oficina en el Edificio Hito. |
| `firma-oficina-01` | 4:3 | 2000 × 1500 | La Firma, galería | Espacio interior de la oficina. |
| `firma-oficina-02` | 4:3 | 2000 × 1500 | La Firma, galería | Detalle: biblioteca, sala de reuniones o escritorio. |
| `area-derecho-publico` | 4:3 | 2000 × 1500 | Áreas de Práctica | Imagen institucional (arquitectura pública). Sin personas. |
| `area-litigio-administrativo` | 4:3 | 2000 × 1500 | Áreas de Práctica | Contexto judicial o de control. Sin personas identificables. |
| `area-derecho-laboral` | 4:3 | 2000 × 1500 | Áreas de Práctica | Entorno de trabajo o empresa. |
| `area-derecho-privado` | 4:3 | 2000 × 1500 | Áreas de Práctica | Negocios, contratos, firma de documentos. |
| `equipo-grupal` | 16:9 | 2880 × 1620 | Equipo, encabezado | Fotografía grupal de la firma. |
| `equipo-marcela-riascos-eraso` | 4:5 | 1600 × 2000 | Equipo e Inicio | Retrato profesional. |
| `equipo-jose-camilo-guzman-santos` | 4:5 | 1600 × 2000 | Equipo | Retrato profesional. |
| `equipo-diego-moreno-montenegro` | 4:5 | 1600 × 2000 | Equipo | Retrato profesional. |
| `equipo-diana-maldonado` | 4:5 | 1600 × 2000 | Equipo | Retrato profesional. |
| `contacto-edificio-hito` | 4:3 | 2000 × 1500 | Contacto, fachada del mapa | Fachada o acceso del Edificio Hito. |
| `social-compartir` | 1,91:1 | 1200 × 630 | Vista previa al compartir el sitio en redes y WhatsApp | Logotipo sobre fondo de marca o la imagen principal. **Si no existe, se genera automáticamente** en la compilación con el logotipo sobre verde profundo. |

Las portadas de las publicaciones no están en esta tabla: se suben desde el panel. Si una publicación no tiene portada, se usa la portada tipográfica de la marca (5.5).

## B.3 Guía para la sesión fotográfica

Para que el sitio tenga la coherencia visual que exige el estilo definido, todas las fotografías deben parecer de una misma serie:

- **Retratos del equipo:** mismo fondo, misma luz, misma distancia y mismo encuadre para todos. Fondo neutro cálido que armonice con el marfil y el verde de la marca. Vestimenta profesional sin estampados fuertes.
- **Luz natural o suave**, sin flash directo; tonos cálidos y neutros.
- **Espacios con orden y aire:** pocos objetos, superficies limpias. Menos es más.
- **Espacio para texto:** el hero y las portadas necesitan zonas tranquilas donde superponer titulares.
- **Formato horizontal y vertical** de las tomas principales, para cubrir escritorio y móvil.
- **Nunca** fotografías de banco con personas ni imágenes generadas por IA de personas.
- Toda persona que aparezca debe haber autorizado el uso de su imagen.
