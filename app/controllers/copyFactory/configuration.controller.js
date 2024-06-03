const jwtEncode = require('jwt-encode')
const db = require("../models");
const Strategy = db.strategies
const PortfolioStrategy = db.portfolioStrategy
const secret = 'secret';
const crypto = require('crypto');

// set the primary values

//strategy set
const strategy_id = 0;
const strategy_name = '';
const description  = '';



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

exports.generateStrategyId = async (req, res) => {
    try {
        const randomString = generateRandomString(4);
        return res.status(200).json({id: randomString});
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred'})
    }
}