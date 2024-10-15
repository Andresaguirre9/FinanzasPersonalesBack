module.exports = {
  friendlyName: "Cargar cuentas",

  description: "Cargar todos los cuentas de la BD",

  inputs: {},

  exits: {},

  fn: async function () {
    sails.log.verbose("-----> Cargar cuentas");

    try {
      let cuentas = await Cuentas.find({
        id_login: this.req.decoded.sub.id,
      });
      cuentas = cuentas.map((cuenta) => ({
        label: cuenta.nombre_cuenta,
        value: cuenta.id,
      }));
      sails.log.verbose("Lista de cuentas en la BD", cuentas);

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: "Las cuentas se cargaron con exito",
          },
          datos: { cuentas },
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
