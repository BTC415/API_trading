module.exports = app => {
    const configuation = require("../controllers/configuration.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Spot
    router.get("/unused-strategy-id", configuation.generateStrategyId);
    router.get("/strategy", configuation.strategy);
    router.post("/portfolio/strategy", configuation.wallet);
    // router.post('/save-avatar', chats.avatar);
  
    app.use("/api/configuation", router);
  };
  