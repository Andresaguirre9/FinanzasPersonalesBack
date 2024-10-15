module.exports = {
  friendlyName: "Consultar cuenta",

  description: "Consultar una cuenta en la BD",

  inputs: {
    idCuenta: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function ({ idCuenta }) {
    sails.log.verbose("-----> Consultar cuenta");

    try {
      const usuarioLogueado = this.req.decoded.sub.id;

      const cuentaConsultada =
        await sails.helpers.gestionCuentas.consultarCuenta.with({
          idCuenta: idCuenta,
          idLogin: usuarioLogueado,
        });

      sails.log.verbose("Cuenta encontrada en la BD", cuentaConsultada);
      const cuenta = cuentaConsultada.ejecucion.datos.cuentaConsultada;
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: "La cuenta se encontro con exito",
          },
          datos: { cuenta },
        },
      };
    } catch (error) {
      sails.log.error("cuentas", error);
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
