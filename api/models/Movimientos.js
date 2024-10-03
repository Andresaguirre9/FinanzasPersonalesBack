module.exports = {
  datastore: 'finanzaspersonalesdb',
  tableName: 'movimientos',
  attributes: {
    valor_movimiento: {
      type: 'number',
      columnType: 'double',
      required: true,
    },
    tipo_movimiento: {
      type: 'string',
      isIn: ['ingreso', 'egreso'],
      required: true,
    },
    id_cuenta: {
      model: 'cuentas',
    },
    fecha_movimiento: {
      type: 'ref',
      columnType: 'datetime',
      required: true,
    },
    descripcion: {
      type: 'string',
      columnType: 'text',
      allowNull: true,
    },
    categoria_transaccion: {
      type: 'string',
      isIn: [
        'Utilidades', 'Ropa', 'Educación', 'Entretenimiento', 'Salud',
        'Comida', 'Beleza', 'Casa', 'Transporte', 'Viajes',
        'Mascotas', 'Otros',
      ],
      required: true,
    },
  },
};
