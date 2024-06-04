const jwtEncode = require('jwt-encode')
const db = require("../models");
const Strategy = db.strategies
const PortfolioStrategy = db.portfolioStrategies
// const ChatUser = db.chatusers
// const Chat = db.chats
const secret = 'secret';
const crypto = require('crypto');

// set the primary values

//strategy set
// const strategy_id = 0;
// const strategy_name = '';
// const description  = '';



function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}
//Generate New Strategy
exports.generateStrategyId = async (req, res) => {
    try {
        console.log('unused strategy')
        const randomString = generateRandomString(4);
        const newStrategy = new Strategy({ id:randomString, name: "Test Strategy" });
        console.log('newStrategy------->', newStrategy);
        await newStrategy.save();
        console.log('saved')
        return res.status(200).json({id: randomString});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred'})
    }
}
// Get New Strategies
exports.getStrategies = async (req, res) => {
    try {
        console.log('dddd')
        const {limit, offset, includeRemoved} = req.query;
        console.log(limit, offset, includeRemoved)
        let offset1 = 0;
        if (offset) {
            offset1 = offset;
        } else {
            offset1 = 0;
        }
        let limit_number = 1000;
        if (limit) {
            console.log('limit_number')
            limit_number = limit;
        } else {
            limit_number = 1000;
        }
        let includeRemoved1 = false;
        if (includeRemoved) {
            includeRemoved1 = includeRemoved;
        } else {
            includeRemoved1 = false;
        }
        const skipValue = offset1 * limit_number;
        console.log(skipValue, "this is skipvalue-------")
        const strategies = await Strategy.find({}).skip(skipValue).limit(limit_number);
        console.log('strategies', strategies)
        return res.status(200).json(strategies);
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getStrategy = async (req, res) => {
    try {
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await Strategy.findOne({id: strategyId});
        console.log('strategies', strategies)
        return res.status(200).json(strategies);
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.updateStrategy = async (req, res) => {
    try {
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await Strategy.findOne({id: strategyId});
        console.log('strategies', strategies)
        const updateStrategy = await Strategy.updateOne(request);
        return res.status(200).json({message: 'Strategy saved Successfully'});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deleteStrategy = async (req, res) => {
    try {
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await Strategy.deleteOne({id: strategyId});
        console.log('strategies', strategies)
        return res.status(200).json({message: 'Strategy deleted Successfully'});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getPortfolioStrategies = async (req, res) => {
    try {
        console.log('dddd')
        const {limit, offset, includeRemoved} = req.query;
        console.log(limit, offset, includeRemoved)
        let offset1 = 0;
        if (offset) {
            offset1 = offset;
        } else {
            offset1 = 0;
        }
        let limit_number = 1000;
        if (limit) {
            console.log('limit_number')
            limit_number = limit;
        } else {
            limit_number = 1000;
        }
        let includeRemoved1 = false;
        if (includeRemoved) {
            includeRemoved1 = includeRemoved;
        } else {
            includeRemoved1 = false;
        }
        const skipValue = offset1 * limit_number;
        console.log(skipValue, "this is skipvalue-------")
        const strategies = await PortfolioStrategy.find({}).skip(skipValue).limit(limit_number);
        console.log('strategies', strategies)
        return res.status(200).json(strategies);
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getPortfolioStrategy = async (req, res) => {
    try {
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.findOne({_id: strategyId});
        console.log('strategies', strategies)
        return res.status(200).json(strategies);
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.updatePortfolioStrategy = async (req, res) => {
    try {
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.findOne({_id: strategyId});
        console.log('strategies', strategies)
        const updateStrategy = await PortfolioStrategy.updateOne(request);
        return res.status(200).json({message: 'Strategy saved Successfully'});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deletePortfolioStrategy = async (req, res) => {
    try {
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.deleteOne({_id: strategyId});
        console.log('strategies', strategies)
        return res.status(200).json({message: 'Strategy deleted Successfully'});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deletePortfolioMemberStrategy = async (req, res) => {
    try {
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.deleteOne({_id: strategyId});
        console.log('strategies', strategies)
        return res.status(204).json({message: 'Strategy deleted Successfully'});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}