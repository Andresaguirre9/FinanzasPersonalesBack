module.exports = {
  friendlyName: 'listar Metas',

  description: '',

  inputs: {
    pagination: {
      description: 'paginacion.',
      example: 'Objeto paginacion ',
      type: 'ref',
      required: true,
    },

    idLogin: {
      description: 'id de usuario',
      example: 0,
      type: 'number',
      required: true,
    },
  },

  exits: {
  },

  fn: async function ({ pagination, idLogin }) {
    sails.log.verbose('-----> Helper Listar Metas');
    sails.log.verbose('Paginacion', pagination);

    try {
      let { page, rowsPerPage, sortBy, descending } = pagination;
      const startRow = (page - 1) * rowsPerPage;
      let filtroSortBy = [];
      let limite = +pagination.limite;
      let sort = {};
      if (sortBy) {
        sort[sortBy] = descending === 'true' ? 'DESC' : 'ASC';
        filtroSortBy = [sort];
      } else {
        filtroSortBy = [{ primernombre: 'ASC' }];
      }

      let filtroWhere = {
        id_login: idLogin
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
      pagination.rowsNumber = await Metas.count(queryCount);

      const metas = await Metas.find(queryTabla);

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: 'Las metas se listaron con exito',
          },
          datos: {
            pagination: pagination,
            records: {
              data: metas,
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
