module.exports = app => {
    const trading = require("../controllers/trading.controller.js");
  
    var router = require("express").Router();

    //save TradingSignals
    router.post("/saveTradingSignals", trading.saveTradingSignals)

    //Get Trading Signals
    router.get("/subscribers/:subscriberId/signals", trading.getTradingSignals)

    //Get External Trading Signals
    router.get("/strategies/:strategyId/external-signals", trading.getExternalTradingSignals)

    //Update External Trading Signals
    router.put("/strategies/:strategyId/external-signals/:id", trading.updateExternalTradingSignals)

    //Remove External Trading Signals
    router.post("/strategies/:strategyId/external-signals/:id/remove", trading.removeExternalTradingSignals)

    //Signal process
    router.post("/accounts/:accountId/signals", trading.signalProcessing)

    app.use("/api/trading", router);
  };
  