# Geometria Conurbano

Un juego de ritmo y plataformas que corre en el navegador.

## Publicarlo en GitHub Pages

El juego es HTML + JS estático: no hay que compilar nada.

### 1. Crear el repositorio

Desde GitHub, **New repository** → nombre `geometria-conurbano` → **Public** → **Create**.
No marques "Add a README" (ya hay uno).

### 2. Subir el código

```bash
cd web-dashers
git remote add origin https://github.com/TU-USUARIO/geometria-conurbano.git
git push -u origin main
```

O con GitHub CLI, que crea el repo y hace el push de una:

```bash
cd web-dashers
gh repo create geometria-conurbano --public --source=. --remote=origin --push
```

### 3. Activar Pages

En el repo: **Settings → Pages**

- **Source**: `Deploy from a branch`
- **Branch**: `main`
- **Folder**: `/ (root)`
- **Save**

En 1–2 minutos queda online en:

```
https://TU-USUARIO.github.io/geometria-conurbano/
```

El archivo `.nojekyll` ya está incluido, así que GitHub no procesa el sitio con Jekyll ni ignora carpetas.

### 4. Actualizar después de un cambio

```bash
git add -A
git commit -m "descripcion del cambio"
git push
```

Pages se regenera solo.

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
- **Tamaño del repo**: ~78 MB, casi todo audio y sprite sheets. GitHub acepta archivos de hasta 100 MB, así que entra sin LFS.
- **Rutas relativas**: todo usa rutas relativas, por eso funciona igual en la raíz de un dominio o en un subdirectorio como `/geometria-conurbano/`.
