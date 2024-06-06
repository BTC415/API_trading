const jwtEncode = require('jwt-encode')
const db = require("../models");
// const Strategy = db.strategies
// const PortfolioStrategy = db.portfolioStrategies
// const Subscriber = db.subscribers
// const ChatUser = db.chatusers
// const Chat = db.chats
const Transaction = db.transactionfields;
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
exports.saveTransactions = async (req, res) => {
    try {
        // const randomString = generateRandomString(4);
        const randomString = "2235076744:close"
        const isTransaction = await Transaction.findOne({ id:randomString });
        console.log('isTransaction------->', isTransaction);
        if (!(isTransaction)) {
            const actionTime = new Date("2022-07-22T13:48:22")
            const subscriberId = '105646d8-8c97-4d4d-9b74-413bd66cd4ed';
            const subscriberUser = [
                {
                    id: "5013f1322ae00d69167803d959e9f7dc",
                    name: "Bruce Wayne",
                    strategies: [
                        {
                            id: "KiTn",
                            name: "Test Strategy"
                        },
                        {
                            id: "dWBM",
                            name: "Test Strategy"
                        },
                    ]
                }
            ];
            const demo = true;
            const providerUser = {
                id: "5013f1322ae00d69167803d959e9f7dc",
                name: "Clark Kent",
            };
            const strategy = {
                id: "dWBM",
                name: "Test Strategy",
            };
            const positionId = "+apNW3";
            const slavePositionId = "+apMW3";
            const improvement = 0;
            const providerCommission = 0.01;
            const platformCommission = 0.05;
            const incomingProviderCommission = 0;
            const incomingPlatformCommission = 0;
            const quantity = 0;
            const lotPrice = 121569.99999999999;
            const tickPrice = 1.2157;
            const amount = 241924.2999999999996;
            const commission = -3.98;
            const swap = 0.06;
            const profit = -55.72;
            const metrics = {
                tradeCopyingLatency: 261,
                tradeCopyingSlippageInBasisPoints: -0.24676531795690237,
                mtAndBrokerSignalLatency: 72,
                tradeAlgorithmLantency: 35,
                mtAndBrokertradeLatency: 176,
            }
            const newTransaction = new Transaction({ 
                id:randomString, 
                time: actionTime,
                subscriberId: subscriberId,
                subscriberUser: subscriberUser,
                demo: demo,
                providerUser: providerUser,
                strategy: strategy,
                positionId: positionId,
                slavePositionId: slavePositionId,
                improvement: improvement,
                providerCommission: providerCommission,
                platformCommission: platformCommission,
                incomingPlatformCommission: incomingPlatformCommission,
                incomingProviderCommission: incomingProviderCommission,
                quantity: quantity,
                lotPrice: lotPrice,
                tickPrice: tickPrice,
                amount: amount,
                commission: commission,
                swap: swap,
                profit: profit,
                metrics: metrics,
            });
            console.log('newTransaction------->', newTransaction);
            await newTransaction.save();
            console.log('saved')
            return res.status(200).json({id: randomString});
        }
        else {
            console.log('ddd')
            return res.status(404).json({message: "Error! Faild to generate Strategy id."});
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'An Error Occurred'})
    }
}
//Get Providede Transactions
exports.providedTransaction = async (req, res) => {
    try {
        const {from, till, strategyId, subscriberId, offset, limit} = req.query;
        let fromDate = new Date('0000-01-01T00:00:00');
        if (from) {
            fromDate = new Date(from);
        }
        let tillDate = new Date('9999-12-31T23:59:59');
        if (till) {
            tillDate = new Date(till);
        }
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
        const skipValue = offset1 * limit_number;
        console.log('request------------>', from, till, strategyId, subscriberId, offset1, limit_number, skipValue)
        // console.log(fromDate, tillDate)const searchResult = {};
        if (fromDate && tillDate) {

            if (strategyId && strategyId.length > 0 && subscriberId && subscriberId.length > 0) {
                console.log('perfect', subscriberId);
                
                const subscriberIdArray = Array.isArray(subscriberId) ? subscriberId : [subscriberId];
                const strategyIdArray = Array.isArray(strategyId) ? strategyId : [strategyId];
                console.log(typeof(strategyIdArray), strategyIdArray)
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate
                    },
                    'strategy.id': { $in: strategyIdArray },
                    subscriberId: { $in: subscriberIdArray }
                }).skip(skipValue).limit(limit_number);
                console.log(searchResult)
            } else if (strategyId && strategyId.length > 0) {
                console.log('wonderful');
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate,
                    },
                    'strategy.id': { $in: strategyId },
                }).skip(skipValue).limit(limit_number);
            } else if (subscriberId && subscriberId.length > 0) {
                console.log('dirty');
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate,
                    },
                    subscriberId: { $in: subscriberId },
                }).skip(skipValue).limit(limit_number);
            } else {
                console.log('break');
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate,
                    },
                }).skip(skipValue).limit(limit_number);
            }

            return res.status(200).json(searchResult);
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

//Get Subscription Transactions
exports.subscriptionTransaction = async (req, res) => {
    try {
        const {from, till, strategyId, subscriberId, offset, limit} = req.query;
        let fromDate = new Date('0000-01-01T00:00:00');
        if (from) {
            fromDate = new Date(from);
        }
        let tillDate = new Date('9999-12-31T23:59:59');
        if (till) {
            tillDate = new Date(till);
        }
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
        const skipValue = offset1 * limit_number;
        console.log('request------------>', from, till, strategyId, subscriberId, offset1, limit_number, skipValue)
        // console.log(fromDate, tillDate)const searchResult = {};
        if (fromDate && tillDate) {

            if (strategyId && strategyId.length > 0 && subscriberId && subscriberId.length > 0) {
                console.log('perfect', subscriberId);
                
                const subscriberIdArray = Array.isArray(subscriberId) ? subscriberId : [subscriberId];
                const strategyIdArray = Array.isArray(strategyId) ? strategyId : [strategyId];
                console.log(typeof(strategyIdArray), strategyIdArray)
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate
                    },
                    'strategy.id': { $in: strategyIdArray },
                    subscriberId: { $in: subscriberIdArray }
                }).skip(skipValue).limit(limit_number);
                console.log(searchResult)
            } else if (strategyId && strategyId.length > 0) {
                console.log('wonderful');
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate,
                    },
                    'strategy.id': { $in: strategyId },
                }).skip(skipValue).limit(limit_number);
            } else if (subscriberId && subscriberId.length > 0) {
                console.log('dirty');
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate,
                    },
                    subscriberId: { $in: subscriberId },
                }).skip(skipValue).limit(limit_number);
            } else {
                console.log('break');
                searchResult = await Transaction.find({
                    time: {
                        $gte: fromDate,
                        $lt: tillDate,
                    },
                }).skip(skipValue).limit(limit_number);
            }

            return res.status(200).json(searchResult);
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}

//Get Strategy Transaction Streams
exports.strategyTransactionStream = async (req, res) => {
    try {
        const {startTime, limit} = req.query;
        const strategyId = req.params.strategyId;
        let fromDate = new Date('0000-01-01T00:00:00');
        if (startTime) {
            fromDate = new Date(startTime);
        }
        let limit_number = 1000;
        if (limit) {
            console.log('limit_number')
            limit_number = limit;
        } else {
            limit_number = 1000;
        }
        console.log(fromDate)
        if (fromDate) {
            searchResult = await Transaction.find({
                time: {
                    $gte: fromDate,
                },
                'strategy.id': strategyId,
            });
            const isStrategyId = await Transaction.findOne({
                'strategy.id': strategyId
            })
            if ( isStrategyId ) {
                return res.status(200).json(searchResult);
            }
            else {
                return res.status(404).json({message: "StrategyId not found"})
            }
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}


//Get Subscriber Transaction Streams
exports.subscriberTransactionstream = async (req, res) => {
    try {
        const {startTime, limit} = req.query;
        const subscriberId = req.params.subscriberId;
        let fromDate = new Date('0000-01-01T00:00:00');
        if (startTime) {
            fromDate = new Date(startTime);
        }
        let limit_number = 1000;
        if (limit) {
            console.log('limit_number', subscriberId)
            limit_number = limit;
        } else {
            limit_number = 1000;
        }
        console.log(fromDate)
        if (fromDate) {
            searchResult = await Transaction.find({
                time: {
                    $gte: fromDate,
                },
                subscriberId: subscriberId,
            });
            const isSubscriberId = await Transaction.findOne({
                subscriberId: subscriberId
            })
            if ( isSubscriberId ) {
                return res.status(200).json(searchResult);
            }
            else {
                return res.status(404).json({message: "SubscriberId not found"})
            }
        }
    } catch (e) {
        res.status(500).json({message: 'An Error Occurred', error: e})
    }
}