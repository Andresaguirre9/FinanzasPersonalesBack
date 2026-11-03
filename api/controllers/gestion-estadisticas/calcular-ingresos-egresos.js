module.exports = {
  friendlyName: "Calcular ingresos y egresos",
  description:
    "Calcula la suma de ingresos y egresos para una cuenta en un rango de fechas.",

  inputs: {
    filter: {
      type: "ref",
      required: true,
      description:
        "Objeto con los filtros: { fechaInicio, fechaFin, idCuenta }",
    },
  },

  exits: {},

  fn: async function ({ filter }) {
    try {
      sails.log.verbose(
        "-----> Calcular valor de ingresos y egresos estadisticas"
      );
      const { fechaInicio, fechaFin, idCuenta } = filter;

      console.log("idCuenta", filter, idCuenta);

      // Validar que la cuenta pertenezca al usuario autenticado
      const idUsuario = this.req.decoded.sub.id;
      const cuenta = await Cuentas.findOne({
        id: idCuenta,
        id_login: idUsuario,
      });

      if (!cuenta) {
        throw new Error("La cuenta no existe o no le pertenece.");
      }

      // Consultar ingresos y egresos en el rango de fechas
      const movimientos = await Movimientos.find({
        where: {
          id_cuenta: idCuenta,
          fecha_movimiento: {
            ">=": new Date(fechaInicio),
            "<=": new Date(fechaFin),
          },
        },
      });
      const { ingresos, egresos } = movimientos.reduce(
        (acc, mov) => {
          if (mov.tipo_movimiento === "Ingreso") {
            acc.ingresos += mov.valor_movimiento;
          } else if (mov.tipo_movimiento === "Egreso") {
            acc.egresos += mov.valor_movimiento;
          }
          return acc;
        },
        { ingresos: 0, egresos: 0 } // Valores iniciales
      );
        console.log(ingresos, egresos,"INGRESOSSS EGRESOSSS")

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            mensaje: "Cálculo de ingresos y egresos exitoso.",
          },
          datos: {
            series: [ingresos, egresos],
          },
        },
      };
    } catch (error) {
      sails.log.error("Error al calcular ingresos y egresos:", error.message);

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
