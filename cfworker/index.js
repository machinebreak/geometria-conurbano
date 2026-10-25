// Sirve Geometria Conurbano en el dominio propio gd.lauta.site,
// reenviando a Cloudflare Pages y cacheando en el edge.
//
//   gd.lauta.site/*  ->  geometria-conurbano.pages.dev/*
//
// Deploy:  cd cfworker && npx wrangler deploy
//
// IMPORTANTE: el HTML y el JS del juego NO se cachean en el edge.
// Si se cachean, después de un deploy el dominio sigue sirviendo la
// version vieja (por ejemplo, botones que ya no corresponden).
// Los assets pesados (imagenes, audio) si se cachean, que es donde
// esta el volumen y donde no hay riesgo de quedar desactualizado.
const ORIGIN = "geometria-conurbano.pages.dev";

// Rutas que nunca se cachean: el codigo del juego cambia en cada deploy.
function isCode(pathname) {
  return (
    pathname === "/" ||
    pathname.endsWith("/") ||
    pathname.endsWith(".html") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".json")
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    url.hostname = ORIGIN;
    url.protocol = "https:";
    url.port = "";

    const cache = caches.default;
    const cacheable =
      (request.method === "GET" || request.method === "HEAD") && !isCode(pathname);

    if (cacheable) {
      const hit = await cache.match(request);
      if (hit) return hit;
    }

    const response = await fetch(new Request(url.toString(), request));

    if (!cacheable) {
      // Codigo: siempre fresco.
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "no-cache, must-revalidate");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=86400");
      const copy = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      ctx.waitUntil(cache.put(request, copy));
    }

    return response;
  },
};
