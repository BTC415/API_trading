
// import { verifyUser } from '../utils/verifyToken.js'
const { verifyUser } = require('../utils/verifyToken.js');

module.exports = app => {
    const configuration = require("../controllers/configuration.controller.js");

    // var verifyUser = require("../utils/verifyToken.js");
  
    var router = require("express").Router();
    

    //Save Master Strategy
    router.post("/master-strategies", verifyUser, configuration.saveMasterStrategy);

    //update Master Strategy
    router.put("/master-strategies/:accountId", verifyUser, configuration.updateMasterStrategy)
  
    // Generate New Strategy Id
    router.post("/register-account", verifyUser, configuration.saveSlaveSettings);

    // Get Strategies
    router.get("/strategies", verifyUser, configuration.getStrategies)

    // Get Strategy
    router.get("/strategies/:strategyId", verifyUser, configuration.getStrategy)

    //Update Strategy
    router.put("/strategies/:strategyId", verifyUser, configuration.updateStrategy)

    //Delete Strategy
    router.delete("/strategies/:strategyId", verifyUser, configuration.deleteStrategy)
    
    // Get Portfolio Strategies
    router.get("/portfolio-strategies", verifyUser, configuration.getPortfolioStrategies)
  
    // Get Portfolio Strategy
    router.get("/portfolio-strategies/:strategyId", verifyUser, configuration.getPortfolioStrategy)

    //Update Portfolio Strategy
    router.put("/portfolio-strategies/:strategyId", verifyUser, configuration.updatePortfolioStrategy)

    //Delete Portfolio Strategy
    router.delete("/portfolio-strategies/:strategyId", verifyUser, configuration.deletePortfolioStrategy)
    
    //Delete Portfolio Member Strategy
    router.delete("/portfolio-strategies/:strategyId/member/:strategyMemberId", verifyUser, configuration.deletePortfolioMemberStrategy)
    
    // Get Portfolio Strategies
    router.get("/subscribers", verifyUser, configuration.getSubscribers)
  
    // Get Portfolio Strategy
    router.get("/subscribers/:subscriberId", verifyUser, configuration.getSubscriber)

    //Update Portfolio Strategy
    router.put("/subscribers/:subscriberId", verifyUser, configuration.updateSubscriber)

    //Delete Portfolio Strategy
    router.delete("/subscribers/:subscriberId", verifyUser, configuration.deleteSubscriber)
    
    //Delete Portfolio Member Strategy
    router.delete("/subscribers/:subscriberId/subscription/:strategyId", verifyUser, configuration.deleteSubscription)


    app.use("/api/configuration", router);
  };
  