module.exports = mongoose => {
    var schema = mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        description: {type: String, default: ''},
        reservedMarginFraction: Number,
        phoneNumbers: [],
        minTradeAmount: {type: Number, default: 0},
        closeOnly: {type:String, default: 'immediately'},
        riskLimits: [{
            type: {type: String, default: 'day'},
            applyTo: {type: String, default: 'balance-difference'},
            maxAbsoluteRisk: Number,
            maxRelativeRisk: Number,
            closePositions: {type: Boolean, default: false},
            startTime: String,
        }],
        maxLeverage: {type: Number, default: undefined},
        copyStopLoss: {type: Boolean, default: true},
        copyTakeProfit: {type: Boolean, default: true},
        allowedSides: [],
        minTradeVolume: Number,
        maxTradeVolume: Number,
        signalDelay: {
            mininSeconds: Number,
            maxinSeconds: Number
        },
        subscriptions: [{
            strategyId: {
                type: String,
                // required: true,
                // unique: true
            },
            multiplier: {type: Number, default: 1},
            skipPendingOrders: { type: Boolean, default: false },
            maxTradeRisk: {type: Number, default: undefined},
            reverse: { type: Boolean, default: false },
            reduceCorrelations: {type: String, default: undefined},
            symbolFilter: {
                included: [String],
                excluded: [String]
            },
            newsFilter: {
                breakingNewsFilter: {
                    priorities: [String],
                    closePositionTimeGapInMinutes: Number,
                    openPositionFollowingTimeGapInMinutes: Number
                },
                calendarNewsFilter: {
                    priorities: [String],
                    closePositionTimeGapInMinutes: Number,
                    openPositionPrecedingTimeGapInMinutes: Number,
                    openPositionFollowingTimeGapInMinutes: Number
                }
            },
            riskLimits: [{
                type: {type: String, default: 'day'},
                applyTo: {type: String, default: 'balance-difference'},
                maxAbsoluteRisk: Number,
                maxRelativeRisk: Number,
                closePositions: {type: Boolean, default: false},
                startTime: String,
            }],
            maxStopLoss: {
                value: Number,
                units: String
            },
            maxLeverage: {type: Number, default: undefined},
            symbolMapping: {
                to: String,
                from: String
            },
            tradeSizeScaling: {
                mode: String,
                tradeVolumne: Number,
                riskFraction: Number,
                forceTinyTrades: Boolean,
                maxRiskCoefficient: Number,
                expression: String
            },
            copyStopLoss: Boolean,
            copyTakeProfit: Boolean,
            allowedSides: [String],
            minTradeVolume: Number,
            maxTradeVolume: Number,
            signalDelay: {
                mininSeconds: Number,
                maxinSeconds: Number
            },
        }],
    });

    const Subscriber = mongoose.model("Subscriber", schema); // Changed model name to "Subscriber"
    return Subscriber;
};