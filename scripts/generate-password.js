const bcrypt = require("bcrypt");

module.exports = {
  friendlyName: "Generate Password",

  description: "",

  fn: async function () {
    try {
      // Genera un salt
      const salt = await bcrypt.genSalt(10);
      // Hashea la contraseña con el salt generado
      const hashedPassword = await bcrypt.hash("temporal", salt);
      sails.log("password: ", hashedPassword);

      return hashedPassword;
    } catch (err) {
      throw new Error("Error al encriptar la contraseña: " + err.message);
    }
  },
};
