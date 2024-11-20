const nodemailer = require('nodemailer');

module.exports = {
  friendlyName: 'Send email',

  description: 'Helper genérico para enviar correos electrónicos con soporte para adjuntos',

  inputs: {
    to: {
      type: 'string',
      required: true,
      description: 'Correo del destinatario',
    },
    from: {
      type: 'string',
      required: true,
      description: 'Correo del remitente',
    },
    subject: {
      type: 'string',
      required: true,
      description: 'Asunto del correo',
    },
    html: {
      type: 'string',
      required: true,
      description: 'Contenido HTML del correo',
    },
    user: {
      type: 'string',
      required: true,
      description: 'Usuario para la autenticación SMTP',
    },
    pass: {
      type: 'string',
      required: true,
      description: 'Contraseña para la autenticación SMTP',
    },
    attachmentBuffer: {
      type: 'ref',
      required: false,
      description: 'Buffer del archivo que se adjuntará al correo',
    },
    attachmentFilename: {
      type: 'string',
      required: false,
      description: 'Nombre del archivo adjunto',
    },
  },

  exits: {
    success: {
      description: 'El correo se envió correctamente',
    },
    error: {
      description: 'Hubo un error al enviar el correo',
    },
  },

  fn: async function ({
    to,
    from,
    subject,
    html,
    user,
    pass,
    attachmentBuffer,
    attachmentFilename,
  }) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: user,
          pass: pass,
        },
      });

      const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html,
        attachments: [],
      };

      if (attachmentBuffer && attachmentFilename) {
        mailOptions.attachments.push({
          filename: attachmentFilename,
          content: attachmentBuffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      }

      const info = await transporter.sendMail(mailOptions);

      sails.log.info(`Correo enviado exitosamente: ${info.messageId}`);
      return {
        estado: 'OK',
        mensaje: 'Correo enviado correctamente',
        messageId: info.messageId,
      };
    } catch (error) {
      sails.log.error('Error al enviar el correo:', error);
      throw 'error';
    }
  },
};
