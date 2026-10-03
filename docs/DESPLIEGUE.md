# Despliegue

Guía de la infraestructura del sitio (especificación §16). Se completa por fases: el dominio propio,
Resend y la lista de verificación final llegan en la Fase 7.

Los comandos se ejecutan desde la raíz del repositorio, con Node vía nvm
(`source ~/.nvm/nvm.sh`) y la CLI de Supabase vinculada al proyecto.

## 1. GitHub Pages

- Fuente de Pages: **GitHub Actions** (Settings → Pages → Source).
- Flujo: `.github/workflows/desplegar.yml`. Se ejecuta con cada `push` a `main`, con el evento
  `repository_dispatch` de tipo `contenido-actualizado` (lo envía la Edge Function
  `reconstruir-sitio`) y a mano desde la pestaña Actions.
- Variables del repositorio (Settings → Secrets and variables → Actions → Variables):

| Variable                        | Valor actual                                            |
| ------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://oscarnarvaez.github.io/pg_web_riascos_Barrera` |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://duhmgtjnlvwfgvdoqngz.supabase.co`              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública del proyecto (no es secreta)              |
| `PERMITIR_PENDIENTES`           | `true` durante las Fases 1–6; se retira en la Fase 7    |

La ruta base se deriva de `NEXT_PUBLIC_SITE_URL`. Mientras esa URL sea la de github.io, todo el
sitio lleva `noindex`.

## 2. Supabase

### Base de datos

```bash
supabase link --project-ref duhmgtjnlvwfgvdoqngz   # una vez; pide la contraseña en la terminal
supabase db push --linked                          # aplica supabase/migrations/
pnpm test:bd                                       # pruebas pgTAP contra el proyecto, sin Docker
supabase db advisors --linked                      # revisor de seguridad y rendimiento
```

Nada se crea a mano en el panel de Supabase sin su migración (§6.1). Los dos avisos esperados del
revisor son `autores_publicos()` (pública a propósito) y `usuarios_del_panel()` (comprueba dentro
que quien la llama es administrador).

### Configuración de Auth

La configuración vive en `supabase/config.toml` y se sube con:

```bash
supabase config diff    # revise la diferencia antes de subir nada
supabase config push
```

`config push` sube todo lo que el archivo declara. Antes de subir, iguale en el archivo los valores
remotos que no quiera cambiar.

> **Cuidado con `[auth.email] enable_signup`.** En la plataforma esa opción activa o desactiva el
> proveedor de correo completo, incluido el ingreso con contraseña. Debe quedar en `true`. El
> registro público lo cierra `[auth] enable_signup = false`. Para comprobarlo:
> `POST /auth/v1/signup` debe responder `signup_disabled`.

Estado aplicado: registro público cerrado; contraseñas de 12 caracteres como mínimo, con
mayúsculas, minúsculas y números; URL del sitio y redirección limitada a `/panel/restablecer/`;
enlaces de correo válidos 24 horas.

Las plantillas de correo en español (`supabase/templates/`) están preparadas pero comentadas en
`config.toml`: el plan gratuito solo permite cambiarlas con un SMTP propio. Se activan cuando
Resend sea el SMTP del proyecto (Authentication → Emails → SMTP Settings). Hasta entonces, el
remitente de Supabase solo entrega a las direcciones del equipo del proyecto.

### Edge Functions

```bash
supabase functions deploy invitar-usuario reconstruir-sitio --use-api
```

`--use-api` empaqueta en el servidor y no necesita Docker. Las funciones están en JavaScript
(`supabase/functions/`); su lógica se prueba con Vitest (`pnpm test`).

| Secreto                                                              | Uso                                        | Estado                    |
| -------------------------------------------------------------------- | ------------------------------------------ | ------------------------- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`                          | Los provee la plataforma                   | Automático                |
| `SITE_URL`                                                           | CORS y enlaces de invitación               | Configurado (github.io)   |
| `GITHUB_DISPATCH_TOKEN`                                              | `reconstruir-sitio` dispara la compilación | **Pendiente** (sección 3) |
| `REBUILD_WEBHOOK_SECRET`                                             | Autentica el webhook de la base de datos   | Fase 5                    |
| `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `LEADS_EMAIL`, `MAIL_FROM` | `enviar-formulario`                        | Fase 5                    |

Los secretos se configuran en el panel de Supabase (Edge Functions → Secrets) o con
`supabase secrets set NOMBRE=valor` en su terminal. Nunca se escriben en el repositorio ni se
pegan en una conversación.

## 3. Token de GitHub para recompilar el sitio

`reconstruir-sitio` necesita un token para enviar el evento `repository_dispatch`. Debe ser de
**granularidad fina** y con el permiso mínimo (§13):

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** →
   Generate new token.
2. Nombre: `rb-reconstruir-sitio`. Caducidad: la que admita su política (anote la fecha para
   renovarlo).
3. Repository access: **Only select repositories** → `OscarNarvaez/pg_web_riascos_Barrera`.
4. Permissions → Repository permissions → **Contents: Read and write**. Es el permiso que exige
   `POST /repos/{owner}/{repo}/dispatches`. Ningún otro.
5. Copie el token y guárdelo como secreto `GITHUB_DISPATCH_TOKEN` en Supabase (Edge Functions →
   Secrets → Add new secret).

Para comprobarlo, use en el panel el botón **Actualizar el sitio ahora** y verifique en la pestaña
Actions que se inicia el flujo "Desplegar" con el evento `repository_dispatch`. Sin el token, el
panel avisa que falta configurar la conexión con GitHub.

## 4. Primer administrador (§16.4)

1. Panel de Supabase → **Authentication → Users → Add user → Create new user**: correo y una
   contraseña robusta, con **Auto Confirm User** marcado.
2. El usuario nace con rol `editor`. Para hacerlo administrador, en **SQL Editor**:

   ```sql
   update public.profiles
   set role = 'admin', full_name = 'Nombre completo'
   where id = (select id from auth.users where email = 'correo@dominio.com');
   ```

   No lo convierta en migración: el correo quedaría en el repositorio público.

3. Ingrese en `/panel/ingresar/`. Desde ahí, los demás usuarios se invitan en **Usuarios**.

La base impide quitar el rol al último administrador.

## 5. Dominio (Fase 7)

Ver §16.2 de la especificación: DNS en Squarespace, respaldo previo de la zona y sin tocar los
registros de Google Workspace (MX, SPF y DKIM).
