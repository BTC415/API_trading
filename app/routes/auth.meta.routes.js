
import { verifyUser } from '../utils/verifyToken.js'

module.exports = app => {
    const auth = require("../controllers/auth.meta.controller.js");
  
    var router = require("express").Router();
    
    router.post('/auth/:accountId', auth.login);

    router.post('/auth/:accountId', auth.register);

    router.post('/auth/:accountId', auth.logout);

    app.use("/api", router);
  };
  