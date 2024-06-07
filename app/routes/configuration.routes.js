module.exports = app => {
    const configuration = require("../controllers/configuration.controller.js");
  
    var router = require("express").Router();
  
    // Generate New Strategy Id
    router.get("/unused-strategy-id", configuration.generateStrategyId);

    // Get Strategies
    router.get("/strategies", configuration.getStrategies)

    // Get Strategy
    router.get("/strategies/:strategyId", configuration.getStrategy)

    //Update Strategy
    router.put("/strategies/:strategyId", configuration.updateStrategy)

    //Delete Strategy
    router.delete("/strategies/:strategyId", configuration.deleteStrategy)
    
    // Get Portfolio Strategies
    router.get("/portfolio-strategies", configuration.getPortfolioStrategies)
  
    // Get Portfolio Strategy
    router.get("/portfolio-strategies/:strategyId", configuration.getPortfolioStrategy)

    //Update Portfolio Strategy
    router.put("/portfolio-strategies/:strategyId", configuration.updatePortfolioStrategy)

    //Delete Portfolio Strategy
    router.delete("/portfolio-strategies/:strategyId", configuration.deletePortfolioStrategy)
    
    //Delete Portfolio Member Strategy
    router.delete("/portfolio-strategies/:strategyId/member/:strategyMemberId", configuration.deletePortfolioMemberStrategy)
    
    // Get Portfolio Strategies
    router.get("/subscribers", configuration.getSubscribers)
  
    // Get Portfolio Strategy
    router.get("/subscribers/:subscriberId", configuration.getSubscriber)

    //Update Portfolio Strategy
    router.put("/subscribers/:subscriberId", configuration.updateSubscriber)

    //Delete Portfolio Strategy
    router.delete("/subscribers/:subscriberId", configuration.deleteSubscriber)
    
    //Delete Portfolio Member Strategy
    router.delete("/subscribers/:subscriberId/subscription/:strategyId", configuration.deleteSubscription)


    app.use("/api/configuration", router);
  };
  