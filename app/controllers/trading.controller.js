const jwtEncode = require('jwt-encode')
const db = require("../models");
const TradingSignal = db.tradingSignals;
const ExternalTradingSignal = db.externalSignals;
const Strategy = db.strategies;
const Transaction = db.transactionfields;
const secret = 'secret';
const crypto = require('crypto');
const { type } = require('os');
const tradingExternalSignalModel = require('../models/trading.externalSignal.model');
const tradingTradingSignalModel = require('../models/trading.tradingSignal.model');


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

//Generate New Strategy
exports.saveExternalSignals = async (req, res) => {
    try {
        console.log('unused strategy')
        const randomString = generateRandomString(4);
        // const randomString = "105646d8-8c97-4d4d-9b74-413bd66cd4ed"
        console.log('randomString', randomString)
        const isStrategy = await Strategy.findOne({ _id:randomString });
        console.log('isStrategy------->', isStrategy);
        if (!isStrategy) {
            const newStrategy = new Strategy({ _id:randomString});
            console.log('newStrategy------->', newStrategy);
            await newStrategy.save();
            console.log('saved')
            return res.status(200).json({id: newStrategy._id});
        }
        else {
            console.log('404 Error!')
            return res.status(404).json({message: "Error! Faild to generate Strategy id."});
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'An Error Occurred'})
    }
}

//Generate New Strategy
exports.saveTradingSignals = async (req, res) => {
    try {
        request = req.body;
        console.log(request)
        const tradingSignal = new TradingSignal(request);
        await tradingSignal.save();
        return res.status(200).json({message: "saved"});
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'An Error Occurred'})
    }
}

exports.getTradingSignals = async (req, res) => {
    try {
        const subscriberId = req.params.subscriberId;
        console.log("subscriberId", subscriberId);
        const isSubscriberId = await TradingSignal.find({subscriberId: subscriberId});
        if (isSubscriberId) {
            res.status(200).json(isSubscriberId);
        }
        else res.status(404).json({message: "Subscriber id not founded."});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "An Error Occured"});
    }
}

//Update existing signals
exports.updateTradingSignals = async (req, res) => {
    try {
        console.log("update Trading Signals");
        const request = req.body;
        const strategyId = req.params.strategyId;
        const subscriberId = req.params.subscriberId;
        console.log("Id------------>", strategyId);
        const item = await TradingSignal.findOne({subscriberId: subscriberId, strategyId: strategyId});
        
        if (item) {
            console.log("found", item);
            TradingSignal.findOneAndUpdate({subscriberId: subscriberId, strategyId: strategyId}, { $set: request }, { new: false }, (err, updatedDocument) => {
                if (err) {
                    // Handle the error, e.g., return an error response
                    res.status(500).json({ error: err });
                    console.log(err);
                } else {
                    console.log("updated", updatedDocument);
                    // Document updated successfully, return the updated document as the response
                    res.status(200).json({ message: 'Trading Signals saved Successfully' });
                }
            });
        } else {
            console.log("strategy not found");
            res.status(404).json({ message: "Trading Signals not found!" });
        }
    } catch (e) {
        res.status(500).json({ message: 'An Error Occurred', error: e });
    }
}

//get External Trading Signals
exports.getExternalTradingSignals = async (req, res) => {
    try {
        const strategyId = req.params.strategyId;
        console.log("strategyId", strategyId);
        const isstrategyId = await TradingSignal.find({strategyId: strategyId});
        if (isstrategyId) {
            res.status(200).json(isstrategyId);
        }
        else res.status(404).json({message: "Strategy id not founded."});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "An Error Occured"});
    }
}

exports.updateExternalTradingSignals = async (req, res) => {
    try {
        console.log("update Trading Signals")
        const request = req.body;
        const strategyId = req.params.strategyId
        const id = req.params.id;
        console.log("Id------------>", strategyId)
        // console.log("request----------->", request)
        const item = await ExternalTradingSignal.findOne({_id: id, strategyId: strategyId})
        // request.riskLimits = Array.isArray(request.riskLimits) ? request.riskLimits : [request.riskLimits]
        if(item) {
            console.log("found", item)
            ExternalTradingSignal.findByIdAndUpdate(id, request, { new: false }, (err, updatedDocument) => {
                if (err) {
                    // Handle the error, e.g., return an error response
                    res.status(500).json({ error: e  });
                    console.log(err)
                } else {
                    console.log("updated", updatedDocument)
                    // Document updated successfully, return the updated document as the response
                    res.status(200).json({message: 'Trading Signals saved Successfully'});
                }
            });
        }
        else {
            console.log("strategynot font");
            res.status(404).json({message: "Trading Signals not founded!"})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

function calculateTradeRisk(riskPercentage, accountBalance) {
    // Convert risk percentage to decimal
    let riskDecimal = riskPercentage / 100;
    
    // Calculate trade risk
    let tradeRisk = riskDecimal * accountBalance;
    
    return tradeRisk;
}


exports.removeExternalTradingSignals = async (req, res) => {
    try {

    } catch(e) {
        console.log(e);
        res.status(500).json({message: "An Error Occured!"});
    }
}

// Simulated market data
let marketBuyPrices = {
    'BTCUSDT': 50000,
    'ETHUSDT': 2000,
    'EURUSD': 1.07
};
// Simulated market data
let marketSellPrices = {
    'BTCUSDT': 50000,
    'ETHUSDT': 2000,
    'EURUSD': 1.06998
};
let buyPrice;
let sellPrice;
// Function to update market prices
setInterval(() => {
    marketBuyPrices = {
        'BTCUSDT': marketBuyPrices['BTCUSDT'] + Math.floor(Math.random() * 100) - 40,
        'ETHUSDT': marketBuyPrices['ETHUSDT'] + Math.floor(Math.random() * 50) - 15,
        'EURUSD': marketBuyPrices['EURUSD'] + Math.random() * 0.000005-0.000002
    };
    marketSellPrices = {
        'BTCUSDT': marketBuyPrices['BTCUSDT'] + Math.floor(Math.random() * 100) - 50,
        'ETHUSDT': marketBuyPrices['ETHUSDT'] + Math.floor(Math.random() * 50) - 25,
        'EURUSD': marketBuyPrices['EURUSD'] + Math.random() * 0.000005-0.0000025
    };
}, 1000); // Update market prices every 1 second

exports.signalProcessing = async (req, res) => {
    try {
        console.log("signal processing")
        const accountId = req.params.accountId;
        const {time, symbol, type, side, openPrice, positionId, stopLoss, takeProfit, signalVolume, server, timeFrame, lotSize, demo, slipPage} = req.body;
        console.log('accountId', accountId, server)
        const followers = await Strategy.find({strategyId: accountId, server: server})
        console.log(followers)
        followers.forEach(async item => {
            const tradingSignal = new TradingSignal({strategyId: accountId, server: server});
            const isTradigSignal = true;
            tradingSignal.subscriberId = item.slaveaccountId;
            console.log('subscriberId', tradingSignal.subscriberId)
            tradingSignal.positionId = positionId;
            tradingSignal.subscriberPositionId = positionId;
            tradingSignal.timeFrame = timeFrame;
            tradingSignal.demo = demo;
            if (item.symbolFilter.include) {
                if (item.symbolFilter.include.includes(symbol)) tradingSignal.symbol = symbol;
                else isTradigSignal= false;
            }
            if (item.symbolFilter.exclude) {
                if (!item.symbolFilter.exclude.includes(symbol)) tradingSignal.symbol = symbol;
                else isTradigSignal= false;
            }
            if (!item.skipPendingOrders && item.closeAll != "pendingOrder") {
                // const pendingOrder = item.pendingOrder;
                tradingSignal.type = type;
            }
            else {
                if (type == "market") {
                    tradingSignal.type = type;
                }
                else {
                    isTradigSignal = false;
                }
            }
            // if (item.symbolMapping.from === symbol) tradingSignal.symbol = item.symbolMapping.to;
            // else tradingSignal.symbol = symbol;
            if (item.reverse) {
                if (side === "buy") tradingSignal.side = 'sell';
                else if(side ==="sell") tradingSignal.side = 'buy';
                else tradingSignal.side = side;
            }
            else {
                if (side === "buy") tradingSignal.side = 'buy';
                else if(side ==="sell") tradingSignal.side = 'sell';
                else tradingSignal.side = side;
            }
            tradingSignal.time = Date(time);
            tradingSignal.openPrice = openPrice;
            tradingSignal.slippage = slipPage;
            if (item.copyStopLoss){
                if (! item.specificPrice.breakEven) {
                    if(item.specificPrice.moveStopLoss == 0){
                        if (item.maxStopLoss>extractNumbers(stopLoss)[0]) tradingSignal.stopLoss = item.maxStopLoss.toString();
                        else tradingSignal.stopLoss = stopLoss
                    }
                    else {
                        if ((item.maxStopLoss)>item.specificPrice.moveStopLoss) tradingSignal.stopLoss = item.maxStopLoss.toString();
                        else tradingSignal.stopLoss = item.specificPrice.moveStopLoss.toString();
                    }
                }
                else tradingSignal.stopLoss = "0";
            }
            else tradingSignal.stopLoss = item.maxStopLoss.toString();
            if (item.copyTakeProfit) {
                if (item.specificPrice.moveTakeProfit) {
                    if (item.maxTakeProfit<extractNumbers(takeProfit)[0]) tradingSignal.takeProfit = item.maxTakeProfit.toString();
                    else tradingSignal.takeProfit = takeProfit
                }
                else {
                    if (item.maxTakeProfit>item.specificPrice.moveTakeProfit) tradingSignal.takeProfit = item.maxTakeProfit.toString();
                    else tradingSignal.takeProfit = item.specificPrice.moveTakeProfit.toString();
                }
            }
            else tradingSignal.takeProfit =  item.maxTakeProfit.toString();
            // if (!item.skipPendingOrders) tradingSignal.pendingOrder = pendingOrder;
            console.log(item.maxLeverage)
            if (item.leverage > item.maxLeverage) {tradingSignal.leverage = item.maxLeverage;}
            else tradingSignal.leverage = item.leverage;
            // if (item.minTradeVolume>signalVolume) tradingSignal.signalVolume = item.minTradeVolume;
            // else if (item.maxTradeVolume<signalVolume) tradingSignal.signalVolume = item.maxTradeVolume;
            // else tradingSignal.signalVolume = item.maxTradeVolume;
            let volumeFactor = (1 - item.closeVolume);
            // tradingSignal.signalVolume =signalVolume;
            // let subVolume = item.tradeVolume * volumeFactor;
            let lotUnit = 100000;
            if (lotSize === "mini") lotUnit = 10000;
            if (lotSize === "micro") lotUnit = 1000;
            if (lotSize === "nano") lotUnit = 100;
            else lotUnit = 100000;
            tradingSignal.lotSize = lotUnit;
            console.log("lotUnit", lotUnit, item.balance, item.maxTradeRisk)
            if (item.tradeVolume !== 0)
                tradingSignal.subscriberVolume = item.signalVolume*volumeFactor; 
            else if (signalVolume > item.maxTradeVolume)
                tradingSignal.subscriberVolume = item.maxTradeVolume*volumeFactor;
            else if (signalVolume < item.minTradeVolume)
                tradingSignal.subscriberVolume = item.minTradeVolume*volumeFactor;
            else tradingSignal.subscriberVolume = signalVolume*volumeFactor;
            console.log("tradingSignal----------------------->", tradingSignal);
            await tradingSignal.save();
            const tradingSignalString = JSON.stringify(tradingSignal);
            const result = order(subscriberId, symbol, orderType, volume, openPrice, slipPage, stopLoss, takeProfit, comment, accountId)
            if (!result) res.status(404).json({error: "Subscriber is already closed"})
            else res.status(200).json({"message": "success"})
            // res.write(tradingSignalString);
        })
        // res.end();
        return res.status(200).json({message: "Okay"})
    } catch(e) {
        console.log(e);
        res.status(500).json({message: "Internal Sever Error!"})
    }
}

async function setInitialDailyTrade () {
    const closeState = await Strategy.find({});
    const interval = setInterval(async () => {
        let currentime = new Date();
        closeState.forEach(async item => {
            
            if (currentime.getHours() === 0 && currentime.getMinutes() === 0 && currentime.getSeconds() === 0)
                await Strategy.updateOne(item, {$set: {dailyProfit: 0}});
            // console.log('setdaily', item.dailyProfit)
        })
    }, 1000)

}
setInitialDailyTrade();

function extractNumbers(input) {
    const str = String(input)
    // Use a regular expression to find all real numbers in the string
    const numbers = str.match(/\b\d+(\.\d+)?\b/g);
  
    // Convert the extracted strings to actual numbers
    return numbers ? numbers.map(Number) : [];
}

function buySell (orderType, benefit, tradeExecuted) {
    if (orderType == "buy stop" || orderType == "buy limit" || orderType == "buy") {
        benefit = (currentPrice - orderPrice) * volume * 100000;
        if (executionPrice >= takeProfit) {
            tradeExecuted = true;
        } else if (executionPrice <= stopLoss) {
            tradeExecuted = true;
        }
    }
    else if (orderType == "sell limit" || orderType == "sell stop" || orderType == "sell") {
        benefit = (orderPrice-currentPrice) * volume * 100000;
        if (executionPrice >= takeProfit) {
            tradeExecuted = true;
        } else if (executionPrice <= stopLoss) {
            tradeExecuted = true;
        }
    }

}

async function order (subscriberId, symbol, orderType, volume, openPrice, slipPage, stopLoss, takeProfit, comment, accountId) {
    
    let stop_loss = stopLoss;
    let take_profit = takeProfit;
    let orderPrice;
    // Set the first market price
    if (!orderPrice) {
        if (orderType=="buy" || orderType=="sell") {
            switch (orderType) {
                case "sell":
                case "sell limit":
                case "sell stop":
                    orderPrice = marketBuyPrices[symbol];
                    // stop_loss = orderPrice - stopLoss;
                    // take_profit = orderPrice + takeProfit;
                    break;
                default:
                    orderPrice = marketSellPrices[symbol];
                    // stop_loss = orderPrice - stopLoss;
                    // take_profit = orderPrice + takeProfit;
            }
        }
        else orderPrice = openPrice
    }
    let benefit = 0;
    let cnt1 = 0;
    let cnt2 = 0;
    console.log(subscriberId)
    const strategy = await Strategy.findOne({strategyId: accountId, subscriberId: subscriberId, type:orderType, symbol: symbol});
    if(strategy.removedState === false) {
        const tradSignal = await TradingSignal.findOne({strategyId: accountId, subscriberId: subscriberId, type:orderType, symbol: symbol});
        const transaction = new Transaction({accountId: Strategy.accountId, subscriberId: subscriberId, type:orderType, symbol: symbol, tickPrice: orderPrice, amount: volume, profit: benefit, closed: false});
        const interval = setInterval(async () => {
            console.log(tradSignal.stopLoss)
            stop_loss = tradSignal.stopLoss;
            take_profit = tradSignal.takeProfit;
            let trailing = strategy.trailing;
            let executionPrice;
            let tradeExecuted = false;
            let previousPrice = orderPrice
            let currentPrice;
            let currentDate = new Date();
            if (currentDate<tradSignal.closeAfter) {
                // stoploss part
                if (!strategy.isStopLoss) {
                    stop_loss = 0;
                }
                else {
                    if (strategy.specificPrice.breakEven) {
                        stop_loss = orderPrice;
                    }
                    else {
                        if (stopLoss.includes("%")) {
                            stop_loss = orderPrice - (extractNumbers(takeProfit)[0] - orderPrice) * extractNumbers(stopLoss)[0]-strategy.specificPrice.moveStopLoss;
                        }
                        else if (stopLoss.includes("pips")) {
                            switch (orderType) {
                                case "sell":
                                case "sell limit":
                                case "sell stop":
                                    stop_loss = orderPrice + extractNumbers(stopLoss)[0] + strategy.specificPrice.moveStopLoss;
                                    // take_profit = orderPrice + takeProfit;
                                    break;
                                default:
                                    stop_loss = orderPrice - extractNumbers(stopLoss)[0] - strategy.specificPrice.moveStopLoss;
                                    // take_profit = orderPrice + takeProfit;
                            }
                        }
                        else stop_loss = extractNumbers(stopLoss)[0];
                    }
                }
                // take profit part
                if (takeProfit.includes("%")) {
                    take_profit = orderPrice + (openPrice - extractNumbers(stopLoss)[0]) * extractNumbers(takeProfit)[0]+strategy.specificPrice.moveTakeProfit;
                }
                else if (stopLoss.includes("pips")) {
                    switch (orderType) {
                        case "sell":
                        case "sell limit":
                        case "sell stop":
                            stop_loss = orderPrice - extractNumbers(takeProfit)[0]- strategy.specificPrice.moveTakeProfit;
                            // take_profit = orderPrice + takeProfit;
                            break;
                        default:
                            // stop_loss = orderPrice - stopLoss;
                            take_profit = orderPrice + extractNumbers(takeProfit)[0]+ strategy.specificPrice.moveTakeProfit;
                    }
                }
                else take_profit = extractNumbers(takeProfit)[0];
                //current price
                if (orderType == "buy" || orderType == "buy limit" || orderType == "buy stop"){
                    currentPrice = marketSellPrices[symbol];
                }
                else currentPrice = marketBuyPrices[symbol]; 
                const slippageAmount = currentPrice * (slipPage / 100);
                executionPrice = currentPrice + slippageAmount;
                console.log(slippageAmount, "----")
                // if trailing
                if (trailing) {
                    if(currentPrice > previousPrice ) {
                        if (orderType == "buy" || orderType == "buy limit" || orderType == "buy stop"){
                            stop_loss = currentPrice + strategy.stopLoss;
                            take_profit = currentPrice - strategy.takeProfit;
                        }
                        else {
                            stop_loss = currentPrice - strategy.stopLoss;
                            take_profit = currentPrice + strategy.takeProfit;
                        }
                        previousPrice = currentPrice;
                    }
                }

                //when pending order,
                if (currentPrice <= orderPrice ) {cnt1 = cnt1; cnt2 = 1;}
                else {cnt1 = 1; cnt2 = cnt2;}

                if (orderType === "buy limit" || orderType === "sell stop") {
                    if (cnt1 == 0 ) benefit =0;
                    else {
                        buySell(orderType, benefit, tradeExecuted)
                    }
                    tradSignal.profit = benefit;
                    tradSignal.save()
                }
                else if (orderType === "buy stop" || orderType === "sell limit") {
                    if (cnt2 == 0 ) benefit =0;
                    else {
                        buySell(orderType, benefit, tradeExecuted)
                    }
                    tradSignal.profit = benefit;
                    tradSignal.save()
                }
                else {
                    buySell(orderType, benefit, tradeExecuted)
                    tradSignal.profit = benefit;
                    tradSignal.save()
                }
            }
            else {
                tradeExecuted = true;
            }
            await transaction.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {profit: benefit}});
            await Strategy.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {profit: strategy.profit+tradSignal.profit, dailyProfit: strategy.dailyProfit + benefit}});
            if (strategy.profit >= strategy.riskLimits.maxAbsoluteProfit || strategy.profit <= strategy.riskLimits.maxAbsoluteRisk) {
                tradeExecuted = true;
                await Strategy.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {"removedState": true}});
                await transaction.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {closed: true}});
            }
            if (strategy.dailyProfit >= strategy.riskLimits.dailyMaxProfit || strategy.dailyProfit <= strategy.riskLimits.dailyMaxRisk) {
                tradeExecuted = true;
                await transaction.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {closed: true}});
            }
            if (tradeExecuted) {
                // Simulate the trade execution
                clearInterval(interval);
                console.log(`Executed a buy order for ${symbol} at ${currentPrice} with a volume of ${volume}. Benefit: ${benefit}`);
                return true;
            }  // benefit += 1;
                // if(benefit == 10) clearInterval(interval);
        },100)
    }
    else {
        return false;
    }
}

exports.orders = async (req, res) => {
    try {
        console.log("orders");
        const subscriberId = req.params.subscriberId;
        const  {symbol, orderType, volume, openPrice, slipPage, stopLoss, takeProfit, comment, accountId} = req.body;
        if (!symbol || !orderType || !volume || !slipPage || !stopLoss || !takeProfit) {
            return res.status(400).json({ error: 'Missing required parameters' });
        } 
    
    //   if (orderType !== 'buy') {
    //     return res.status(400).json({ error: 'Only buy orders are supported' });
    //   }
    
        if (volume <= 0) {
            return res.status(400).json({ error: 'Volume must be a positive number' });
        }
    
        if (slipPage < 0 || stopLoss < 0 || takeProfit < 0) {
            return res.status(400).json({ error: 'Slippage, stop loss, and take profit must be positive numbers' });
        }
        
        // Validate input parameters
        if (!symbol || !orderType || !volume || !openPrice || !slipPage || !stopLoss || !takeProfit) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        console.log('subscriberId', subscriberId)
        const result = order(subscriberId, symbol, orderType, volume, openPrice, slipPage, stopLoss, takeProfit, comment, accountId)
        if (!result) res.status(404).json({error: "Subscriber is already closed"})
        else res.status(200).json({"message": "success"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal Server Error!"})
    }
}

