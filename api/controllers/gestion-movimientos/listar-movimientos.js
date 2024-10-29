module.exports = {
  friendlyName: 'listar movimientos',

  description: '',

  inputs: {
    idCuenta: {
      type: 'number',
      description: 'id de la cuenta a la cual esta registrado el movimiento',
      required: true,
      example: 0
    },
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

  fn: async function ({ pagination, idCuenta }) {
    sails.log.verbose('-----> Listar movimientos por cuenta');
    sails.log.verbose('Paginacion', pagination);

    try {

      const movimientosCuenta = await sails.helpers.gestionMovimientos.listarMovimientos.with({
        pagination: pagination,
        idCuenta: idCuenta,
        idLogin: this.req.decoded.sub.id
      });
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: movimientosCuenta.ejecucion.mensaje,
          },
          datos: {
            pagination: movimientosCuenta.ejecucion.datos.pagination,
            records: {
              data: movimientosCuenta.ejecucion.datos.records.data,
            },
          },
        },
      };
    } catch (error) {
      sails.log.error('movimientosCuenta', error);
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
