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

exports.signalProcessing = async (req, res) => {
    try {
        console.log("signal processing")
        const accountId = req.params.accountId;
        const {time, symbol, type, side, openPrice, positionId, stopLoss, takeProfit, signalVolume, server, timeFrame, lotSize} = req.body;
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
            tradingSignal.time = Date(time);
            if (item.reverse) {
                if (side === "buy") tradingSignal.side = 'sell';
                else if(side ==="sell") tradingSignal.side = 'buy';
            }
            else {
                if (side === "buy") tradingSignal.side = 'buy';
                else tradingSignal.side = 'sell';
            }
            tradingSignal.openPrice = openPrice;
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
            tradingSignal.signalVolume =signalVolume;
            let subVolume = item.tradeVolume * volumeFactor;
            tradingSignal.lotSize = lotSize;
            let lotUnit = 100000;
            if (lotSize === "mini") lotUnit = 10000;
            if (lotSize === "micro") lotUnit = 1000;
            if (lotSize === "nano") lotUnit = 100;
            else lotUnit = 100000;
            console.log("lotUnit", lotUnit, item.balance, item.maxTradeRisk)
            //calculatae subscriber volume
            // let subVolume = (item.balance * item.maxTradeRisk)/(signalVolume*leverage*lotUnit);
            console.log("subvolume----------------------->", subVolume); 
            // Adjusting subscriber volume based on riskLimit
            if (item.riskLimits.maxAbsoluteRisk > item.riskLimits.maxRelativeRisk) {
                // If maxAbsoluteRisk is higher than maxRelativeRisk
                if (subVolume > item.riskLimits.maxAbsoluteRisk) {
                    // Decrease subscriber volume if it exceeds maxAbsoluteRisk
                    subVolume = item.riskLimits.maxAbsoluteRisk;
                    console.log("Adjusted subscriber volume to maxAbsoluteRisk");
                }
            } else if (item.riskLimits.maxAbsoluteRisk < item.riskLimits.maxRelativeRisk) {
                // If maxRelativeRisk is higher than maxAbsoluteRisk
                if (subVolume > item.riskLimits.maxRelativeRisk) {
                    // Decrease subscriber volume if it exceeds maxRelativeRisk
                    subVolume = item.riskLimits.maxRelativeRisk;
                    console.log("Adjusted subscriber volume to maxRelativeRisk");
                }
            }
            tradingSignal.subscriberVolume = subVolume; 
            console.log("tradingSignal----------------------->", tradingSignal);
            await tradingSignal.save();
            const tradingSignalString = JSON.stringify(tradingSignal);
            // res.write(tradingSignalString);
        })
        // res.end();
        return res.status(200).json({message: "Okay"})
    } catch(e) {
        console.log(e);
        res.status(500).json({message: "Internal Sever Error!"})
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

async function closeTrade () {
    const closeState = await Strategy.find({});
    const interval = setInterval(async () => {
        closeState.forEach(async item => {
            const trade = await Transaction.find({accountId: item.accountId, subscriberId: item.subscriberId, closed: false, symbol: item.symbol});
            let profit = 0;
            let dailyProfit = 0;
            const currentime = new Date;
            trade.forEach( it => {
                profit = profit - it.tickPrice + marketPrices[it.symbol];
                if (currentime.getUTCDate() === it.time.getUTCDate()) {
                    dailyProfit = dailyProfit - it.tickPrice + marketPrices[it.symbol];
                    
                }
            })
            console.log('trackProft')
            await Strategy.updateOne({accountId: item.accountId, subscriberId: item.subscriberId, symbol: item.symbol}, {$set: {profit: profit}});
            if( profit <= item.riskLimits.maxAbsoluteRisk || profit >= item.riskLimits.maxAbsoluteProfit ){ 
                await Strategy.updateOne({accountId: item.accountId, subscriberId: item.subscriberId, symbol: item.symbol}, {$set: {removedState: true}});
                clearInterval(interval);
            }
            if (currentime.getHours() === 0 && currentime.getMinutes() === 0 && currentime.getSeconds() === 0)
                await Strategy.updateOne({accountId: item.accountId, subscriberId: item.subscriberId, symbol: item.symbol}, {$set: {dailyProfit: 0}});
        })
    }, 1000)

}
// closeTrade();

function extractNumbers(input) {
    const str = String(input)
    // Use a regular expression to find all real numbers in the string
    const numbers = str.match(/\b\d+(\.\d+)?\b/g);
  
    // Convert the extracted strings to actual numbers
    return numbers ? numbers.map(Number) : [];
}

exports.orders = async (req, res) => {
    try {
        console.log("orders");
        const subscriberId = req.params.subscriberId;
        const  {symbol, orderType, volume, price, slippage, stopLoss, takeProfit, comment, accountId} = req.body;
        if (!symbol || !orderType || !volume || !slippage || !stopLoss || !takeProfit) {
            return res.status(400).json({ error: 'Missing required parameters' });
        } 
    
    //   if (orderType !== 'buy') {
    //     return res.status(400).json({ error: 'Only buy orders are supported' });
    //   }
    
        if (volume <= 0) {
            return res.status(400).json({ error: 'Volume must be a positive number' });
        }
    
        if (slippage < 0 || stopLoss < 0 || takeProfit < 0) {
            return res.status(400).json({ error: 'Slippage, stop loss, and take profit must be positive numbers' });
        }
        
        // Validate input parameters
        if (!symbol || !orderType || !volume || !price || !slippage || !stopLoss || !takeProfit) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
    
        // Continuously monitor the market price
        const strategy = await Strategy.findOne({strategyId: accountId, subscriberId: subscriberId, type:orderType, symbol: symbol});

        let stop_loss = stopLoss;
        let take_profit = takeProfit;
        if (strategy.stopLoss.includes("%")) {
            stop_loss = extractNumbers(strategy.takeProfit)[0] * extractNumbers(strategy.stopLoss)[0];
        }
        else stop_loss = extractNumbers(strategy.stopLoss)[0];
        if (strategy.takeProfit.includes("%")) {
            take_profit = extractNumbers(strategy.stopLoss)[0] * extractNumbers(strategy.takeProfit)[0];
        }
        else take_profit = extractNumbers(strategy.takeProfit)[0];

        let orderPrice;
          // Set the first market price
          if (!orderPrice) {
            switch (orderType) {
                case "sell":
                case "sell limit":
                case "sell stop":
                    orderPrice = marketBuyPrices[symbol];
                    stop_loss = orderPrice - stopLoss;
                    take_profit = orderPrice + takeProfit;
                    break;
                default:
                    orderPrice = marketSellPrices[symbol];
                    stop_loss = orderPrice - stopLoss;
                    take_profit = orderPrice + takeProfit;
            }
        }
        let benefit;
        const transaction = new Transaction({accountId: accountId, subscriberId: subscriberId, type:orderType, symbol: symbol, tickPrice: orderPrice, amount: volume, profit: benefit, closed: false})
        
        if(strategy.removedState === false) {
            let trailing = strategy.trailing;
            let executionPrice;
            let tradeExecuted = false;
            let previousPrice = orderPrice
            let currentPrice;
            const interval = setInterval(async () => {
                if (orderType == "buy" || orderType == "buy limit" || orderType == "buy stop"){
                    currentPrice = marketSellPrices[symbol];
                }
                else currentPrice = marketBuyPrices[symbol];
                if (trailing) {
                    if(currentPrice > previousPrice ) {
                        if (orderType == "buy" || orderType == "buy limit" || orderType == "buy stop"){
                            stopLoss = currentPrice + strategy.stopLoss;
                            takeProfit = currentPrice - strategy.takeProfit;
                        }
                        else {
                            stopLoss = currentPrice - strategy.stopLoss;
                            takeProfit = currentPrice + strategy.takeProfit;
                        }
                        previousPrice = currentPrice;
                    }
                }
                    // Check if the price has reached the take-profit or stop-loss level
                if (orderType == "buy") {
                    console.log("orderPrice", orderPrice)
                    if (!currentPrice) {
                        clearInterval(interval);
                        return res.status(404).json({ error: `Symbol "${symbol}" not found` });
                    }
                    console.log(currentPrice);
                        // Apply slippage to the current price
                    const slippageAmount = currentPrice * (slippage / 100);
                    executionPrice = currentPrice + slippageAmount;
                    console.log(slippageAmount, "----")
                    if (executionPrice >= takeProfit) {
                        benefit = (currentPrice - orderPrice) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    } else if (executionPrice <= stopLoss) {
                        benefit = (orderPrice - currentPrice) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    }
                }
                else if (orderType == "sell") {
                    if (!currentPrice) {
                        clearInterval(interval);
                        return res.status(404).json({ error: `Symbol "${symbol}" not found` });
                    }
                    console.log(currentPrice);
                        // Apply slippage to the current price
                    const slippageAmount = currentPrice * (slippage / 100);
                    executionPrice = currentPrice + slippageAmount;
                    console.log(slippageAmount, "----")
                    if (executionPrice >= takeProfit) {
                        benefit = (orderPrice-currentPrice) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    } else if (executionPrice <= stopLoss) {
                        benefit = (currentPrice-orderPrice) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    }
                }
                else if (orderType == "buy limit") {
                    if (!currentPrice) {
                        clearInterval(interval);
                        return res.status(404).json({ error: `Symbol "${symbol}" not found` });
                    }
                    console.log(currentPrice);
                        // Apply slippage to the current price
                    const slippageAmount = currentPrice * (slippage / 100);
                    executionPrice = currentPrice + slippageAmount;
                    console.log(slippageAmount, "----")
                    if (executionPrice <= price) {
                        benefit = (orderPrice - price) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    }
                }
                else if (orderType == "sell limit") {
                    if (!currentPrice) {
                        clearInterval(interval);
                        return res.status(404).json({ error: `Symbol "${symbol}" not found` });
                    }
                    console.log(currentPrice);
                        // Apply slippage to the current price
                    const slippageAmount = currentPrice * (slippage / 100);
                    executionPrice = currentPrice + slippageAmount;
                    console.log(slippageAmount, "----")
                    if (executionPrice >= price) {
                        benefit = (price - orderPrice) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    }
                }
                else if (orderType == "buy stop") {
                    if (!currentPrice) {
                        clearInterval(interval);
                        return res.status(404).json({ error: `Symbol "${symbol}" not found` });
                    }
                    console.log(currentPrice);
                        // Apply slippage to the current price
                    const slippageAmount = currentPrice * (slippage / 100);
                    executionPrice = currentPrice + slippageAmount;
                    console.log(slippageAmount, "----")
                    if (executionPrice >= price) {
                        benefit = (orderPrice - price) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    }
                }
                else if (orderType == "sell stop") {
                    if (!currentPrice) {
                        clearInterval(interval);
                        return res.status(404).json({ error: `Symbol "${symbol}" not found` });
                    }
                    console.log(currentPrice);
                        // Apply slippage to the current price
                    const slippageAmount = currentPrice * (slippage / 100);
                    executionPrice = currentPrice + slippageAmount;
                    console.log(slippageAmount, "----")
                    if (executionPrice <= price) {
                        benefit = (price - orderPrice) * volume * 100000;
                        tradeExecuted = true;
                        clearInterval(interval);
                    }
                }
                console.log("orderType: ", orderType, "\nbenefit: ", benefit)
            
                if (tradeExecuted) {
                    await transaction.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {profit: benefit, closed: true}});
                    await Strategy.updateOne({accountId: accountId, subscriberId: subscriberId, symbol: symbol}, {$set: {profit: strategy.profit+benefit, dailyProfit: strategy.dailyProfit + benefit}});
                    // Simulate the trade execution
                    console.log(`Executed a buy order for ${symbol} at ${currentPrice} with a volume of ${volume}. Benefit: ${benefit}`);
                    res.json({ currentPrice, orderPrice, benefit });
                }
            }, 100); // Check the market price every 100 milliseconds
        }
        else {
            return res.status(404).json({message: "Subscriber is already Closed"})
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal Server Error!"})
    }
}

