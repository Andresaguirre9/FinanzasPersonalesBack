const bcrypt = require("bcrypt");

module.exports = {
  friendlyName: "Generate Password",

  description: "",

  inputs: {
    password: { type: "string", required: true },
  },

  fn: async function ({password}) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
    } catch (err) {
      throw new Error("Error al encriptar la contraseña: " + err.message);
    }
  },
};
