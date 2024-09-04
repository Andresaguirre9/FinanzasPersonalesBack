module.exports.policies = {
  '*': 'ValidateAuth',

  'auth/login': 'validate-login-params',
};
