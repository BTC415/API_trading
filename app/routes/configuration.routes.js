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
    app.use("/api/configuration", router);
    
    //Update Portfolio Member Strategy
    router.delete("/get-portfolio-strategies/:strategyId/Member/:strategyMemberId", configuration.deletePortfolioMemberStrategy)
    app.use("/api/configuration", router);
  };
  