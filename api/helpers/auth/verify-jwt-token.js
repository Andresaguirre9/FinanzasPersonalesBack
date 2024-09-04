const jwt = require("jsonwebtoken");
module.exports = {
  friendlyName: "Verify jwt token",

  description: "",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
  },

  exits: {
    badToken: {
      description: 'The provided token header does not match.',
    },
    expired: {
      description: 'Session timed out, please login again.',
    },
    success: {

      description: "All done.",
    },
  },

  fn: async function ({token}) {

    const secretFrase = sails.config.jwtSecretString

    try {
      const decoded = await jwt.verify(token, secretFrase)
      return decoded
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw { expired: 'Session timed out, please login again' };
      } else {
        sails.log.error('verification error', error);
        return res.forbidden('Error authenticating, please login again');
      }
    }
  },

};
