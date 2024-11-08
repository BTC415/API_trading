const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

//auth DB.
db.authentications = require("./auth.model.js")(mongoose);

//configuration DB.
db.strategies = require("./configuration.strategy.model.js")(mongoose);
db.masters = require("./configuration.master.model.js")(mongoose);
db.portfolioStrategies = require("./configuration.portfolioStrategy.model.js")(mongoose);
db.subscribers = require("./configuration.subscriber.model.js")(mongoose);

//history DB.
db.transactionfields = require("./history.transaction.model.js")(mongoose);

//trading DB.
db.tradingSignals = require("./trading.tradingSignal.model.js")(mongoose);
db.externalSignals = require("./trading.externalSignal.model.js")(mongoose);
module.exports = db;
