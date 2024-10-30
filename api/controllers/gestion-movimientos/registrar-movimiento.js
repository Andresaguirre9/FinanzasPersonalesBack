module.exports = {
  friendlyName: "Registrar movimiento",
  description: "Registrar un movimiento en la BD",

  inputs: {
    datosMovimiento: {
      type: "ref", // Idealmente, especifica el tipo exacto si es posible
      required: true,
    },
  },

  exits: {},

  fn: async function ({ datosMovimiento }) {
    sails.log.verbose("-----> Registrar movimiento");

    try {
      const idUsuario = this.req.decoded.sub.id; // Se almacena para mejorar legibilidad
      sails.log.verbose("Movimiento a registrar", datosMovimiento, idUsuario);

      // Validar la cuenta del usuario
      const validacionCuenta = await sails.helpers.gestionCuentas.consultarCuenta.with({
        idCuenta: datosMovimiento.id_cuenta,
        idLogin: idUsuario,
      });

      if (!validacionCuenta) {
        throw new Error("La cuenta no le pertenece o no existe.");
      }

      const cuenta = validacionCuenta.ejecucion.datos.cuentaConsultada;
      sails.log.verbose("Cuenta antes de las modificaciones", cuenta);
      datosMovimiento.valor_movimiento = parseInt(datosMovimiento.valor_movimiento);


      // Actualizar saldo según el tipo de movimiento
      if (datosMovimiento.tipo_movimiento === "ingreso") {
        cuenta.saldo_actual += datosMovimiento.valor_movimiento;
      } else if (datosMovimiento.tipo_movimiento === "egreso") {
        cuenta.saldo_actual -= datosMovimiento.valor_movimiento;

        if (cuenta.saldo_actual < 0) {
          throw new Error("Saldo insuficiente para realizar este movimiento.");
        }
      } else {
        throw new Error("Tipo de movimiento no reconocido.");
      }

      // Registrar la fecha de transacción
      cuenta.fecha_transaccion = new Date();


      sails.log("Modificacion de cuenta: ", cuenta)

      await Cuentas.updateOne({ id: cuenta.id }).set({
        saldo_actual: cuenta.saldo_actual,
        fecha_transaccion: cuenta.fecha_transaccion
      });

      // Registrar el movimiento en una transacción para mayor seguridad
      let registroMovimiento;
      await Movimientos.getDatastore().transaction(async (db) => {
        sails.log("registro de movimiento: ", datosMovimiento)
        registroMovimiento = await Movimientos.create(datosMovimiento)
          .usingConnection(db)
          .fetch();
      });

      sails.log.verbose("Movimiento registrado en la BD", registroMovimiento);

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: "El movimiento se registró con éxito.",
          },
          datos: { registroMovimiento },
        },
      };
    } catch (error) {
      sails.log.error("Error al registrar movimiento:", error.message);

      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            message: error.message,
          },
          datos: {},
        },
      };
    }
  },
};
