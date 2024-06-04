module.exports = mongoose => {
    var schema = mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        description: {type: String, default: ''},
        members: [{
            strategyId: {
                type: String,
                // required: true,
                // unique: true
            },
            multiplier: Number,
            skipPendingOrders: { type: Boolean, default: false },
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
            closeOnRemovalMode: String,
        }],
        commissionScheme: {
            type: String,
            billingPeriod: { type: String, default: 'week' },
            commissionRate: { type: Number, default: 0 }
        },
        skipPendingOrders: { type: Boolean, default: false },
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
        platformCommissionRate: {type: Number, default: undefined},
        closeOnRemovalMode: String
    });

    const PortfolioStrategy = mongoose.model("PortfolioStrategy", schema); // Changed model name to "PortfolioStrategy"
    return PortfolioStrategy;
};