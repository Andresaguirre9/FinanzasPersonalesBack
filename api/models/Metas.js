module.exports = {
  datastore: 'finanzaspersonalesdb',
  tableName: 'metas',
  attributes: {
    id_login: {
      model: 'login',
    },
    fecha_creacion: {
      type: 'ref',
      columnType: 'datetime(6)',
      required: true,
    },
    estado: {
      type: 'string',
      isIn: ['cancelado', 'completado', 'iniciado'],
      defaultsTo: 'iniciado',
    },
    descripcion_meta: {
      type: 'string',
      maxLength: 255,
      required: true,
    },
    cantidad_meta: {
      type: 'number',
      columnType: 'int',
      required: true,
    },
    cantidad_abonada: {
      type: 'number',
      columnType: 'int',
      defaultsTo: 0,
    },
  },
};
