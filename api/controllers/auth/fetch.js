module.exports = {
  friendlyName: "FetchController",
  inputs: {},
  exits: {
    success: {
      description: "The requesting user agent has been successfully logged in.",
    },

    badToken: {
      description:
        "The provided token header does not match any user in the database.",
      responseType: "unauthorized",
    },
  },
  fn: async function () {
    try {
      const decoded = this.req.decoded;
      const token = this.req.bearerToken;

      var userRecord = await Login.findOne({
        id: decoded.sub.id,
      });

      sails.log.verbose("fetch userRecord", userRecord);

      // If there was no matching user, respond thru the "badCombo" exit.
      if (!userRecord) {
        throw "badToken";
      }

      //return the token here
      return {
        ejecucion: {
          respuesta: {
            estado: "OK",
            message: `${userRecord.email} has been logged in`,
          },
          datos: {
            user: {
              data: userRecord,
            },
            token: "",
          },
        },
      };
    } catch (error) {
      sails.log.error("fetch ", error);
      throw "badToken";
    }
  },
};
