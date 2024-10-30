module.exports = {
  friendlyName: 'Consultar Cuenta',

  description: '',

  inputs: {
    idCuenta: {
      description: 'Numero de id referente a la cuenta',
      example: 0,
      type: 'number',
      required: true,
    },

    idLogin: {
      description: 'id de usuario',
      example: 0,
      type: 'number',
      required: true,
    },
  },

  exits: {},

  fn: async function ({ idCuenta, idLogin }) {
    sails.log.verbose('-----> Helper Consultar Cuenta');

    try {

      const cuentaConsultada = await Cuentas.findOne({
        id_login: idLogin,
        id: idCuenta
      })

      if (!cuentaConsultada) {
        throw new Error('La cuenta consultada no existe')
      }

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: 'La cuenta se encontro con exito',
          },
          datos: {
            cuentaConsultada
          },
        },
      };
    } catch (error) {
      sails.log.error('cuentas', error);
      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            message: error.message,
          },
          datos: {
          },
        },
      };
    }
  },
};
