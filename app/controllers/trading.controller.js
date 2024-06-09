const jwtEncode = require('jwt-encode')
const db = require("../models");
const TradingSignal = db.tradingSignals;
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
        else res.status(404).json({message: "Subscriber id not founded."})
    } catch (e) {

    }
}