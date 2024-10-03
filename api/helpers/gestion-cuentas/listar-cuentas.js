module.exports = {
  friendlyName: 'listar Cuentas',

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
    sails.log.verbose('-----> Helper Listar Cuentas');
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
      pagination.rowsNumber = await Cuentas.count(queryCount);

      sails.log.verbose('filtroWhere', filtroWhere);
      const cuentas = await Cuentas.find(queryTabla).populate('id_banco');
      sails.log.verbose('verbose sails log', cuentas)

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: 'Las cuentas se listaron con exito',
          },
          datos: {
            pagination: pagination,
            records: {
              data: cuentas,
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
