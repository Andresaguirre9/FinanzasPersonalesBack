module.exports = {
  datastore: 'finanzaspersonalesdb',
  tableName: 'cuentas',
  attributes: {
    descripcion: {
      type: 'string',
      columnType: 'text',
      allowNull: true
    },
    fecha_creacion: {
      type: 'ref',
      columnType: 'datetime'
    },
    fecha_transaccion: {
      type: 'ref',
      columnType: 'datetime'
    },
    id_banco: {
      model: 'bancos',
    },
    id_login: {
      model: 'login',
    },
    nombre_cuenta: {
      type: 'string',
      required: true,
      maxLength: 120
    },
    saldo_actual: {
      type: 'number',
      columnType: 'double',
      defaultsTo: 0.0
    },
    tipo_cuenta: {
      type: 'string',
      isIn: ['Debito', 'Credito', 'Corriente', 'Nomina', 'Cdt'],
      required: true
    }
  },

  beforeCreate: function(valuesToSet, proceed) {
    valuesToSet.fecha_creacion = new Date();
    return proceed();
  }
};
