# Geometria Conurbano

Un juego de ritmo y plataformas que corre en el navegador.

## 🌐 Online

| | |
|---|---|
| **Dominio propio** | https://gd.lauta.site |
| **Cloudflare Pages** | https://geometria-conurbano.pages.dev |
| **Repositorio** | https://github.com/machinebreak/geometria-conurbano |

---

## Cómo está hosteado

El sitio se publica en **dos lugares** desde el mismo código:

1. **Cloudflare Pages** → `gd.lauta.site` (el dominio principal)
2. **GitHub Pages** → `machinebreak.github.io/geometria-conurbano` (espejo de respaldo)

Es HTML + JS estático: no hay que compilar nada.

---

## Actualizar el sitio

### Opción A — Cloudflare Pages (dominio principal)

```bash
cd web-dashers

# 1. subir el cambio al repo
git add -A
git commit -m "descripcion del cambio"
git push

# 2. publicar en Cloudflare Pages
npx wrangler pages deploy . --project-name geometria-conurbano --branch main
```

Wrangler sube solo los archivos que cambiaron, así que los deploys siguientes son rápidos.
La primera vez pide login: `npx wrangler login`.

> **Ojo:** no corras `wrangler` desde una carpeta que tenga `node_modules`.
> Si aparece el error *"Asset too large ... workerd.exe"*, es porque wrangler se instaló
> dentro de la carpeta del sitio. Borrá ese `node_modules` y volvé a correrlo.

### Opción B — GitHub Pages (espejo)

```bash
cd web-dashers
git add -A
git commit -m "descripcion del cambio"
git push
```

GitHub Pages se regenera solo en 1–2 minutos.

---

## Configuración del dominio (hecho)

- **Zona DNS**: `lauta.site` en Cloudflare (cuenta `Bertuccilautaro@gmail.com`)
- **Proyecto Pages**: `geometria-conurbano`
- **Custom domain**: `gd.lauta.site` → Cloudflare crea el registro DNS automáticamente
- **SSL**: automático (Cloudflare Universal SSL)

Para ver o cambiar el dominio: **Cloudflare Dashboard → Workers & Pages → geometria-conurbano → Custom domains**.

---

## Probarlo local

```bash
npm start
```

Abre http://localhost:8080/ (en Windows también podés usar `start.bat`).

## Controles

| Acción | Tecla |
|---|---|
| Saltar / mantener | `Espacio`, `↑`, `W` |
| Pausa | `Esc` |
| Modo práctica | `L` |

En mobile, tocar la pantalla.

## Notas

- **Funciones online**: desactivadas por defecto. El juego arranca y funciona 100% offline. Para activarlas hay que configurar proxies y una API propia (ver el README).
- **Tamaño**: ~75 MB, casi todo audio y sprite sheets.
- **Rutas relativas**: todo usa rutas relativas, por eso funciona igual en la raíz de un dominio o en un subdirectorio.
