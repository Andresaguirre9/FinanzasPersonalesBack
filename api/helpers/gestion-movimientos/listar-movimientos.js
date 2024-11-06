module.exports = {
  friendlyName: 'listar Movimientos',

  description: '',

  inputs: {
    pagination: {
      description: 'paginacion.',
      example: 'Objeto paginacion ',
      type: 'ref',
      required: true,
    },
    idCuenta: {
      description: 'id de la cuenta',
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

  exits: {
  },

  fn: async function ({ pagination, idLogin, idCuenta }) {
    sails.log.verbose('-----> Helper Listar movimientos');
    sails.log.verbose('Paginacion', pagination);

    try {
      // validacion de la cuenta

      const validacionCuenta = await Cuentas.findOne({
        id_login: idLogin,
        id: idCuenta
      })

      if (!validacionCuenta) {
        throw new Error('La cuenta a la que le intenta visualizar los movimientos no le pertenece o no existe')
      }


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
        id_cuenta: idCuenta
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
      pagination.rowsNumber = await Movimientos.count(queryCount);

      const movimientosCuenta = await Movimientos.find(queryTabla).populate('id_cuenta');

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: 'Los movimientos de la cuenta se listaron con exito',
          },
          datos: {
            pagination: pagination,
            records: {
              data: movimientosCuenta,
            },
          },
        },
      };
    } catch (error) {
      sails.log.error('movimientos', error);
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
