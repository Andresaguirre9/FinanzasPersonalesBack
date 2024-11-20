const ExcelJS = require('exceljs');

module.exports = {
  friendlyName: 'Generar excel con reportes de cuenta',

  description: '',

  inputs: {
    idCuenta: {
      description: 'Número de id referente a la cuenta',
      example: 0,
      type: 'number',
      required: true,
    },
    idLogin: {
      description: 'ID de usuario',
      example: 0,
      type: 'number',
      required: true,
    },
  },

  exits: {},

  fn: async function ({ idCuenta, idLogin }) {
    sails.log.verbose('-----> Helper Generar reporte de cuenta');

    try {
      const cuentaConsultada = await Cuentas.findOne({
        id_login: idLogin,
        id: idCuenta,
      }).populate('id_banco');

      if (!cuentaConsultada) {
        throw new Error('La cuenta consultada no existe');
      }

      const movimientos = await Movimientos.find({
        id_cuenta: idCuenta,
      }).sort('fecha_movimiento DESC');

      // Obtener tasa de ahorro y saldo actual
      const tasaAhorro = cuentaConsultada.id_banco.valor_tasa_ahorro || 0;
      const saldoActual = cuentaConsultada.saldo_actual;

      // Calcular crecimiento anual (interés compuesto)
      const crecimientoAnual = saldoActual * Math.pow(1 + tasaAhorro, 1); // Fórmula de interés compuesto

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Reporte de Cuenta');

      const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0073AA' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      // Agregar título
      sheet.mergeCells('A1', 'E1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = `Reporte de Cuenta - ${cuentaConsultada.nombre_cuenta}`;
      titleCell.alignment = { horizontal: 'center' };
      titleCell.font = { size: 16, bold: true };

      sheet.addRow([]); // Fila en blanco
      sheet.addRow(['Banco:', cuentaConsultada.id_banco.nombre]);
      sheet.addRow(['Saldo Actual:', cuentaConsultada.saldo_actual]);
      sheet.addRow(['Tipo de Cuenta:', cuentaConsultada.tipo_cuenta]);
      sheet.addRow(['Fecha Creación:', cuentaConsultada.fecha_creacion.toISOString().split('T')[0]]);
      sheet.addRow(['Crecimiento Anual Estimado:', crecimientoAnual.toFixed(2)]);  // Mostrar crecimiento anual
      sheet.addRow([]); // Fila en blanco

      // Títulos de movimientos
      sheet.mergeCells('A8', 'E8');
      const movimientosTitleCell = sheet.getCell('A8');
      movimientosTitleCell.value = 'Movimientos de la Cuenta';
      movimientosTitleCell.font = { size: 14, bold: true };
      movimientosTitleCell.alignment = { horizontal: 'center' };

      // Encabezados de columnas de movimientos
      sheet.addRow(['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Valor']);
      const headerRow = sheet.lastRow;
      headerRow.eachCell(cell => {
        cell.style = headerStyle;
      });

      // Agregar movimientos
      movimientos.forEach(mov => {
        sheet.addRow([
          mov.fecha_movimiento.toISOString().split('T')[0],
          mov.descripcion || 'Sin descripción',
          mov.categoria_transaccion,
          mov.tipo_movimiento,
          mov.valor_movimiento,
        ]);
      });

      // Aplicar bordes a todas las celdas de la tabla
      sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.eachCell(cell => {
          if (rowNumber >= 9) { // A partir de la fila de datos
            cell.border = headerStyle.border;
          }
        });
      });

      // Ajustar ancho de las columnas
      sheet.columns = [
        { width: 15 }, // Fecha
        { width: 40 }, // Descripción
        { width: 20 }, // Categoría
        { width: 10 }, // Tipo
        { width: 15 }, // Valor
      ];

      // Exportar workbook a buffer
      const reporteCuentaBuffer = await workbook.xlsx.writeBuffer();

      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message: 'Reporte de cuenta generado con éxito',
          },
          datos: {
            reporteCuentaBuffer,
          },
        },
      };
    } catch (error) {
      sails.log.error('cuentas', error);
      return {
        ejecucion: {
          respuesta: {
            estado: 'NOK',
            message: error.message,
          },
          datos: {},
        }
      };
    }
  },
};
