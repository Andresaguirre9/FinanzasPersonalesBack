module.exports = {
  friendlyName: 'Update password',

  description:
    'Finish the password recovery flow by setting the new password, based on the authenticity of their token.',

  inputs: {
    usuario: {
      type: 'string',
      required: true,
    },
    password: {
      description:
        'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true,
    },
    tokenreset: {
      description:
        'The password token that was generated by the sendPasswordRecoveryEmail endpoint.',
      example: 'gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds',
      required: true,
    },
  },

  exits: {
    success: {
      description:
        'Password successfully updated, and requesting user agent is now logged in.',
    },

    invalidToken: {
      description:
        'The provided password token is invalid, expired, or has already been used.',
      responseType: 'expired',
    },
  },

  fn: async function ({usuario, password, tokenreset}) {
    try {
      if (!tokenreset) {
        throw 'invalidToken';
      }
      var passwordResetToken = tokenreset;
      var userRecord = await Login.findOne({
        passwordResetToken,
        usuario: usuario,
      });

      if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
        throw 'invalidToken';
      }

      if (!userRecord) {
      }
      const hashPassword = await sails.helpers.auth.generateHashPassword.with({
        password: password,
      });
      console.log('hashpasss', hashPassword)
      await Login.updateOne({ id: userRecord.id }).set({
        password: hashPassword,
        passwordResetToken: '',
        passwordResetTokenExpiresAt: 0,
      });
      return {
        ejecucion: {
          respuesta: {
            estado: 'OK',
            message:
              'Si sus datos son correctos, se actualizará su contraseña.',
          },
        },
      };
    } catch (error) {
      return {
        ejecucion: {
          respuesta: {
            estado: 'NOK',
            message:
              'Si sus datos son correctos, se actualizará su contraseña.',
          },
        },
      };
    }
  },
};
