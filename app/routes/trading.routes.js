
// import { verifyUser } from '../utils/verifyToken.js'
const { verifyUser } = require('../utils/verifyToken.js');
module.exports = app => {
    const trading = require("../controllers/trading.controller.js");
  
    var router = require("express").Router();

    //save TradingSignals
    router.post("/saveTradingSignals", verifyUser, trading.saveTradingSignals)

    //Get Trading Signals
    router.get("/subscribers/:subscriberId/signals", verifyUser, trading.getTradingSignals)

    //Update  Trading Signals
    router.put("/subscribers/:subscriberId/strategy/:strategyId", verifyUser, trading.updateTradingSignals)

    //Get External Trading Signals
    router.get("/strategies/:strategyId/external-signals", verifyUser, trading.getExternalTradingSignals)

    //Update External Trading Signals
    router.put("/strategies/:strategyId/external-signals/:id", verifyUser, trading.updateExternalTradingSignals)

    //Remove External Trading Signals
    router.post("/strategies/:strategyId/external-signals/:id/remove", verifyUser, trading.removeExternalTradingSignals)

    //Signal process
    router.post("/accounts/:accountId/signals", verifyUser, trading.signalProcessing)

    router.post("/subscribers/:subscriberId/orders", verifyUser, trading.orders)

    app.use("/api/trading", router);
  };
  