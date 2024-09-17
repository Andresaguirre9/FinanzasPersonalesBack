module.exports = {
  friendlyName: "signupController",
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
    console.log("controlador para registro de usuario");
    try {
      const usuarioEncontrado = await Login.findOne({
        usuario: usuario.toLowerCase(),
      });

      if (usuarioEncontrado) {
        return {
          ejecucion: {
            respuesta: {
              estado: "NOK",
              message: "El usuario ya se encuentra registrado",
            },
            datos: {
              user: {
                data: {},
              },
            },
          },
        };
      }

      if (!password && !password.length) {
        return {
          ejecucion: {
            respuesta: {
              estado: "NOK",
              message: "ingrese una contraseña válida",
            },
            datos: {
              user: {
                data: {},
              },
            },
          },
        };
      }

      const hashPassword = await sails.helpers.auth.generateHashPassword.with({
        password: password,
      });
      const emailPattern = /^\w+([.-_+]?\w+)@\w+([.-]?\w+)(\.\w{2,10})+$/;
      if (!emailPattern.test(usuario)) {
        return {
          ejecucion: {
            respuesta: {
              estado: "NOK",
              message: "El email ingresado no es válido",
            },
            datos: {
              user: {
                data: {},
              },
            },
          },
        };
      }

      const usuarioGenerado = await Login.create({
        usuario: usuario,
        password: hashPassword,
      })
      .fetch();

      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: `${usuarioGenerado.usuario} ha sido registrado!`,
          },
          datos: {
            user: {
              data: usuarioGenerado,
            },

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
          },
        },
      };
    }
  },
};
