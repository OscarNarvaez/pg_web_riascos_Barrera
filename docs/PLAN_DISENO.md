# Plan de diseño — Riascos & Barrera

> Fase 1, paso obligatorio de la especificación §9.8. Pendiente de aprobación.
> Nada de esto se maqueta hasta que se apruebe. Los tokens ya escritos en
> `src/app/globals.css` siguen este documento; los marcados como provisionales cambian si
> este plan cambia.

## La idea

La firma vende **criterio**: la capacidad de mirar una decisión antes de que se vuelva un
problema. El sitio no debe parecer una firma de abogados que se presenta, sino una firma que
**piensa delante del visitante**: frases cortas, una idea por pantalla, y un ritmo de lectura que
avanza como un razonamiento.

De ahí salen tres decisiones que gobiernan todo lo demás:

1. **La tipografía es la imagen principal.** En el primer pantallazo, lo que se ve primero es
   la frase "Inteligencia para decidir.", no una fotografía.
2. **Un solo ornamento: el filete oro.** Una línea de 1 px en `--color-oro`. Separa, subraya y,
   en el Método, se convierte en la línea de progreso. No hay ningún otro recurso decorativo.
3. **El contraste marfil / verde marca el ritmo.** Las secciones de exposición van en marfil;
   las de convicción (el entorno, la promesa), en verde profundo. Como el blanco y negro de
   Apple, pero con la paleta de la marca.

---

## 1. Roles de color

| Token                  | Rol                                                                               | Dónde                                                              |
| ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `verde` `#133B36`      | Texto principal sobre marfil · fondo de secciones de convicción · botón principal | Titulares, cuerpo, píldora principal, secciones 3 y 8 de Inicio    |
| `verde-gris` `#61726C` | Texto secundario sobre marfil · estado "aún no leído" del resaltado progresivo    | Entradillas, metadatos, las cuatro lógicas antes de iluminarse     |
| `oro` `#8C8264`        | Acento. Solo texto ≥ 24 px (o ≥ 19 px en negrita), filetes, numerales, foco       | Filete, numerales 01–04 del Método, anillo de foco, "›" de enlaces |
| `oliva` `#949378`      | Solo en tinte, nunca sólido bajo texto                                            | Fondo de mosaicos al 15 %, espacios de imagen pendiente            |
| `marfil` `#F9F8F2`     | Fondo principal · texto sobre verde                                               | Fondo general, texto de secciones verdes, vidrio al 72 %           |

**Derivados permitidos** (todos son tintes o transparencias de los cinco):

| Uso                           | Valor                                                             |
| ----------------------------- | ----------------------------------------------------------------- |
| Barra de vidrio               | marfil al 72 % + desenfoque de 20 px, borde inferior verde al 8 % |
| Vidrio sobre secciones verdes | verde al 64 % + desenfoque de 20 px, borde marfil al 10 %         |
| Mosaico                       | oliva al 15 % sobre marfil                                        |
| Texto secundario sobre verde  | marfil al 75 % (verificado: 7,26:1, AAA)                          |
| Filete sobre verde            | oro al 100 % (3,22:1, válido para elementos no textuales)         |

Con `prefers-reduced-transparency` o sin `backdrop-filter`, el vidrio pasa a marfil o verde
sólido al 100 %.

---

## 2. Tipografía

| Rol               | Familia          | Tamaño (token)                   | Peso                                        | Interletraje | Uso                                                         |
| ----------------- | ---------------- | -------------------------------- | ------------------------------------------- | ------------ | ----------------------------------------------------------- |
| Display           | Breve Sans Title | `text-display` 44 → 96 px        | El más pesado disponible por debajo de bold | −0,025 em    | Solo el hero y la frase de la promesa                       |
| Título de sección | Breve Sans Title | `text-titulo` 32 → 64 px         | Ídem                                        | −0,02 em     | Un título por sección, siempre una frase del Anexo A        |
| Subtítulo         | Breve Sans Title | `text-subtitulo` 22 → 32 px      | Regular                                     | −0,01 em     | Las cuatro lógicas, los verbos, los nombres de área         |
| Editorial         | Breve News       | `text-subtitulo` a `text-titulo` | Regular                                     | 0            | La promesa, el cierre, la conclusión del entorno, citas     |
| Cuerpo            | IBM Plex Sans    | `text-cuerpo` 17 → 19 px         | 400                                         | 0            | Párrafos, siempre en `contenedor-lectura` (< 80 caracteres) |
| Interfaz          | IBM Plex Sans    | `text-cuerpo` / `text-pequeno`   | 500                                         | 0            | Navegación, botones, formularios                            |
| Pequeño           | IBM Plex Sans    | `text-pequeno` 13 → 14 px        | 400–500                                     | 0,01 em      | Metadatos, pie, notas legales                               |

Reglas:

- **Ningún titular en mayúsculas sostenidas.** Las mayúsculas quedan para el logotipo.
- **Sin "etiquetas" sobre los títulos** (el típico "NUESTROS SERVICIOS" espaciado). El título es
  la frase; no necesita una categoría encima.
- Los titulares se cortan a mano con `text-wrap: balance`, y los párrafos con `text-wrap: pretty`.
- Breve News aparece como máximo una vez por pantalla. Es la voz de la firma; si se repite,
  deja de sonar.

---

## 3. Radios, espaciados y composición

| Token                | Valor                              | Uso                                                           |
| -------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `rounded-contenedor` | 32 px                              | Contenedores de imagen grandes, la imagen del hero, el cierre |
| `rounded-mosaico`    | 24 px                              | Mosaicos del bento de áreas                                   |
| `rounded-control`    | 12 px                              | Campos de formulario, buscador, menús                         |
| `rounded-pildora`    | 9999 px                            | Botones                                                       |
| `contenedor-lectura` | 980 px                             | Todo bloque de texto corrido                                  |
| `contenedor-amplio`  | 1320 px                            | Rejillas, bento, imágenes de sección                          |
| `espacio-seccion`    | 80 → 160 px                        | Relleno vertical de cada sección                              |
| `margen-lateral`     | ≥ 20 px, respetando la zona segura | Márgenes laterales en todos los anchos                        |

En pantallas ≤ 430 px, los radios de contenedor y mosaico bajan a 20 y 16 px: una esquina de
32 px en una tarjeta de 335 px de ancho se ve blanda, no amplia.

**Botones:**

- **Principal:** píldora verde con texto marfil, sin flecha. Sobre verde, se invierte (marfil
  con texto verde). Alto mínimo de 48 px.
- **Secundario:** enlace de texto verde con el chevrón "›" en oro, que se desplaza 2 px al pasar
  el cursor. Es la única "flecha" del sitio, y solo en enlaces secundarios.
- **Presión:** escala 0,97 en 200 ms con `--ease-estandar`.

---

## 4. Inicio — wireframe de escritorio (1440 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo horizontal]   La Firma  Áreas  Equipo  Publicaciones  Contacto  ⌕  (Agende su consulta) │ ← vidrio marfil 72 %
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Inteligencia                                                                │ 1 · HERO (marfil)
│  para decidir.                                    ← display, 96 px, verde    │   ~100 svh
│                                                                              │
│  Estrategia jurídica para decisiones que importan.   ← subtítulo, verde-gris │
│  (Agende su consulta)   Conozca nuestras áreas ›                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                    inicio-hero  16:9 · rounded-contenedor              │  │ ← asoma bajo el
│  │                    escala 1,06 → 1                                     │  │   pliegue e invita
├──┴────────────────────────────────────────────────────────────────────────┴──┤   a bajar
│                                                                              │
│  Más que asesoría jurídica,                                                  │ 2 · QUÉ HACEMOS (marfil)
│  aportamos criterio para decidir.                                            │
│                                                                              │
│  ┌──────────────────────────┐   Entendemos, desde adentro, las cuatro        │
│  │                          │   lógicas que determinan el resultado…         │
│  │  inicio-que-hacemos 4:3  │                                                │
│  │  (fija mientras se lee)  │   Cómo piensa el Estado.     ← se ilumina      │
│  │                          │   Cómo decide un juez.       ← una a una al    │
│  └──────────────────────────┘   Cómo opera una empresa.      cruzar el centro│
│                                 Cómo se desarrolla un negocio.               │
│                                 Esa diferencia lo cambia todo.  ← editorial  │
├──────────────────────────────────────────────────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ Toda organización toma decisiones.                                         ▓│ 3 · EL NUEVO ENTORNO
│▓ Algunas impulsan su crecimiento. Otras comprometen su patrimonio, …        ▓│   (verde profundo)
│▓                                                                            ▓│
│▓ La diferencia no está en la decisión. Está en la estrategia que la respalda.▓│
│▓ ────────────────────────────────────────────────────── filete oro        ▓│
│▓ Cambios regulatorios permanentes.                                          ▓│ ← cinco factores,
│▓ ──────────────────────────────────────────────────────                    ▓│   lista tipográfica
│▓ Contratación pública compleja.                                             ▓│   separada por
│▓ ──────────────────────────────────────────────────────  (× 5)             ▓│   filetes, sin
│▓                                                                            ▓│   íconos
│▓ El derecho deja de ser una función reactiva para convertirse               ▓│ ← editorial
│▓ en un elemento estratégico de gestión.                                     ▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
├──────────────────────────────────────────────────────────────────────────────┤
│  En Riascos & Barrera creemos que el mejor litigio es el que pudo evitarse…  │ 4 · PENSAMOS ANTES
│                                                                              │   DE LITIGAR
│  ┌ fija durante ~4 pantallas de desplazamiento ─────────────────────────────┐│   (marfil, fija)
│  │ Pensamos antes de litigar.                                    1 / 4      ││
│  │                                                                          ││
│  │                                                                          ││
│  │                      Reaccionar        ← verde-gris, se disuelve         ││
│  │                      Anticipar.        ← verde, entra                    ││
│  │                                                                          ││
│  │ Reaccionar · Defender · Resolver · Litigar          ← índice, el actual  ││
│  │ Anticipar  · Proteger · Prevenir · Estrategizar        subrayado en oro  ││
│  └──────────────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────────────┤
│  La especialización estratégica de la firma se concentra en cuatro áreas…    │ 5 · ÁREAS (bento)
│  ┌───────────────────────────────────────┐ ┌──────────────────────────────┐  │
│  │ Derecho Público               ›       │ │ Litigio Administrativo     › │  │ ← mosaicos sin
│  │ Contratación estatal y SECOP I y II.  │ │ Representación de alto nivel │  │   sombra, oliva 15 %
│  │ ┌───────────────────────────────────┐ │ │ ante la Jurisdicción…        │  │
│  │ │ area-derecho-publico  4:3         │ │ └──────────────────────────────┘  │
│  │ └───────────────────────────────────┘ │ ┌─────────────┐ ┌──────────────┐  │
│  │                         (2 × 2)       │ │ Laboral   › │ │ Privado    › │  │
│  └───────────────────────────────────────┘ └─────────────┘ └──────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│  No resolvemos problemas legales. Analizamos decisiones.                     │ 6 · PERSPECTIVAS
│  ─────────────── ─────────────── ─────────────── ───────────────  filetes    │   (marfil)
│  Jurídica        Institucional   Empresarial     Estratégica                 │
│  Alcance legal   Cómo decide     Cómo opera      Riesgos y                   │
│  y cumplimiento. el Estado.      el negocio.     oportunidades.              │
│                                                                              │
│  Firma tradicional          Riascos & Barrera                                │ ← la diferencia
│  Cumple la ley.             Cumple la ley y además revela riesgos,           │   se dice con
│  (pequeño, verde-gris)      implicaciones regulatorias y oportunidades       │   tamaño, no con
│                             estratégicas.  (subtítulo, verde)                │   una tabla ✓/✗
├──────────────────────────────────────────────────────────────────────────────┤
│  Nuestro método              ┃ 01                                            │ 7 · MÉTODO
│  (fijo a la izquierda)       ┃ Comprender.                                   │   línea oro que
│                              ┃ Escuchamos, analizamos y diagnosticamos…      │   se llena al
│                              ┃ 02                                            │   desplazarse
│                              ┃ Diseñar. …                                    │
│                              │ 03 Ejecutar. …                                │
│                              │ 04 Acompañar. …                               │
├──────────────────────────────────────────────────────────────────────────────┤
│▓ Nunca prometemos resultados.                                               ▓│ 8 · PROMESA
│▓ Prometemos una forma de trabajar.        ← Breve News, display, marfil     ▓│   (verde profundo)
│▓ ─────────────── ─────────────── ───────────────                            ▓│
│▓ Rigor técnico…  Respuesta       Estrategias                                ▓│ ← seis compromisos
│▓                 oportuna…       personalizadas…                            ▓│   3 × 2, filete
│▓ ─────────────── ─────────────── ───────────────                            ▓│   encima, sin
│▓ Cercanía…       Confidencialidad Comunicación…                             ▓│   tarjetas
├──────────────────────────────────────────────────────────────────────────────┤
│  9 · EQUIPO (si está activo): retrato 4:5 + nombre + enfoque + "Conozca al equipo ›"
│ 10 · COBERTURA: silueta del mapa + departamentos + "Escríbanos ›" a Contacto
│ 11 · PUBLICACIONES RECIENTES: tres, en fila; la sección no existe si no hay ninguna
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────┐  │ 12 · CIERRE
│  │                 inicio-cierre  21:9  rounded-contenedor                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  Cuando las decisiones importan, el criterio marca la diferencia.            │ ← editorial
│  En Riascos & Barrera creemos que las mejores decisiones no nacen…           │
│  (Agende su consulta)                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│  PIE · logotipo · Boutique Legal Strategy · Público · Privado · dirección ·  │
│  navegación en columnas · políticas · © 2026                     (marfil)    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 5. Inicio — wireframe móvil (390 px)

```
┌──────────────────────────────┐
│ [⛉]        (Agende)    [≡]   │ ← vidrio; escudo solo por debajo de 400 px,
├──────────────────────────────┤   logotipo horizontal por encima
│                              │
│ Inteligencia                 │ 1 · HERO
│ para decidir.   ← 44 px      │
│                              │
│ Estrategia jurídica para     │
│ decisiones que importan.     │
│                              │
│ (  Agende su consulta  )     │ ← píldora a todo el ancho
│ Conozca nuestras áreas ›     │
│ ┌──────────────────────────┐ │
│ │ inicio-hero-movil  4:5   │ │ ← encuadre propio
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Más que asesoría jurídica,   │ 2 · QUÉ HACEMOS
│ aportamos criterio…          │   la imagen va arriba,
│ ┌──────────────────────────┐ │   sin fijar; las cuatro
│ │ inicio-que-hacemos 4:3   │ │   lógicas se iluminan
│ └──────────────────────────┘ │   igual que en escritorio
│ Cómo piensa el Estado.       │
│ Cómo decide un juez.         │
│ …                            │
├──────────────────────────────┤
│▓ Toda organización toma     ▓│ 3 · ENTORNO (verde)
│▓ decisiones.                ▓│
│▓ ──────────── × 5 factores  ▓│
├──────────────────────────────┤
│ Pensamos antes de litigar.   │ 4 · secuencia fija
│          1 / 4               │   (o por pasos en
│       Reaccionar             │   equipos lentos)
│       Anticipar.             │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │ 5 · ÁREAS
│ │ Derecho Público        › │ │   bento → una columna;
│ └──────────────────────────┘ │   el primero conserva
│ ┌──────────┐ ┌─────────────┐ │   su imagen
│ │ Litigio ›│ │ Laboral   › │ │
│ └──────────┘ └─────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Derecho Privado        › │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ 6 · perspectivas 2 × 2 → comparación apilada
│ 7 · método: línea a la izquierda, pasos a la derecha
│ 8 · promesa (verde): compromisos en una columna
│ 9–11 · equipo, cobertura, publicaciones
│ 12 · cierre
└──────────────────────────────┘
       [WhatsApp] ← flotante, vidrio, sobre la zona segura inferior
```

Entre 320 y 400 px, el logotipo horizontal más la píldora y el menú no caben con márgenes
dignos (≈ 318 px de 320). Por eso, por debajo de 400 px la barra usa el escudo solo, que es un
logotipo oficial entregado, no una modificación. La píldora sigue visible en todo momento, como
exige §4.3.

---

## 6. Los seis momentos de animación

Todos usan solo `transform`, `opacity` y `filter`, y se implementan con Motion bajo `LazyMotion`
(`domAnimation`, cargado de forma diferida). Ninguno se ejecuta en el servidor.

| #   | Momento                       | Disparador                                                           | Qué se anima                                                                                                                                                                                       | Duración y curva                                                                            | Con movimiento reducido                                      | Equipos lentos                                                                           |
| --- | ----------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | **Entrada del hero**          | Carga de la página                                                   | Titular por palabras: opacidad 0 → 1, desenfoque 8 → 0 px, desplazamiento 24 → 0 px, con 80 ms entre palabras. Luego el subtítulo (+200 ms) y los botones (+300 ms). La imagen escala de 1,06 a 1. | Palabras 900 ms y botones 700 ms con `ease-salida`; imagen 1,6 s con `ease-salida`          | Todo visible de inmediato                                    | Igual; es barato                                                                         |
| 2   | **Qué hacemos**               | Desplazamiento: cada lógica cruza el 50 % de la altura de la ventana | Color de verde-gris a verde, mediante dos capas superpuestas: la verde sube de opacidad 0 a 1                                                                                                      | Ligado al desplazamiento, con un tramo de transición de 15 % de la ventana                  | Las cuatro en verde                                          | Igual                                                                                    |
| 3   | **Pensamos antes de litigar** | Desplazamiento dentro de una sección de 400 svh con contenido fijo   | Por cada par: el verbo reactivo sale (opacidad 1 → 0, desenfoque 0 → 8 px, −24 px) y el estratégico entra (inverso). El índice inferior mueve el filete oro bajo el par actual.                    | Ligado al desplazamiento, 25 % del recorrido por par, con una meseta de lectura en cada par | Tabla estática de dos columnas: modelo reactivo y estrategia | Cambio por pasos: el par cambia de golpe al cruzar cada cuarto, con un fundido de 400 ms |
| 4   | **Método**                    | Desplazamiento a lo largo de los cuatro pasos                        | La línea oro vertical: `scaleY` de 0 a 1 con origen arriba. El numeral del paso activo pasa de verde-gris a oro.                                                                                   | Ligado al desplazamiento                                                                    | Línea completa y numerales en oro                            | Igual                                                                                    |
| 5   | **Barra de navegación**       | Desplazamiento > 24 px · dirección                                   | Escritorio: se compacta de 72 a 56 px (`scaleY` del fondo y `scale` 0,88 del logotipo). Móvil: se oculta al bajar (`translateY(-100 %)`) y reaparece al subir.                                     | 400 ms, `ease-estandar`                                                                     | Se compacta sin transición y nunca se oculta                 | Igual                                                                                    |
| 6   | **Microinteracciones**        | Puntero y teclado                                                    | Botones: escala 0,97 al presionar. Enlaces: subrayado de `scaleX` 0 → 1. Chevrón: +2 px. Menú móvil y buscador: fundido + desplazamiento de 16 px con desenfoque de fondo.                         | 200 ms para microinteracciones, 400 ms para menú y buscador; `ease-estandar`                | Solo cambios de estado, sin desplazamiento                   | Igual                                                                                    |

Fuera de estos seis, el contenido aparece **sin animación**. Las secciones no "suben con fundido"
al entrar en pantalla.

El momento 3 es la firma visual del sitio, y por eso es el único que ocupa varias pantallas de
desplazamiento. Una sección fija de 400 svh es larga a propósito: cada par tiene que poder
leerse en reposo, no pasar como una diapositiva.

---

## 7. Revisión contra el brief: qué cambié y por qué

§9.8.2 pide revisar el plan buscando lo que haría para cualquier firma de abogados. Esto es lo
que encontré en mi propio primer borrador y lo que hice con ello.

| Primer instinto (genérico)                                                               | Por qué es genérico                                                                                          | Qué quedó                                                                                                                                    |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero con foto oscura a sangre (columnas, balanza, mazo) y titular blanco centrado encima | Es la portada por defecto de las firmas de abogados, y necesita un degradado oscuro para que el texto se lea | Hero tipográfico sobre marfil; la fotografía va debajo, en su propio contenedor, sin superposición ni degradado                              |
| Etiqueta "NUESTROS SERVICIOS" en mayúsculas espaciadas sobre cada título                 | Es la seña más reconocible de una plantilla                                                                  | Ninguna etiqueta: cada título es una frase completa del Anexo A, que ya dice de qué trata la sección                                         |
| Las cuatro áreas en cuatro tarjetas idénticas con ícono de balanza y sombra              | Tarjetas iguales dicen "lista de servicios"; las sombras, "plantilla"                                        | Bento de tamaños distintos, sin sombras ni íconos. Derecho Público es el mosaico mayor porque A.4.2 lo define como el núcleo de la operación |
| Las cuatro perspectivas en cuatro tarjetas con ícono                                     | Repetiría el patrón de las áreas                                                                             | Fila tipográfica con filetes. La comparación con la firma tradicional se expresa con tamaño, no con una tabla de ✓ y ✗                       |
| Método en un "stepper" horizontal con círculos numerados                                 | Es el componente de proceso por defecto                                                                      | Línea vertical oro que se llena al leer, con numerales grandes. Es el filete del sitio llevado a su función                                  |
| Flecha "→" en todos los botones                                                          | El brief lo prohíbe expresamente                                                                             | Botón principal sin flecha; el "›" queda solo en enlaces secundarios                                                                         |
| Degradados de verde a oro en fondos                                                      | El brief lo prohíbe, y además introducen tonos fuera de la paleta                                            | Colores planos. La profundidad viene de la alternancia marfil / verde                                                                        |
| Contadores animados ("+20 años", "500 casos")                                            | Prohibido por la regla 2, y sería convertir una biografía en publicidad                                      | No hay cifras. Los "más de veinte años" viven solo en la biografía de Marcela Riascos, como frase                                            |
| Serif en todos los titulares para "parecer jurídico"                                     | Es la convención del sector                                                                                  | Sans en los titulares; la serif (Breve News) se reserva para la voz editorial de la firma, como máximo una vez por pantalla                  |

Lo que conservé de la convención, a conciencia: un botón "Agende su consulta" siempre visible.
Es el objetivo comercial del sitio y §4.3 lo exige.

---

## 8. Decisiones que dependen de terceros

- **Pie de página en marfil, no en verde.** El pie verde sería lo natural (cierra en la superficie
  dramática), pero el logotipo entregado tiene el nombre en verde y desaparece sobre verde
  (1,00:1). El pie va en marfil con un filete oro superior hasta que llegue la variante en
  marfil. Cuando llegue, cambiarlo es una clase.
- **Ningún logotipo sobre secciones verdes**, por la misma razón. Tampoco hace falta: las dos
  secciones verdes del Inicio son de texto.
- **Fuentes Breve.** Todo lo anterior está pensado para Breve Sans Title y Breve News. Con el
  respaldo (IBM Plex Sans y una serif del sistema) la composición se sostiene, pero pierde
  carácter. La guía de estilos mostrará cuál de los dos está activo.
- **A.2.5 "Propuesta de valor"** no tiene lugar en el Inicio según §5.1 (pregunta P1 de la Fase 0,
  aún abierta). Los wireframes no la incluyen. Si se decide integrarla, el sitio natural es entre
  "Qué hacemos" y "El nuevo entorno".

---

## 9. Qué viene después de aprobar

1. Ajustar los tokens que este plan marque distinto, si hay cambios.
2. Construir los componentes base: barra de vidrio con su compactación, menú móvil a pantalla
   completa, pie, botones, enlaces con chevrón, mosaico y filete.
3. Construir `/guia-de-estilos` (solo en desarrollo), con tokens, tipografía, botones,
   formularios, vidrio, mosaicos, foco y una demostración de cada uno de los seis momentos.
4. Desplegar el esqueleto en GitHub Pages.
