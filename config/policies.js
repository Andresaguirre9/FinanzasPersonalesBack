module.exports.policies = {
  "*": "ValidateAuth",
  "auth/fetch": "ValidateFetch",

  "auth/login": "validate-login-params",
  "auth/sign-up": "validate-login-params",
};
