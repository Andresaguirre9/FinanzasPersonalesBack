module.exports = {
  friendlyName: 'Agregar meta',

  description: 'Crear una meta en la BD',

  inputs: {
    datosMeta: {
      type: 'ref',
      required: true,
    },
  },

  exits: {},

  fn: async function ({ datosMeta }) {
    sails.log.verbose('-----> Agregar meta');
    sails.log.verbose('meta a agregar', datosMeta);

    try {
      let registroMeta = {};
      datosMeta.id_login = this.req.decoded.sub.id
      await Metas.getDatastore().transaction(async (db) => {
        registroMeta = await Metas.create(datosMeta)
          .usingConnection(db)
          .fetch();
      });

      sails.log.verbose('Meta ingresada en la BD', registroMeta);

      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message: 'La meta se creó con exito',
          },
          datos: {registroMeta},
        },
      };
    } catch (error) {
      sails.log.error('metas', error);
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
