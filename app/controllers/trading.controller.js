const jwtEncode = require('jwt-encode')
const db = require("../models");
const TradingSignal = db.tradingSignals;
const ExternalTradingSignal = db.externalSignals;
const Strategy = db.strategies;
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
        const {time, symbol, type, side, openPrice, positionId, stopLoss, takeProfit, signalVolume, server, timeFrame, leverage, lotSize} = req.body;
        const followers = await Strategy.find({accountId: accountId, server: server})
        console.log(followers)
        followers.forEach(async item => {
            const tradingSignal = new TradingSignal({accountId: accountId});
            const isTradigSignal = true;
            tradingSignal.subscriberId = item.slaveaccountId;
            console.log('subscriberId', item)
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
            // if (item.symbolMapping.from === symbol) tradingSignal.symbol = item.symbolMapping.to;
            // else tradingSignal.symbol = symbol;
            tradingSignal.time = Date(time);
            tradingSignal.type = type;
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
                if ((openPrice + item.maxStopLoss)>stopLoss) tradingSignal.stopLoss = openPrice + item.maxStopLoss;
                else tradingSignal.stopLoss = stopLoss
            }
            else tradingSignal.stopLoss = openPrice + item.maxStopLoss;
            if (item.copyTakeProfit) {
                if ((openPrice + item.maxTakeProfit)<takeProfit) tradingSignal.takeProfit = openPrice + item.maxTakeProfit;
                else tradingSignal.takeProfit = takeProfit
            }
            else tradingSignal.takeProfit = openPrice + item.maxTakeProfit;
            // if (!item.skipPendingOrders) tradingSignal.pendingOrder = pendingOrder;
            if (leverage>item.maxLeverage) tradingSignal.leverage = item.maxLeverage;
            else tradingSignal.leverage = leverage;
            // if (item.minTradeVolume>signalVolume) tradingSignal.signalVolume = item.minTradeVolume;
            // else if (item.maxTradeVolume<signalVolume) tradingSignal.signalVolume = item.maxTradeVolume;
            // else tradingSignal.signalVolume = item.maxTradeVolume;
            tradingSignal.signalVolume =signalVolume;
            tradingSignal.lotSize = lotSize;
            let lotUnit = 100000;
            if (lotSize === "mini") lotUnit = 10000;
            if (lotSize === "micro") lotUnit = 1000;
            if (lotSize === "nano") lotUnit = 100;
            else lotUnit = 100000;
            console.log("lotUnit", lotUnit, item.balance, item.maxTradeRisk)
            //calculatae subscriber volume
            let subVolume = (item.balance * item.maxTradeRisk)/(signalVolume*leverage*lotUnit);
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