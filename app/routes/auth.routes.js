module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  var router = require("express").Router();
  
  router.post('/auth/login', auth.login);

  router.post('/auth/register', auth.register);

  router.post('/auth/logout', auth.logout);

  app.use("/api", router);
};
