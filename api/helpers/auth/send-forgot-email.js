module.exports = {
  friendlyName: "forgot Password",

  description: "",

  inputs: {
    recoveryData: { type: "ref", required: true },
    to: { type: "string", required: true },
  },

  fn: async function ({ recoveryData, to }) {
    try {
      var isToAddressConsideredFake = Boolean(to.match(/@example\.com$/i));
      var dontActuallySend =
        sails.config.serverMail.fakeEmailTest === true ||
        isToAddressConsideredFake;
      if (dontActuallySend) {
        sails.log(
          'Skipped sending email, either because the "To" email address ended in "@example.com"\n' +
            "or because the current sails.config.fakeEmailTest is set to true.\n" +
            "\n" +
            "But anyway, here is what WOULD have been sent:\n" +
            "-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-\n" +
            to +
            "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"
        );
      } else {
        let recoveryDataStr = recoveryData;
        recoveryDataStr.urlValidacionToken = recoveryDataStr.urlValidacionToken + recoveryData.token;
        console.log('aqui estamos en send forgot', recoveryDataStr)
        await sails.helpers.auth.sendEmail.with({
          to: to,
          from: sails.config.recoveryPass.from,
          user: sails.config.recoveryPass.user,
          pass: sails.config.recoveryPass.pass,
          recoveryData: recoveryDataStr,
        });
      }
      return {
        loggedInsteadOfSending: dontActuallySend,
      };
    } catch (err) {
      throw new Error("Error al intentar enviar el correo: " + err.message);
    }
  },
};
