module.exports = {
  friendlyName: 'listar bancos',

  description: '',

  inputs: {
    pagination: {
      description: 'Filtros de la paginacion.',
      example: 'Objeto paginacion ',
      type: 'ref',
      required: true,
    },
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully logged in.",
    },

  },

  fn: async function ({ pagination }) {
    sails.log.verbose('-----> Listar bancos');

    try {

      //TODO posible validacion para el manejo de rol de administrador

      const bancos = await sails.helpers.gestionBancos.listarBancos.with({
        pagination: pagination,
      });


      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: bancos.ejecucion.mensaje,
          },
          datos: {
            pagination: bancos.ejecucion.datos.pagination,
            records: {
              data: bancos.ejecucion.datos.records.data,
            },
          },
        },
      };
    } catch (error) {
      sails.log.error('bancos', error);
      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            message: error.message,
          },
          datos: {
            pagination: {},
            records: {
              data: [],
            },
          },
        },
      };
    }
  },
};
