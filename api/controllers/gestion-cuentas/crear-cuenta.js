module.exports = {
  friendlyName: 'Agregar cuenta',

  description: 'Crear ua nueva cuenta en la BD',

  inputs: {
    datosCuenta: {
      type: 'ref',
      required: true,
    },
  },

  exits: {},

  fn: async function ({ datosCuenta }) {
    sails.log.verbose('-----> Agregar ccuenta');
    sails.log.verbose('cuenta a agregar', datosCuenta);

    try {
      let registroCuenta = {};
      datosCuenta.id_login = this.req.decoded.sub.id
      await Cuentas.getDatastore().transaction(async (db) => {
        registroCuenta = await Cuentas.create(datosCuenta)
          .usingConnection(db)
          .fetch();
      });

      sails.log.verbose('Cuenta ingresado en la BD', registroCuenta);

      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message: 'La cuenta se creó con exito',
          },
          datos: {registroCuenta},
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
