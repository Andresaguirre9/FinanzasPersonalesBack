var blueprintConfig = require("./blueprints");

var ROUTE_PREFIX = blueprintConfig.blueprints.prefix || "";

function addGlobalPrefix(routes) {
  var paths = Object.keys(routes);
  var newRoutes = {};

  if (ROUTE_PREFIX === "") {
    return routes;
  }

  paths.forEach((path) => {
    var pathParts = path.split(" ");
    var uri = pathParts.pop();
    var prefixedURI = "";
    var newPath = "";

    prefixedURI = ROUTE_PREFIX + uri;

    pathParts.push(prefixedURI);

    newPath = pathParts.join(" ");
    // construct the new routes
    newRoutes[newPath] = routes[path];
  });

  return newRoutes;
}

module.exports.routes = addGlobalPrefix({
  /*
   * Rutas para las acciones de autenticación
   *
   */ /*
  "POST /login": { action: "auth/loginController" }, */
  "POST /login": { controller: "auth", action: "login" },
  "POST /signup": { controller: "auth", action: "sign-up" },
  "GET /fetch": { controller: "auth", action: "fetch" },
  "POST /password/forgot": { controller: "auth", action: "forgot" },
  "POST /password/reset": { controller: "auth", action: "update" },
  "GET /cuentas": { controller: "gestion-cuentas", action: "listar-cuentas" },

  "GET /metas": { controller: "gestion-metas", action: "listar-metas" },
  "POST /metas/agregar": {
    controller: "gestion-metas",
    action: "registrar-meta",
  },
  "GET /movimientos": {
    controller: "gestion-movimientos",
    action: "listar-movimientos",
  },
  "GET /movimientos/totalizar": {
    controller: "gestion-movimientos",
    action: "total-ingresos-egresos",
  },
  "POST /movimientos/agregar": {
    controller: "gestion-movimientos",
    action: "registrar-movimiento",
  },

  "POST /cuentas/agregar": {
    controller: "gestion-cuentas",
    action: "crear-cuenta",
  },
  "GET /cuentas/consultar": {
    controller: "gestion-cuentas",
    action: "consultar-cuenta",
  },
  "PUT /cuentas/actualizar": {
    controller: "gestion-cuentas",
    action: "editar-cuenta",
  },
  "GET /cuentas/cargar": {
    controller: "gestion-cuentas",
    action: "cargar-cuenta",
  },
  "POST /cuentas/enviarreporte": {
    controller: "gestion-cuentas",
    action: "generar-reporte-cuenta",
  },
  "GET /bancos": { controller: "gestion-bancos", action: "cargar-bancos" },

  /*   'GET /egresos': { action: 'gestion-egresos/listar-egresos' }, */
  /* 'DELETE /egresos/eliminar': { action: 'gestion-egresos/eliminar-egresos'}, */
  /*   'PUT /productos/actualizar': { action: 'gestion-productos/editar-producto' }, */
  /*
   * Rutas para manejo de cuentas
   *
   */
});
