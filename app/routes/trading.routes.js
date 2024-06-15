
import { verifyUser } from '../utils/verifyToken.js'
module.exports = app => {
    const trading = require("../controllers/trading.controller.js");
  
    var router = require("express").Router();

    //save TradingSignals
    router.post("/saveTradingSignals", verifyUser, trading.saveTradingSignals)

    //Get Trading Signals
    router.get("/subscribers/:subscriberId/signals", verifyUser, trading.getTradingSignals)

    //Get External Trading Signals
    router.get("/strategies/:strategyId/external-signals", verifyUser, trading.getExternalTradingSignals)

    //Update External Trading Signals
    router.put("/strategies/:strategyId/external-signals/:id", verifyUser, trading.updateExternalTradingSignals)

    //Remove External Trading Signals
    router.post("/strategies/:strategyId/external-signals/:id/remove", verifyUser, trading.removeExternalTradingSignals)

    //Signal process
    router.post("/accounts/:accountId/signals", verifyUser, trading.signalProcessing)

    app.use("/api/trading", router);
  };
  