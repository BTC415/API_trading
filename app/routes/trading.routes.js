module.exports = app => {
    const trading = require("../controllers/trading.controller.js");
  
    var router = require("express").Router();

    //save TradingSignals
    router.post("/saveTradingSignals", trading.saveTradingSignals)

    //Get Trading Signals
    router.get("/subscribers/:subscriberId/signals", trading.getTradingSignals)

    app.use("/api/trading", router);
  };
  