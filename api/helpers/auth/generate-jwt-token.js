const { required } = require("joi");
const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Generate jwt token",

  description: "",

  inputs: {
    subject: { type: "ref", required: true },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ subject }) {
    const payload = { sub: subject, iss: "LogRocket Sails API" };
    const secretFrase = sails.config.jwtSecretString;
    const token = jwt.sign(payload, secretFrase, { expiresIn: "1h" });
    return token;
  },
};
