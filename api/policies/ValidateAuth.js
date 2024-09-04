const helpers = require("sails-mysql/helpers");

module.exports = async function (req, res, proceed) {
  let token = req.headers["authorization"];

  try {
    if (!token) {
      return res.forbidden("No se encontró el token");
    }
    let validToken = token.split(' ');
    if (validToken[0]!== 'Bearer') {
      return res.forbidden("Tipo de autenticación no válida");
    }
    const decoded = await sails.helpers.auth.verifyJwtToken.with({
      token: validToken[1]
    })
    req.decoded = decoded
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.badRequest({ error }).json();
    } else if (error.name === 'Exception') {
      return res.redirect('/auth/logout');
    }
    return res.serverError({ error }).json();
  }
  return proceed()
};
