const joi = require("joi");

module.exports = async function (req, res, proceed) {
  console.log("Polici para validar parametros")
  const schema = joi.object({
    usuario: joi.string().required(),
    password: joi.string().required(),
  });

  try {

    await schema.validateAsync(req.allParams());
  } catch (error) {
    sails.log(error.stringify);
    if (error.name === "ValidationError") {
      return res.badRequest({ error }).json();
    }
    return res.serverError({ error }).json();
  }
  return proceed();
};
