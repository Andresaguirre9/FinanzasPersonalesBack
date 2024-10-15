module.exports = {
  friendlyName: 'listar Bancos',

  description: '',

  inputs: {
    pagination: {
      description: 'paginacion.',
      example: 'Objeto paginacion ',
      type: 'ref',
      required: true,
    },
  },

  exits: {
  },

  fn: async function ({ pagination }) {
    sails.log.verbose('-----> Helper Listar Bancos');
    sails.log.verbose('Paginacion', pagination);

    try {
      let { page, rowsPerPage, sortBy, descending } = pagination;
      const startRow = (page - 1) * rowsPerPage;
      let filtroSortBy = [];
      let limite = +pagination.limite;
      let sort = {};
      if (sortBy) {
        sails.log.verbose('con sortBy', sortBy);
        sort[sortBy] = descending === 'true' ? 'DESC' : 'ASC';
        filtroSortBy = [sort];
      } else {
        filtroSortBy = [{ primernombre: 'ASC' }];
      }

      let filtroWhere = {
      };

      let queryCount = {
        where: filtroWhere,
      };

      let queryTabla = {
        where: filtroWhere,
        skip: startRow,
        limit: limite,
        sort: filtroSortBy,
      };
      pagination.rowsNumber = await Bancos.count(queryCount);

      const bancos = await Bancos.find(queryTabla);

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: 'Los bancos se listaron con exito',
          },
          datos: {
            pagination: pagination,
            records: {
              data: bancos,
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
