module.exports = mongoose => {
    var schema = mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        description: {type: String, default: ''},
        skipPendingOrders: { type: Boolean, default: false },
        accountId: {type: String, default: ''},
        slaveaccountId: {type: String, default: ''},
        commissionScheme: {
            type: {type:String, default: ''},
            billingPeriod: { type: String, default: 'week' },
            commissionRate: { type: Number, default: 0 }
        },
        platformCommissionRate: {type: Number, default: undefined},
        maxTradeRisk: {type: Number, default: 0},
        reverse: { type: Boolean, default: false },
        reduceCorrelations: {type: String, default: undefined},
        symbolFilter: {
            included: [],
            excluded: []
        },
        newsFilter: {
            breakingNewsFilter: {
                priorities: [],
                closePositionTimeGapInMinutes: Number,
                openPositionFollowingTimeGapInMinutes: Number
            },
            calendarNewsFilter: {
                priorities: [],
                closePositionTimeGapInMinutes: Number,
                openPositionPrecedingTimeGapInMinutes: Number,
                openPositionFollowingTimeGapInMinutes: Number
            }
        },
        riskLimits: {
            type: {type: String, default: 'day'},
            applyTo: {type: String, default: 'balance-difference'},
            maxAbsoluteRisk: Number,
            maxRelativeRisk: Number,
            closePositions: {type: Boolean, default: false},
        },
        maxStopLoss: {
            value: Number,
            units: String
        },
        maxLeverage: {type: Number, default: 100},
        symbolMapping: [{
            to: String,
            from: String
        }],
        tradeSizeScaling: {
            mode: String,
            tradeVolumne: Number,
            riskFraction: Number,
            forceTinyTrades: Boolean,
            maxRiskCoefficient: Number,
            expression: String
        },
        copyStopLoss: {type: Boolean, default: true},
        copyTakeProfit: {type: Boolean, default: true},
        allowedSides: {type: [String], default: ["all"]},
        minTradeVolume: {type: Number, default: 0},
        maxTradeVolume: {type: Number, default: 1000},
        signalDelay: {
            mininSeconds: Number,
            maxinSeconds: Number
        },
        magicFilter: {
            included: [String],
            excluded: [String]
        },
        equityCurveFilter: {
            period: Number,
            timeframe: String
        },
        drawdownFilter: {
            maxRelativeDrawdown: Number,
            maxAbsoluteDrawdown: Number,
            action: String
        },
        symbolsTrade: [String],
        timeSettings: {
            maxRelativeDrawdown: Number,
            maxAbsoluteDrawdown: Number,
            expirePendingOrderSignals: Boolean
        },
        closeOnRemovalMode: String,
        removedState: {type: Boolean, default: false},
        server: {type: String, default: "MT4"},
        demo: {type: Boolean, default: false},
        symbol: {type: String, default: 'EURUSD'},
        currency: {type: String, default: 'USD'},
        leverage: {type: Number, default: 1},
        tradeVolume: {type: Number, default: 0},
        stopLoss: {type: Number, default: 0},
        takeProfit: {type: Number, default: 0},
        balance: {type: Number, default: 0},
        pendingOrder: {
            buyLimit: Number,
            buyStop: Number,
            sellLimit: Number,
            sellStop: Number
        },
        drawDown: {type: Number, default: undefined},
        timeFrame: {type: String, default: "1m"},
    });

    const Strategy = mongoose.model("Strategy", schema); // Changed model name to "Strategy"
    return Strategy;
};