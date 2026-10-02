# Pendientes del cliente — Riascos & Barrera

> Versión inicial redactada al cierre de la Fase 0 (2 de octubre de 2026).
> A partir de la Fase 1, la sección de marcadores e imágenes la genera `pnpm pendientes`
> a partir del código; la sección de decisiones y accesos se mantiene a mano.

## 1. Bloquean la publicación definitiva

| Pendiente | Quién lo entrega | Por qué importa |
|---|---|---|
| Texto de la **Política de privacidad** | La firma | Sin él no puede publicarse el sitio definitivo (§5.8, §14.4) |
| Texto de la **Política de tratamiento de datos personales** (Ley 1581 de 2012) | La firma | Ídem; además, cada formulario registra la versión aceptada |
| **Correo que recibirá los formularios** (`LEADS_EMAIL`) | La firma | Sin él, los contactos no llegan a nadie |
| **Licencia web** de Breve Sans Title y Breve News | La firma o su agencia | Sin licencia web, el sitio usa IBM Plex Sans como respaldo |

## 2. Identidad visual

| Pendiente | Detalle |
|---|---|
| **Logotipos en SVG** | En `logos/` solo hay WebP de 580 × 221 px (horizontal) y 322 × 393 px (escudo). Hace falta vector para la nitidez en pantallas de alta densidad, el `favicon.svg` y el ícono de 512 px. |
| **Variante del logotipo en marfil o monocroma** | El nombre "RIASCOS & BARRERA" está en verde y desaparece sobre el fondo verde profundo de la marca. Se necesita para el pie de página, las secciones verdes y la imagen que se muestra al compartir el sitio. |
| Rol del escudo suelto | Confirmar si `logoR_B.webp` (solo el escudo) es el "logotipo principal" para contextos de marca, o si existe un logotipo vertical con nombre. |

## 3. Contenido

| Pendiente | Detalle |
|---|---|
| Cargo de **Marcela Riascos Eraso** | El material usa "Dirección Jurídica · Socia Fundadora" y también "Directora General". |
| Cargo de **Diego Moreno Montenegro** | "Aliado estratégico" o "Director Asociado de Litigio Administrativo". |
| Biografías de **José Camilo Guzmán Santos**, **Diego Moreno Montenegro** y **Diana Maldonado** | No hay texto. |
| Correos de Marcela Riascos y Diego Moreno | Confirmar si se publican. |
| Quiénes aparecen publicados en Equipo | La sección completa está pendiente de confirmación. |
| **Cobertura territorial** | La reunión del 30 de septiembre acordó Nariño, Putumayo y Cauca, pero el texto aprobado de La Firma dice "cobertura en todo el territorio nacional" y el material institucional menciona Bogotá y Cali. Definir qué muestra el mapa y si el texto de La Firma se ajusta. |
| Texto de cobertura para Contacto | Pendiente de redacción por la firma. |
| Nombre de la sección de casos | "Casos" (por defecto), "Casos de éxito" o "Aprendizajes". |
| Teléfono institucional | Se oculta hasta confirmarlo. |
| Número de WhatsApp institucional | El botón flotante no aparece hasta configurarlo. |
| Correo institucional público | Se oculta hasta confirmarlo. |
| Redes sociales | Se ocultan hasta confirmarlas. |

## 4. Fotografías (Anexo B)

Ninguna entregada todavía. El sitio se construye con los espacios ya ubicados; basta copiar cada
archivo a `imagenes/originales/` con el nombre exacto. La guía de la sesión está en el Anexo B.3 de
la especificación.

| Archivo | Proporción | Mínimo | Dónde aparece |
|---|---|---|---|
| `inicio-hero` | 16:9 | 2880 × 1620 | Inicio, portada (escritorio) |
| `inicio-hero-movil` | 4:5 | 1290 × 1612 | Inicio, portada (móvil) |
| `inicio-que-hacemos` | 4:3 | 2000 × 1500 | Inicio, "Qué hacemos" |
| `inicio-cierre` | 21:9 | 2880 × 1234 | Inicio, cierre |
| `firma-portada` | 21:9 | 2880 × 1234 | La Firma, encabezado |
| `firma-oficina-01` | 4:3 | 2000 × 1500 | La Firma, galería |
| `firma-oficina-02` | 4:3 | 2000 × 1500 | La Firma, galería |
| `area-derecho-publico` | 4:3 | 2000 × 1500 | Áreas de Práctica |
| `area-litigio-administrativo` | 4:3 | 2000 × 1500 | Áreas de Práctica |
| `area-derecho-laboral` | 4:3 | 2000 × 1500 | Áreas de Práctica |
| `area-derecho-privado` | 4:3 | 2000 × 1500 | Áreas de Práctica |
| `equipo-grupal` | 16:9 | 2880 × 1620 | Equipo, encabezado |
| `equipo-marcela-riascos-eraso` | 4:5 | 1600 × 2000 | Equipo e Inicio |
| `equipo-jose-camilo-guzman-santos` | 4:5 | 1600 × 2000 | Equipo |
| `equipo-diego-moreno-montenegro` | 4:5 | 1600 × 2000 | Equipo |
| `equipo-diana-maldonado` | 4:5 | 1600 × 2000 | Equipo |
| `contacto-edificio-hito` | 4:3 | 2000 × 1500 | Contacto, antes de cargar el mapa |
| `social-compartir` | 1,91:1 | 1200 × 630 | Vista previa al compartir (se genera sola si falta, una vez exista la variante marfil del logotipo) |

## 5. Accesos y cuentas

| Pendiente | Para qué | Cuándo se necesita |
|---|---|---|
| Acceso de propietario al proyecto Supabase | Migraciones, funciones y secretos | Fase 3 |
| Repositorio privado de fuentes (`rb-fuentes-privadas`) | Descargar Breve durante la compilación | Cuando haya licencia web |
| Cuenta de Cloudflare (Turnstile) | Protección antispam de los formularios | Fase 5 |
| Cuenta de Resend | Correos de notificación y confirmación | Fase 5 |
| Acceso al panel DNS de **Squarespace** | El dominio está en Squarespace, no en Namecheap | Fase 7 |
| Fecha acordada para reemplazar la página "Próximamente" | El cambio de DNS la sustituye por el sitio nuevo | Fase 7 |
| Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) | Medición de la agencia digital | Fase 5 |

## 6. Recomendaciones fuera de alcance

- **DMARC.** El dominio no tiene registro DMARC. Cuando el sitio empiece a enviar correos, conviene
  que el administrador de Google Workspace lo configure para mejorar la entrega y evitar
  suplantaciones. No forma parte del contrato.
- **Licencia del repositorio.** El repositorio es público y hoy está bajo Apache 2.0, que permite a
  cualquiera reutilizar todo lo publicado, incluidos los textos institucionales y los logotipos.
  Pendiente de decisión.
