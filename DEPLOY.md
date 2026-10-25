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

El sitio vive en **Cloudflare Pages**, y el dominio propio `gd.lauta.site` entra por un
**Worker** que reenvía y cachea el contenido de Pages.

```
gd.lauta.site  →  Worker (proxy + caché)  →  geometria-conurbano.pages.dev
```

Hay además un espejo en GitHub Pages (`machinebreak.github.io/geometria-conurbano`).

Es HTML + JS estático: no hay que compilar nada.

---

## Actualizar el sitio

### Opción A — Cloudflare Pages (dominio principal)

```bash
cd web-dashers

git add -A
git commit -m "descripcion del cambio"
git push

npx wrangler pages deploy . --project-name geometria-conurbano --branch main
```

Wrangler sube solo los archivos que cambiaron, así que los deploys siguientes son rápidos.

> **Ojo 1:** no corras `wrangler` desde una carpeta que tenga `node_modules`.
> Si aparece el error *"Asset too large ... workerd.exe"*, es porque wrangler se instaló
> dentro de la carpeta del sitio. Borrá ese `node_modules` y volvé a correrlo.

> **Ojo 2:** si el deploy falla con *"Failed to upload files"*, es la conexión cortándose.
> La forma que funciona es subir en tandas de ~8 MB (ver `subir-por-partes.ps1` más abajo).
> Wrangler deduplica por hash: una vez subidos todos los archivos, un deploy completo
> termina en segundos porque no re-sube nada.

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

- **Zona DNS**: `lauta.site` en Cloudflare
- **Proyecto Pages**: `geometria-conurbano`
- **Worker**: `geometria-conurbano` con custom domain `gd.lauta.site`
- **SSL**: automático (Cloudflare Universal SSL)

El Worker está en `cfworker/index.js` de este repo y solo hace de proxy con caché:

```
gd.lauta.site/*  →  geometria-conurbano.pages.dev/*
```

Para volver a desplegarlo:

```bash
cd cfworker
npx wrangler deploy
```

Para ver o cambiar el dominio: **Cloudflare Dashboard → Workers & Pages → geometria-conurbano → Settings → Domains & Routes**.

---

## Subir assets en tandas (si el deploy grande falla)

```powershell
powershell -ExecutionPolicy Bypass -File subir-por-partes.ps1
```

Copia el sitio a una carpeta temporal en tandas de ~8 MB y deploya cada una.
Al terminar, corré el deploy completo normal una vez: sube 0 archivos y publica todo junto.

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
- **Tamaño**: ~75 MB, casi todo audio y sprite sheets. La primera carga tarda; después queda en caché.
- **Rutas relativas**: todo usa rutas relativas, por eso funciona igual en la raíz de un dominio o en un subdirectorio.
