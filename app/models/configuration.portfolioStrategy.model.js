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
            closeOnRemovalMode: String,
            removedState: {type: Boolean, default: false}
        }],
        commissionScheme: {
            type: {type:String, default: ""},
            billingPeriod: { type: String, default: 'week' },
            commissionRate: { type: Number, default: 0 }
        },
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
        platformCommissionRate: {type: Number, default: undefined},
        closeOnRemovalMode: String,
        removedState: {type: Boolean, default: false}
    });

    const PortfolioStrategy = mongoose.model("PortfolioStrategy", schema); // Changed model name to "PortfolioStrategy"
    return PortfolioStrategy;
};