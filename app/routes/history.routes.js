
import { verifyUser } from '../utils/verifyToken.js'
module.exports = app => {
    const history = require("../controllers/history.controller.js");
  
    var router = require("express").Router();

    //save Transactions
    router.get("/saveTransactions", verifyUser, history.saveTransactions)

    //Get Provided Transactions
    router.get("/provided-transactions", verifyUser, history.providedTransaction)

    //Get Subscription Transactions
    router.get("/subscription-transactions", verifyUser, history.subscriptionTransaction)

    //Get Strategy Transaction Stream
    router.get("/strategies/:strategyId/transactions/stream", verifyUser, history.strategyTransactionStream)

    //Get Strategy Transaction Stream
    router.get("/subscribers/:subscriberId/transactions/stream", verifyUser, history.subscriberTransactionstream)

    app.use("/api/history", router);
  };
  