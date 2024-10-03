module.exports = {
  datastore: 'finanzaspersonalesdb',
  tableName: 'bancos',
  attributes: {
    nombre: {
      type: 'string',
      maxLength: 100,
      required: true,
    },
    valor_tasa_ahorro: {
      type: 'number',
      columnType: 'double',
      required: true,
    },
    cuota_manejo: {
      type: 'number',
      columnType: 'double',
      required: true,
    },
    cuentas: {
      collection: 'cuentas',
      via: 'id_banco',
    },
  },
};
