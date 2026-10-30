# Geometria Conurbano

**Un juego de ritmo y plataformas que corre en el navegador.**

Esquivá pinches, saltá al ritmo de la música y creá tus propios niveles.

![Geometria Conurbano](wd_branding/wordmark/wordmark_1080.png)

---

## Cómo jugar

**Local**

```bash
npm start
```

Después abrí http://localhost:8080/ — o en Windows, doble click en `start.bat`.

**Controles**

| Acción | Tecla |
|---|---|
| Saltar / mantener | `Espacio`, `↑`, `W` |
| Pausa | `Esc` |
| Práctica | `L` |

En mobile, tocar la pantalla.

---

## Qué trae

- **Niveles principales** — el set completo, jugables de punta a punta.
- **Selector de iconos** — colores, cubos, naves, bolas, ondas, arañas.
- **Gamemodes** — cubo, nave, bola, UFO, onda, robot, araña.
- **Creador de niveles** — armá y probá tus propios niveles.
- **Ajustes** — noclip, hitboxes, porcentaje en pantalla, volumen.
- **Modo práctica** — con checkpoints.

## Estado del proyecto

Es un proyecto en desarrollo activo. Se juega completo, pero hay cosas que todavía se están puliendo:

- El **modo práctica** funciona pero puede tener detalles en los checkpoints.
- El **creador de niveles** está operativo, aunque no tiene todavía el catálogo entero de objetos.
- Las **pendientes** están implementadas y se siguen ajustando con los portales de velocidad.
- Falta el gamemode **Swing**.
- Algunos objetos pueden tener animaciones o colores que todavía no coinciden al 100%.

Si encontrás algo roto, es bienvenido el reporte.

## Estructura

```
index.html                  entrada
server.js                   servidor local (sin dependencias)
assets/
  scripts/core/             motor: escena, jugador, niveles, editor, audio
  scripts/game/             catálogo de objetos y definición de niveles
  scripts/utils/            configuración y caché
  scripts/api/              integración con cuentas (opcional)
  sheets/                   sprite sheets
  levels/                   niveles (base64 + gzip)
  music/  sfx/              audio
wd_branding/                arte y logos
db/schema.sql               esquema de base de datos (opcional)
```

## Funciones online (opcional)

El juego funciona 100% offline. Las funciones online (niveles de la comunidad, cuentas, guardado en la nube) necesitan que configures tus propios servicios:

1. **Proxies** — en `index.html`, declarar `window.GD_PROXY_HOSTS` con tus endpoints.
2. **API de cuentas** — en `assets/scripts/utils/api-config.js`, apuntar `window._apiBase` a tu backend. El esquema de tablas está en `db/schema.sql`.

Sin esa configuración, el juego arranca igual y todo lo local anda.

## Publicarlo online

Es HTML + JS estático, no necesita build.

| | |
|---|---|
| **Dominio** | https://gd.lauta.site |
| **Cloudflare Pages** | https://geometria-conurbano.pages.dev |

Los pasos completos están en [`DEPLOY.md`](DEPLOY.md).

## Comunidad

- **WhatsApp** — https://whatsapp.com/channel/0029VbDpnc1545uwf4F6ju0Z
- **Discord** — https://discord.gg/7hbqkDmKHA

## Créditos

Hecho por PuTop Games — hecho por lauta.

Motor: [Phaser 3](https://phaser.io). Compresión: [pako](https://github.com/nodeca/pako).
