module.exports = app => {
    const history = require("../controllers/history.controller.js");
  
    var router = require("express").Router();

    //save Transactions
    router.get("/saveTransactions", history.saveTransactions)

    //Get Provided Transactions
    router.get("/provided-transactions", history.providedTransaction)

    //Get Subscription Transactions
    router.get("/subscription-transactions", history.subscriptionTransaction)

    //Get Strategy Transaction Stream
    router.get("/strategies/:strategyId/transactions/stream", history.strategyTransactionStream)

    //Get Strategy Transaction Stream
    router.get("/subscribers/:subscriberId/transactions/stream", history.subscriberTransactionstream)

    app.use("/api/history", router);
  };
  