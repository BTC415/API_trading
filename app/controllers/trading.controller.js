const jwtEncode = require('jwt-encode')
const db = require("../models");
const TradingSignal = db.tradingSignals;
const ExternalTradingSignal = db.externalSignals;
const Strategy = db.strategies;
const secret = 'secret';
const crypto = require('crypto');
const { type } = require('os');


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
        const {time, symbol, type, side, openPrice, positionId, stopLoss, takeProfit, signalVolume, server} = req.body;
        const followers = await Strategy.find({accountId: accountId, server: server})
        console.log(followers)
        followers.map((item, index) => {
            const tradingSignal = new TradingSignal({accountId: accountId});
            tradingSignal.subscriberId = item.subscriberId;
            tradingSignal.positionId = positionId;
            if (item.symbolMapping.from === symbol) tradingSignal.symbol = item.symbolMapping.to;
            else tradingSignal.symbol = symbol;
            tradingSignal.time = Date(time);
            if (item.reverse === true) {
                if (side === "buy") tradingSignal.side = 'sell';
                else tradingSignal.side = 'buy';
            }
            else {
                if (side === "buy") tradingSignal.side = 'sell';
                else tradingSignal.side = 'buy';
            }
            tradingSignal.type = type;
            tradingSignal.openPrice = openPrice;
            if ((openPrice + item.stopLoss)>stopLoss) tradingSignal.stopLoss = openPrice + item.stopLoss;
            else tradingSignal.stopLoss = stopLoss
            
        })
        return res.status(200).json({message: "Okay"})
    } catch(e) {
        console.log(e);
        res.status(500).json({message: "Internal Sever Error!"})
    }
}