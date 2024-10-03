module.exports = {
  friendlyName: "ForgotController",
  inputs: {
    usuario: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: "string",
      required: true,
    },
  },
  exits: {
    badCombo: {
      description: `The provided email and password combination does not
      match any user in the database.`,
      responseType: "unauthorized",
    },
  },
  fn: async function ({ usuario }) {
    console.log("controlador para recuperar contraseña");
    try {
      const usuarioEncontrado = await Login.findOne({
        usuario: usuario.toLowerCase(),
      });

      if (!usuarioEncontrado) {
        return {
          ejecucion: {
            respuesta: {
              estado: "NOK",
              message: "Los datos ingresados son incorrectos",
            },
            datos: {
              user: {
                data: {},
              },
              token: "",
            },
          },
        };
      }
      let token = await sails.helpers.strings.random("url-friendly");
      await Login.updateOne({ id: usuarioEncontrado.id }).set({
        passwordResetToken: token,
        passwordResetTokenExpiresAt:
          Date.now() + sails.config.recoveryPass.passwordResetTokenTTL,
      });
      await sails.helpers.auth.sendForgotEmail.with({
        to: usuarioEncontrado.usuario,
        recoveryData: {
          token: token,
          urlValidacionToken: sails.config.recoveryPass.urlValidacionToken,
        },
      });
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: `Correo Enviado!`,
          },
        },
      };
    } catch (error) {
      sails.log.error("forgot ", error);
      return {
        ejecucion: {
          respuesta: {
            estado: "NOK",
            message:
              "Si usted cuenta con un usuario en la aplicación, se enviará un correo de recuperación de contraseña.",
          },
        },
      };
    }
  },
};
