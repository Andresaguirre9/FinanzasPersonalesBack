module.exports = {
  friendlyName: 'Registrar movimiento',

  description: 'Registrar un movimiento en la BD',

  inputs: {
    datosMovimiento: {
      type: 'ref',
      required: true,
    },
  },

  exits: {},

  fn: async function ({ datosMovimiento }) {
    sails.log.verbose('-----> Registrar movimiento');
    sails.log.verbose('Movimiento a registrar', datosMovimiento);

    try {

      let validacionCuenta = await sails.helpers.gestionCuentas.ConsultarCuenta.with({
        idCuenta: datosMovimiento.id_cuenta,
        idLogin: this.req.decoded.sub.id
      })

      if (!validacionCuenta) {
        throw new Error('La cuenta a la que le intenta visualizar los movimientos no le pertenece o no existe')
      }

      datosMovimiento.fecha_movimiento = new Date()

      if (datosMovimiento.tipo_movimiento === 'ingreso') {

        validacionCuenta.saldo_actual += datosMovimiento.valor_movimiento
        validacionCuenta.fecha_transaccion = new Date()

        await Cuentas.updateOne({
          id: datosMovimiento.id_cuenta,
        })
          .set(validacionCuenta)
          .usingConnection(db);

      } else if (datosMovimiento.tipo_movimiento === 'egreso') {

        validacionCuenta.saldo_actual -= datosMovimiento.valor_movimiento
        validacionCuenta.fecha_transaccion = new Date()

        if (validacionCuenta.saldo_actual < 0) {
          throw new Error("Este movimiento no puede realizarse, el valor del movimiento supera el saldo de la cuenta")
        }

        await Cuentas.updateOne({
          id: datosMovimiento.id_cuenta,
        })
          .set(validacionCuenta)
          .usingConnection(db);

      } else {
        throw new Error("El tipo de movimiento no fue reconocido");
      }

      let registroMovimiento = {};
      await Movimientos.getDatastore().transaction(async (db) => {
        registroMovimiento = await Movimientos.create(datosMovimiento)
          .usingConnection(db)
          .fetch();
      });

      sails.log.verbose('Movimiento ingresado en la BD', registroMovimiento);

      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message: 'el movimiento se registro con exito',
          },
          datos: { registroMovimiento },
        },
      };
    } catch (error) {
      sails.log.error('movimientos', error);
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
