const nodemailer = require("nodemailer");

module.exports = {
  friendlyName: "Send email",

  description: "",

  inputs: {
    to: { type: "string", required: true },
    from: { type: "string", required: true },
    user: { type: "string", required: true },
    pass: { type: "string", required: true },
    recoveryData: { type: "ref", required: true },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ to, recoveryData, from, user, pass }) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Crear el contenido del correo
    let mailOptions = {
      from: from,
      to: to,
      subject: "Recuperación de contraseña",
      html: `<p>Hola,</p>
             <p>Has solicitado recuperar tu contraseña. Por favor, haz clic en el siguiente enlace para restablecerla:</p>
             <a href="${recoveryData.urlValidacionToken}">Recuperar contraseña</a>
             <p>Si no solicitaste este cambio, ignora este mensaje.</p>`,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Correo enviado: %s", info.messageId);
    } catch (error) {
      console.error("Error al enviar el correo: ", error);
    }
  },
};
