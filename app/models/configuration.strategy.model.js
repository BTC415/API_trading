module.exports = mongoose => {
    var schema = mongoose.Schema({
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        description: {type: String, default: ''},
        skipPendingOrders: { type: Boolean, default: false },
        accountId: {type: String, default: ''},
        commissionScheme: {
            type: String,
            billingPeriod: { type: String, default: 'week' },
            commissionRate: { type: Number, default: 0 }
        },
        platformCommissionRate: {type: Number, default: undefined},
        maxTradeRisk: {type: Number, default: undefined},
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
        riskLimits: [],
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
        allowedSides: [],
        minTradeVolume: Number,
        maxTradeVolume: Number,
        signalDelay: {
            mininSeconds: Number,
            maxinSeconds: Number
        },
        magicFilter: {
            included: [],
            excluded: []
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
        symbolsTrade: [],
        timeSettings: {
            maxRelativeDrawdown: Number,
            maxAbsoluteDrawdown: Number,
            expirePendingOrderSignals: Boolean
        },
        closeOnRemovalMode: String
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Strategy = mongoose.model("Strategy", schema); // Changed model name to "Strategy"
    return Strategy;
};