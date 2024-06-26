module.exports = mongoose => {
    var schema = mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true
        },
        name: {type: String, default: ""},        
        minTradeVolume: {type: Number, default: 0},
        maxTradeVolume: {type: Number, default: 1},
        copyStopLoss: {type: Boolean, default: true},
        copyTakeProfit: {type: Boolean, default: true},
        allowedSides: {type: [String], default: ["buy", "selll", "buyLimit", "sellLimit", "buyStop", "sellStop"]},
        slaveaccountId: {type: String, required: true},
        signalDelay: {
            mininSeconds: {type: Number, default: 0},
            maxinSeconds: {type: Number, default: 0}
        },
        maxLeverage: {type: Number, default: 1000},
        // subscirpition: [{
        strategyId: {type: String, required: 'true'},
        skipPendingOrders: { type: Boolean, default: false },
        maxTradeRisk: {type: Number, default: 0},
        reverse: { type: Boolean, default: false },
        symbolFilter: {
            included: [],
            excluded: []
        },
        riskLimits: {
            type: {type: String, default: 'day'},
            applyTo: {type: String, default: 'balance-difference'},
            maxAbsoluteRisk: {type: Number, default: 0},
            maxAbsoluteProfit: {type: Number, default: 0},
            dailyRisk: {type: Number, default: 0},
            dailyProfit: {type: Number, default: 0},
            closePositions: {type: Boolean, default: false},
        },
        maxStopLoss: {type: Number, default: 0},
        removedState: {type: Boolean, default: false},
        server: {type: String, default: "MT4"},
        demo: {type: Boolean, default: false},
        symbol: {type: String, default: 'EURUSD'},
        currency: {type: String, default: 'USD'},
        leverage: {type: Number, default: 1},
        tradeVolume: {type: Number, default: 0.01},
        stopLoss: {type: String, default: "0"},
        takeProfit: {type: String, default: "0"},
        balance: {type: Number, required: true},
        profit: {type: Number, default: 0},
        dailyProfit: {type: Number, default: 0},
        pendingOrder: {
            buyLimit: Number,
            buyStop: Number,
            sellLimit: Number,
            sellStop: Number
        },
        drawDown: {type: Number, default: undefined},
        timeFrame: {type: String, default: "1m"},
        closeVolume: {type:Number, default: 0},
        // isPendingOrder: {type: Boolean, default: false},
        closeAll: {type: String, default: 'Nothing'},
        specificPrice: {
            breakEven: {type: Boolean, default: false},
            moveStopLoss: {type: Number, default: 0},
            moveTakeProfit: {type: Number, default: 0},
            entryPoint: {type:Number, default: 0}
        },
        isStopLoss: {type: Boolean, default:true},
        trailing: {type:Boolean, default: false}
            // accountId: {type: String, default: ''},
        // }],    
    });

    const Strategy = mongoose.model("Strategy", schema); // Changed model name to "Strategy"
    return Strategy;
};


    
        // description: {type: String, default: ''},
        // commissionScheme: {
        //     type: {type:String, default: ''},
        //     billingPeriod: { type: String, default: 'week' },
        //     commissionRate: { type: Number, default: 0 }
        // },
        // platformCommissionRate: {type: Number, default: undefined},
        // reduceCorrelations: {type: String, default: undefined},
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
        // symbolMapping: [{
        //     to: String,
        //     from: String
        // }],
        // tradeSizeScaling: {
        //     mode: String,
        //     tradeVolumne: Number,
        //     riskFraction: Number,
        //     forceTinyTrades: Boolean,
        //     maxRiskCoefficient: Number,
        //     expression: String
        // },
        // magicFilter: {
        //     included: [String],
        //     excluded: [String]
        // },
        // equityCurveFilter: {
        //     period: Number,
        //     timeframe: String
        // },
        // drawdownFilter: {
        //     maxRelativeDrawdown: Number,
        //     maxAbsoluteDrawdown: Number,
        //     action: String
        // },
        // symbolsTrade: [String],
        // timeSettings: {
        //     maxRelativeDrawdown: Number,
        //     maxAbsoluteDrawdown: Number,
        //     expirePendingOrderSignals: Boolean
        // },
        // closeOnRemovalMode: String,