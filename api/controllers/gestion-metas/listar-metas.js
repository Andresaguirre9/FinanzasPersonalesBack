module.exports = {
  friendlyName: 'listar metas',

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
    sails.log.verbose('-----> Listar metas');
    sails.log.verbose('Paginacion', pagination);

    try {

      const metas = await sails.helpers.gestionMetas.listarMetas.with({
        pagination: pagination,
        idLogin: this.req.decoded.sub.id
      });
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: metas.ejecucion.mensaje,
          },
          datos: {
            pagination: metas.ejecucion.datos.pagination,
            records: {
              data: metas.ejecucion.datos.records.data,
            },
          },
        },
      };
    } catch (error) {
      sails.log.error('metas', error);
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
