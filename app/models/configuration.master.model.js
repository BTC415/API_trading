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
        commissionScheme: {
            type: {type:String, default: ''},
            billingPeriod: { type: String, default: 'week' },
            commissionRate: { type: Number, default: 0 }
        },
        platformCommissionRate: {type: Number, default: undefined},
        maxTradeRisk: {type: Number, default: undefined},
        // reverse: { type: Boolean, default: false },
        // reduceCorrelations: {type: String, default: undefined},
        // symbolFilter: {
        //     included: [String],
        //     excluded: [String]
        // },
        // newsFilter: {
        //     breakingNewsFilter: {
        //         priorities: [],
        //         closePositionTimeGapInMinutes: Number,
        //         openPositionFollowingTimeGapInMinutes: Number
        //     },
        //     calendarNewsFilter: {
        //         priorities: [],
        //         closePositionTimeGapInMinutes: Number,
        //         openPositionPrecedingTimeGapInMinutes: Number,
        //         openPositionFollowingTimeGapInMinutes: Number
        //     }
        // },
        riskLimits: [{
            type: {type: String, default: 'day'},
            applyTo: {type: String, default: 'balance-difference'},
            maxAbsoluteRisk: Number,
            maxRelativeRisk: Number,
            closePositions: {type: Boolean, default: false},
            startTime: new Date(),
        }],
        maxStopLoss: {
            value: Number,
            units: String
        },
        maxLeverage: {type: Number, default: undefined},
        // symbolMapping: [{
        //     to: String,
        //     from: String
        // }],
        tradeSizeScaling: {
            mode: String,
            tradeVolumne: Number,
            riskFraction: Number,
            forceTinyTrades: Boolean,
            maxRiskCoefficient: Number,
            expression: String
        },
        StopLoss: Number,
        TakeProfit: Number,
        // allowedSides: {type: [String], default: ["all"]},
        minTradeVolume: Number,
        maxTradeVolume: Number,
        // signalDelay: {
        //     mininSeconds: Number,
        //     maxinSeconds: Number
        // },
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
        removedState: {type: Boolean, default: false}
    });

    const Master = mongoose.model("Master", schema); // Changed model name to "Master"
    return Master;
};