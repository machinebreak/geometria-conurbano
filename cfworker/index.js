// Sirve Geometria Conurbano en el dominio propio gd.lauta.site,
// reenviando a Cloudflare Pages y cacheando en el edge.
//
//   gd.lauta.site/*  ->  geometria-conurbano.pages.dev/*
//
// Deploy:  cd cfworker && npx wrangler deploy
const ORIGIN = "geometria-conurbano.pages.dev";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    url.hostname = ORIGIN;
    url.protocol = "https:";
    url.port = "";

    const cache = caches.default;
    const cacheable = request.method === "GET" || request.method === "HEAD";

    if (cacheable) {
      const hit = await cache.match(request);
      if (hit) return hit;
    }

    const response = await fetch(new Request(url.toString(), request));

    if (cacheable && response.ok) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=3600");
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
