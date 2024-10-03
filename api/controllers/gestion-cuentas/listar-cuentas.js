module.exports = {
  friendlyName: 'listar cuentas',

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
    sails.log.verbose('-----> Listar cuentas');
    sails.log.verbose('Paginacion', pagination);

    try {

      const cuentas = await sails.helpers.gestionCuentas.listarCuentas.with({
        pagination: pagination,
        idLogin: this.req.decoded.sub.id
      });
      console.log('en la 31', cuentas)
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: cuentas.ejecucion.mensaje,
          },
          datos: {
            pagination: cuentas.ejecucion.datos.pagination,
            records: {
              data: cuentas.ejecucion.datos.records.data,
            },
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
