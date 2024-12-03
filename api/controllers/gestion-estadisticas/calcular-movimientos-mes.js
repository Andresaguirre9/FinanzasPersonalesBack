module.exports = {
  friendlyName: "Calcular movimientos mensuales",
  description: "Calcula los movimientos mensuales agrupados por mes.",

  inputs: {
    filter: {
      type: "ref",
      required: true,
      description: "Objeto con los filtros: { fechaInicio, fechaFin, idCuenta }",
    },
  },

  exits: {},

  fn: async function ({ filter }) {
    try {
      sails.log.verbose("-----> Calcular valor movimientos mensuales");
      const { fechaInicio, fechaFin, idCuenta } = filter;

      // Validar que la cuenta pertenezca al usuario autenticado
      const idUsuario = this.req.decoded.sub.id;

      const cuenta = await Cuentas.findOne({
        id: idCuenta,
        id_login: idUsuario,
      });

      if (!cuenta) {
        throw new Error("La cuenta no existe o no le pertenece.");
      }

      // Consultar movimientos en el rango de fechas
      const movimientos = await Movimientos.find({
        where: {
          id_cuenta: idCuenta,
          fecha_movimiento: { ">=": new Date(fechaInicio), "<=": new Date(fechaFin) },
        },
      });

      // Agrupar movimientos por mes
      const movimientosPorMes = {};
      movimientos.forEach((mov) => {
        const mes = new Date(mov.fecha_movimiento).toISOString().slice(0, 7); // yyyy-MM
        if (!movimientosPorMes[mes]) movimientosPorMes[mes] = 0;
        movimientosPorMes[mes] += mov.valor_movimiento;
      });

      // Crear categorías ordenadas
      const categories = Object.keys(movimientosPorMes).sort();

      // Crear series alineadas con las categorías
      const series = [
        {
          name: "Movimientos",
          data: categories.map((mes) => movimientosPorMes[mes] || 0),
        },
      ];

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            mensaje: "Cálculo de movimientos mensuales exitoso.",
          },
          datos: {
            categories,
            series,
          },
        },
      };
    } catch (error) {
      sails.log.error("Error al calcular movimientos mensuales:", error.message);

      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            mensaje: error.message,
          },
          datos: {},
        },
      };
    }
  },
};
