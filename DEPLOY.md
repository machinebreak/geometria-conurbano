# Geometria Conurbano

Un juego de ritmo y plataformas que corre en el navegador.

## Online

| | |
|---|---|
| **Dominio propio** | https://gd.lauta.site |
| **Cloudflare Pages** | https://geometria-conurbano.pages.dev |
| **Repositorio** | https://github.com/machinebreak/geometria-conurbano |

---

## Como esta hosteado

El sitio vive en **Cloudflare Pages** y nada mas. Es HTML + JS estatico:
no hay que compilar nada.

```
gd.lauta.site  ->  Cloudflare Pages (geometria-conurbano)
```

El dominio propio se conecta como **Custom Domain** del proyecto de Pages
(Cloudflare sirve el SSL solo). No hay Worker de por medio.

> **Historial:** antes habia un Worker proxy con cache y un espejo en GitHub Pages.
> Los dos se eliminaron. GitHub Pages llego al limite de banda del plan free y el
> Worker no aportaba nada porque Pages ya cachea en el borde.

---

## Actualizar el sitio

```bash
cd web-dashers

git add -A
git commit -m "descripcion del cambio"
git push

npx wrangler pages deploy . --project-name geometria-conurbano --branch main
```

Wrangler sube solo los archivos que cambiaron (deduplica por hash), asi que los
deploys siguientes son rapidos.

> **Ojo 1:** no corras `wrangler` desde una carpeta que tenga `node_modules`.
> Si aparece el error *"Asset too large ... workerd.exe"*, es porque wrangler se
> instalo dentro de la carpeta del sitio. Borra ese `node_modules` y volve a correrlo.

> **Ojo 2:** si el deploy falla con *"Failed to upload files"*, es la conexion
> cortandose. La forma que funciona es subir en tandas de ~8 MB
> (ver `subir-por-partes.ps1` mas abajo). Despues del ultimo lote, corre el deploy
> completo normal una vez: sube 0 archivos y publica todo junto.

---

## Cache y velocidad de carga

`_headers` define cuanto se cachea cada cosa. Sin ese archivo, Pages sirve todo
con `max-age=0` y el navegador revalida los ~146 archivos del juego en cada visita.

| Ruta | Cache-Control |
|---|---|
| `/assets/fonts/*`, `/assets/game-bg/*`, `/assets/game-ground/*`, `/assets/levels/*`, `/assets/music/*`, `/assets/sheets/*`, `/assets/sfx/*`, `/assets/sprites/*` | `max-age=604800` (7 dias) |
| `/assets/scripts/*`, `/assets/style.css`, `/*.html`, `/` | `max-age=0` (siempre fresco) |

**Importante:** Cloudflare Pages **concatena** las reglas que coinciden, no las
sobrescribe. Si `_headers` tiene `/assets/*` y ademas `/assets/scripts/*`, el
navegador lee el primer `max-age` y termina cacheando el codigo, que es justo lo
que no queremos. Por eso las carpetas van listadas una por una, sin comodines
que se solapen.

Los assets estan en **WebP** (PNG convertido con calidad 92; las fuentes van
lossless). Los 59 fondos de nivel **no** se precargan: se piden bajo demanda
la primera vez que se entra a un nivel con ese fondo (ver
`_ensureBackgroundTexture` en `game-scene.js`). Eso bajo el arranque de
~13 MB a ~9 MB.

---

## Configuracion del dominio

- **Zona DNS**: `lauta.site` en Cloudflare
- **Proyecto Pages**: `geometria-conurbano`
- **Custom Domain**: `gd.lauta.site`
- **SSL**: automatico (Cloudflare Universal SSL)

El custom domain necesita **un unico registro DNS**:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| CNAME | `gd` | `geometria-conurbano.pages.dev` | Proxied (naranja) |

Se puede crear desde **Cloudflare Dashboard -> lauta.site -> DNS -> Records**,
o dejando que Pages lo haga solo en
**Workers & Pages -> geometria-conurbano -> Custom domains -> Add domain**.

Si el token de wrangler no tiene el scope `dns_records:edit`, la API devuelve
`Authentication error` (code 10000) y hay que crearlo desde el dashboard.

---

## Subir assets en tandas (si el deploy grande falla)

```powershell
powershell -ExecutionPolicy Bypass -File subir-por-partes.ps1
```

Copia el sitio a una carpeta temporal en tandas de ~8 MB y deploya cada una.
Al terminar, corre el deploy completo normal una vez: sube 0 archivos y publica
todo junto.

---

## Probarlo local

```bash
npm start
```

Abre http://localhost:8080/ (en Windows tambien podes usar `start.bat`).

## Controles

| Accion | Tecla |
|---|---|
| Saltar / mantener | `Espacio`, `Arriba`, `W` |
| Pausa | `Esc` |
| Modo practica | `L` |

En mobile, tocar la pantalla.

## Notas

- **Funciones online**: desactivadas por defecto. El juego arranca y funciona 100% offline.
- **Tamano del repo**: ~69 MB, casi todo audio y sprite sheets. La primera carga
  baja ~9 MB; despues queda en cache 7 dias.
- **Rutas relativas**: todo usa rutas relativas, por eso funciona igual en la raiz
  de un dominio o en un subdirectorio.
- **Claves de textura**: aunque los archivos ahora sean `.webp`, varias claves de
  textura conservan el `.png` en el nombre (ej. `groundSquare_00_001.png`) porque
  el codigo las busca asi. La clave es solo un identificador; la extension real
  va en la ruta del `load`.
