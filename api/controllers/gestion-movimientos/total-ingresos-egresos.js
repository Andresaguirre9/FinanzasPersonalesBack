module.exports = {
  friendlyName: 'Total de ingresos y egresos por cuenta',

  description: '',

  inputs: {
    idCuenta: {
      type: 'number',
      description: 'id de la cuenta a la cual esta registrado el movimiento',
      required: true,
      example: 0
    },
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully logged in.",
    },

  },

  fn: async function ({ idCuenta }) {
    sails.log.verbose('-----> Totalizar ingresos y egresos por cuenta');

    try {

      const validacionCuenta = await sails.helpers.gestionCuentas.consultarCuenta.with({
        idCuenta: idCuenta,
        idLogin: this.req.decoded.sub.id,
      });

      if (!validacionCuenta) {
        throw new Error("La cuenta no le pertenece o no existe.");
      }

      const cuenta = validacionCuenta.ejecucion.datos.cuentaConsultada;

      const movimientosCuenta = await Movimientos.find({
        id_cuenta: cuenta.id
      });

      let totalEgresos = 0
      let totalIngresos = 0

      movimientosCuenta.forEach(movimiento => {
        console.log(movimiento,'consolemovimientoooooooo')
        if (movimiento.tipo_movimiento === 'Egreso') {
          totalEgresos += movimiento.valor_movimiento
        } else if (movimiento.tipo_movimiento === 'Ingreso') {
          totalIngresos += movimiento.valor_movimiento
        } else {
          sails.log.info("Movimiento no reconocido")
        }
      });

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: "Ingresos y egresos totalizados",
          },
          datos: {
            totales: {
              egresos: totalEgresos,
              ingresos: totalIngresos
            }
          },
        },
      };
    } catch (error) {
      sails.log.error('Ingresos y egresos', error);
      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            message: error.message,
          },
          datos: {
            totales: {}
          },
        },
      };
    }
  },
};
