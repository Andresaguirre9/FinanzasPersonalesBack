module.exports = {
  friendlyName: "LoginController",
  inputs: {
    usuario: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: "string",
      required: true,
    },

    password: {
      description:
        'The unencrypted password to try in this attempt, e.g. "passwordlol".',
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
  fn: async function ({ usuario, password }) {
    console.log("controlador para loggin");
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
      await sails.helpers.passwords.checkPassword(
        password,
        usuarioEncontrado.password
      );
      const token = await sails.helpers.auth.generateJwtToken.with({
        subject: usuarioEncontrado.toJSON(),
      });
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: `${usuarioEncontrado.email} esta logueado!`,
          },
          datos: {
            user: {
              data: usuarioEncontrado,
            },
            token: token,
          },
        },
      };
    } catch (error) {
      sails.log.error("Hay un error en el Login", error);
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
  },
};
