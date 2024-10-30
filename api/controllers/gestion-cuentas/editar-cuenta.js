module.exports = {
  friendlyName: 'Consultar cuenta',

  description: 'Consultar una cuenta en la BD',

  inputs: {
    datosCuenta: {
      type: 'ref',
      required: true,
    }
  },

  exits: {},

  fn: async function ({ datosCuenta }) {
    sails.log.verbose('-----> Consultar cuenta');

    try {

      const usuarioLogueado = this.req.decoded.sub.id

      let cuentaEditada = {}

      await Cuentas.getDatastore().transaction(async (db) => {

        const validacion = await sails.helpers.gestionCuentas.consultarCuenta.with({
          idCuenta: datosCuenta.id,
          idLogin: usuarioLogueado
        })

        if (!validacion) {
          throw new Error('La cuenta no pudo ser obtenida')
        } else {
          if (datosCuenta.fecha_creacion != validacion.fecha_creacion ||
            datosCuenta.fecha_transaccion != validacion.fecha_transaccion ||
            datosCuenta.id_banco != validacion.id_banco ||
            datosCuenta.id_login != validacion.id_login ||
            datosCuenta.saldo_actual != validacion.saldo_actual
          ) {
            throw new Error("Revise los campos que esta editando, no es posible modificarlos");
          }
        }

        cuentaEditada = await Cuentas.updateOne({
          id: datosCuenta.id,
        })
          .set(datosCuenta)
          .fetch()
          .usingConnection(db);
      });

      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message: 'La cuenta se modifico con exito',
          },
          datos: { cuentaEditada },
        },
      };
    } catch (error) {
      sails.log.error('cuentas', error);
      return {
        ejecucion: {
          respuesta: {
            estado: 'NOK',
            message: error.message,
          },
          datos: {},
        },
      };
    }
  },
};
