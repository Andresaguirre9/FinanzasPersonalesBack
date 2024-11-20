module.exports = {
  friendlyName: "Generar reporte de cuenta",

  description: "Generar reporte general de una cuenta",

  inputs: {
    idCuenta: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function ({ idCuenta }) {
    sails.log.verbose("-----> Generar reporte cuenta");

    try {
      const usuarioLogueado = this.req.decoded.sub.id;

      let reporteBuffer =
        await sails.helpers.gestionCuentas.generarExcelCuenta.with({
          idCuenta: idCuenta,
          idLogin: usuarioLogueado,
        });

      reporteBuffer = reporteBuffer.ejecucion.datos.reporteCuentaBuffer

      const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Cuenta</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #3498DB;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 20px;
      line-height: 1.6;
      color: #333333;
    }
    .body p {
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background-color: #eeeeee;
      font-size: 14px;
      color: #777777;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #4caf50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }
    .button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Reporte de Cuenta</h1>
    </div>
    <div class="body">
      <p>Hola,</p>
      <p>Adjunto encontrarás el reporte detallado de tu cuenta generado automáticamente desde el aplicativo de Finanzas Personales.</p>
      <p>Este archivo contiene toda la información relevante de tu cuenta, incluyendo los datos necesarios para tu gestión financiera.</p>
      <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.</p>
      <p style="margin-top: 20px;">Gracias por confiar en nosotros para tus necesidades financieras.</p>
    </div>
    <div class="footer">
      <p>Este correo ha sido generado automáticamente, por favor no respondas a este mensaje.</p>
      <p>&copy; 2024 Finanzas Personales. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`;


      const respuestaEnvio = await sails.helpers.utilidades.sendEmail.with({
        to: this.req.decoded.sub.usuario,
        from: sails.config.recoveryPass.from,
        user: sails.config.recoveryPass.user,
        pass: sails.config.recoveryPass.pass,
        subject: 'Reporte de cuenta - ' + new Date(),
        html: html,
        attachmentBuffer: reporteBuffer,
        attachmentFilename: 'Reporte de cuenta - ' + new Date(),
      })

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: "Reporte generado enviado con exito",
          },
          datos: {},
        },
      };
    } catch (error) {
      sails.log.error("cuentas", error);
      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            message: error.message,
          },
          datos: {},
        },
      };
    }
  },
};
