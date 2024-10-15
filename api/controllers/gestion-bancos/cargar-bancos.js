module.exports = {
  friendlyName: 'Cargar bancos',

  description: 'Cargar todos los bancos de la BD',

  inputs: {
  },

  exits: {},

  fn: async function () {
    sails.log.verbose('-----> Cargar bancos');

    try {
      let bancos = await Bancos.find();
      bancos = bancos.map(banco =>({
        label: banco.nombre,
        value: banco.id
      }))
      sails.log.verbose('Lista de bancos en la BD', bancos);

      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message: 'Los bancos se cargaron con exito',
          },
          datos: { bancos },
        },
      };
    } catch (error) {
      sails.log.error('bancos', error);
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
