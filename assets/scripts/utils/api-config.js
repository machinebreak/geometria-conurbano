// Base de la API de cuentas (opcional).
//
// Si tenés un backend propio, poné su URL acá, por ejemplo:
//   window._apiBase = "https://api.mi-dominio.com";
//
// Si queda vacío (""), las funciones de cuenta se desactivan solas y el
// juego funciona igual: no se hace ninguna petición de sesión al arrancar.

window._apiBase = (function () {
  if (typeof window._apiBaseOverride === "string") return window._apiBaseOverride;
  return "";
}());

// Indica si hay un backend de cuentas configurado.
window._apiEnabled = function () {
  return typeof window._apiBase === "string" && window._apiBase.length > 0;
};

// Endpoint para bajar canciones personalizadas de niveles online (opcional).
// Formato esperado: recibe ?id=<songID> y devuelve el audio.
// Si queda vacío, esa función se desactiva y no se hace ninguna petición.
window._songEndpoint = window._songEndpoint || "";
