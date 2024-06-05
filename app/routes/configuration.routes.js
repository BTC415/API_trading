module.exports = app => {
    const configuration = require("../controllers/configuration.controller.js");
  
    var router = require("express").Router();
  
    // Generate New Strategy Id
    router.get("/unused-strategy-id", configuration.generateStrategyId);

    // Get Strategies
    router.get("/get-strategies", configuration.getStrategies)

    // Get Strategy
    router.get("/get-strategies/:strategyId", configuration.getStrategy)

    //Update Strategy
    router.put("/get-strategies/:strategyId", configuration.updateStrategy)

    //Update Strategy
    router.delete("/get-strategies/:strategyId", configuration.deleteStrategy)
    
    // Get Portfolio Strategies
    router.get("/get-portfolio-strategies", configuration.getPortfolioStrategies)
  
    // Get Portfolio Strategy
    router.get("/get-portfolio-strategies/:strategyId", configuration.getPortfolioStrategy)

    //Update Portfolio Strategy
    router.put("/get-portfolio-strategies/:strategyId", configuration.updatePortfolioStrategy)

    //Update Portfolio Strategy
    router.delete("/get-portfolio-strategies/:strategyId", configuration.deletePortfolioStrategy)
    
    //Update Portfolio Member Strategy
    router.delete("/get-portfolio-strategies/:strategyId/Member/:strategyMemberId", configuration.deletePortfolioMemberStrategy)
    
    // Get Portfolio Strategies
    router.get("/get-subscribers", configuration.getSubscribers)
  
    // Get Portfolio Strategy
    router.get("/get-subscribers/:subscriberId", configuration.getSubscriber)

    //Update Portfolio Strategy
    router.put("/get-subscribers/:subscriberId", configuration.updateSubscriber)

    //Update Portfolio Strategy
    router.delete("/get-subscribers/:subscriberId", configuration.deleteSubscriber)
    
    //Update Portfolio Member Strategy
    router.delete("/get-subscribers/:subscriberId/Member/:strategyId", configuration.deleteSubscription)


    app.use("/api/configuration", router);
  };
  