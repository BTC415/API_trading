const jwtEncode = require('jwt-encode')
const db = require("../models");
const Strategy = db.strategies
const PortfolioStrategy = db.portfolioStrategies
const Subscriber = db.subscribers
const secret = 'secret';
const crypto = require('crypto');

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

function deleteItemInObjects(array, itemToDelete) {
    return array.map(obj => {
        // Create a new object to avoid modifying the original object
        let newObj = {};
        for (let key in obj._doc) {
            if(key !== itemToDelete)
                newObj[key] = obj[key];
        }
        return newObj;
    });
}


//Generate New Strategy
exports.generateStrategyId = async (req, res) => {
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
// Get New Strategies
exports.getStrategies = async (req, res) => {
    try {
        // console.log('dddd')
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
        let includeRemoved1 = "false";
        if (includeRemoved) {
            includeRemoved1 = includeRemoved;
        } else {
            includeRemoved1 = "false";
        }
        const skipValue = offset1 * limit_number;
        console.log(skipValue, "this is skipvalue-------", includeRemoved1)
        if (includeRemoved1 !== "false") {
            console.log("true");
            const strategies = await Strategy.find({}).skip(skipValue).limit(limit_number);
            const updateStrategies = deleteItemInObjects(strategies, "removedState");
            res.status(200).json(updateStrategies);
        }
        else {
            console.log("false");
            const strategies = await Strategy.find({removedState: false}).skip(skipValue).limit(limit_number);
            const updateStrategies = deleteItemInObjects(strategies, "removedState");
            res.status(200).json(updateStrategies);
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getStrategy = async (req, res) => {
    try {
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await Strategy.findOne({_id: strategyId, removedState: false});
        if (strategies) {
            console.log('strategies', strategies)
            return res.status(200).json(strategies);
        }
        else {
            return res.status(404).json({message: "Strategy not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.updateStrategy = async (req, res) => {
    try {
        console.log("update Strategy")
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        // console.log("request----------->", request)
        const item = await Strategy.findOne({_id: strategyId, removedState: false})
        // request.riskLimits = Array.isArray(request.riskLimits) ? request.riskLimits : [request.riskLimits]
        if(item) {
            console.log("found", item)
            Strategy.findByIdAndUpdate(strategyId, request, { new: false }, (err, updatedDocument) => {
                if (err) {
                    // Handle the error, e.g., return an error response
                    res.status(500).json({ error: e  });
                    console.log(err)
                } else {
                    console.log("updated", updatedDocument)
                    // Document updated successfully, return the updated document as the response
                    res.status(200).json({message: 'Strategy saved Successfully'});
                }
            });
        }
        else {
            console.log("strategynot font");
            res.status(404).json({message: "Strategy not founded!"})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deleteStrategy = async (req, res) => {
    try {
        // const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await Strategy.findOne({_id: strategyId});
        if (strategies) {
            console.log('strategies', strategies)
            const strategy = await Strategy.findByIdAndUpdate(strategyId, {removedState: true});
            return res.status(200).json({message: 'Strategy deleted Successfully'});
        }
        else {
            return res.status(404).json({message: "Strategy not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getPortfolioStrategies = async (req, res) => {
    try {
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
        let includeRemoved1 = "false";
        if (includeRemoved) {
            includeRemoved1 = includeRemoved;
        } else {
            includeRemoved1 = "false";
        }
        const skipValue = offset1 * limit_number;
        console.log(skipValue, "this is skipvalue-------")
        if (includeRemoved1 !== "false") {
            console.log("true");
            const strategies = await PortfolioStrategy.find({}).skip(skipValue).limit(limit_number);
            const updateStrategies = deleteItemInObjects(strategies, "removedState");
            res.status(200).json(updateStrategies);
        }
        else {
            console.log("false");
            const strategies = await PortfolioStrategy.find({removedState: false}).skip(skipValue).limit(limit_number);
            const updateStrategies = deleteItemInObjects(strategies, "removedState");
            res.status(200).json(updateStrategies);
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getPortfolioStrategy = async (req, res) => {
    try {
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.findOne({_id: strategyId});
        if (strategies) {
            console.log('strategies', strategies)
            return res.status(200).json(strategies);
        }
        else {
            return res.status(404).json({message: "PortfolioStrategy not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.updatePortfolioStrategy = async (req, res) => {
    try {
        const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const item = await PortfolioStrategy.findOne({_id: strategyId, removedState: false})
        if(item) {
            console.log("found", item)
            PortfolioStrategy.findByIdAndUpdate(strategyId, request, { new: false }, (err, updatedDocument) => {
                if (err) {
                    // Handle the error, e.g., return an error response
                    res.status(500).json({ error: err  });
                    console.log(err)
                } else {
                    console.log("updated", updatedDocument)
                    // Document updated successfully, return the updated document as the response
                    res.status(200).json({message: 'PortfolioStrategy saved Successfully'});
                }
            });
        }
        else {
            console.log("Portfolio strategy not found");
            res.status(404).json({message: "PortfolioStrategy not founded!"})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deletePortfolioStrategy = async (req, res) => {
    try {
        // const request = req.body;
        const strategyId = req.params.strategyId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.findOne({_id: strategyId});
        if (strategies) {
            console.log('strategies', strategies)
            const strategy = await PortfolioStrategy.findByIdAndUpdate(strategyId, {removedState: true});
            return res.status(200).json({message: 'Portfolio Strategy deleted Successfully'});
        }
        else {
            return res.status(404).json({message: "Portfolio Strategy not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deletePortfolioMemberStrategy = async (req, res) => {
    try {
        // const request = req.body;
        const strategyId = req.params.strategyId
        const strategyMemberId = req.params.strategyMemberId
        console.log("Id------------>", strategyId)
        const strategies = await PortfolioStrategy.findOne({_id: strategyId, "members.strategyId": strategyMemberId, removedState: false});
        if (strategies) {
            console.log('strategies', strategies)
            const strategy = await PortfolioStrategy.findOneAndUpdate({_id: strategyId, "members.strategyId": strategyMemberId, removedState: false}, { $set: { 'members.$.removedState': true } });
            return res.status(200).json({message: 'Portfolio Member Strategy deleted Successfully'});
        }
        else {
            return res.status(404).json({message: "Portfolio Member Strategy not founded."})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getSubscribers = async (req, res) => {
    try {
        // console.log('dddd')
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
        let includeRemoved1 = "false";
        if (includeRemoved) {
            includeRemoved1 = includeRemoved;
        } else {
            includeRemoved1 = "false";
        }
        const skipValue = offset1 * limit_number;
        console.log(skipValue, "this is skipvalue-------")
        if (includeRemoved1 !== "false") {
            console.log("true");
            const strategies = await Subscriber.find({}).skip(skipValue).limit(limit_number);
            const updateStrategies = deleteItemInObjects(strategies, "removedState");
            res.status(200).json(updateStrategies);
        }
        else {
            console.log("false");
            const strategies = await Subscriber.find({removedState: false}).skip(skipValue).limit(limit_number);
            const updateStrategies = deleteItemInObjects(strategies, "removedState");
            res.status(200).json(updateStrategies);
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.getSubscriber = async (req, res) => {
    try {
        const subscriberId = req.params.subscriberId
        console.log("Id------------>", subscriberId)
        const strategies = await Subscriber.findOne({_id: subscriberId, removedState: false});
        if (strategies) {
            console.log('strategies', strategies)
            return res.status(200).json(strategies);
        }
        else {
            return res.status(404).json({message: "Subscriber not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

exports.updateSubscriber = async (req, res) => {
    try {
        const request = req.body;
        const subscriberId = req.params.subscriberId
        console.log("Id------------>", subscriberId)
        const item = await Subscriber.findOne({_id: subscriberId, removedState: false})
        if(item) {
            console.log("found", item)
            Subscriber.findByIdAndUpdate(subscriberId, request, { new: false }, (err, updatedDocument) => {
                if (err) {
                    // Handle the error, e.g., return an error response
                    res.status(500).json({ error: err  });
                    console.log(err)
                } else {
                    console.log("updated", updatedDocument)
                    // Document updated successfully, return the updated document as the response
                    res.status(200).json({message: 'Subscriber saved Successfully'});
                }
            });
        }
        else {
            console.log("Subscriber strategy not found");
            res.status(404).json({message: "Subscriber not founded!"})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deleteSubscriber = async (req, res) => {
    try {
        const request = req.body;
        const subscriberId = req.params.subscriberId
        console.log("Id------------>", subscriberId)
        const strategies = await Subscriber.findOne({_id: subscriberId});
        if (strategies) {
            console.log('strategies', strategies)
            const strategy = await Subscriber.findByIdAndUpdate(subscriberId, {removedState: true});
            return res.status(200).json({message: 'Subscriber deleted Successfully'});
        }
        else {
            return res.status(404).json({message: "Subscriber not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


exports.deleteSubscription = async (req, res) => {
    try {
        const request = req.body;
        const subscriberId = req.params.subscriberId;
        const strategyId = req.params.strategyId;
        console.log("Id------------>", strategyId)
        const strategies = await Subscriber.findOne({_id: subscriberId, "subscriptions.strategyId": strategyId, removedState: false});
        if (strategies) {
            console.log('strategies', strategies)
            const strategy = await Subscriber.findOneAndUpdate({_id: subscriberId, "subscriptions.strategyId": strategyId, removedState: false}, { $set: { 'subscriptions.$.removedState': true } });
            return res.status(200).json({message: 'Subscription deleted Successfully'});
        }
        else {
            return res.status(404).json({message: "Subscription not founded."})
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}