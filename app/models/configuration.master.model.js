module.exports = mongoose => {
    var schema = mongoose.Schema({
        _id: {
            type: String,
            required: true,
            unique: true
        },
        name: {type: String, default: ''},
        description: {type: String, default: ''},
        server: {type: String, default: "MT4"},
        demo: {type: Boolean, default: false},
        accountId: {type: String, default: ''},
        symbol: {type: String, default: 'EURUSD'},
        currency: {type: String, default: 'USD'},
        leverage: {type: Number, default: 1},
        tradeVolume: Number,
        stopLoss: Number,
        takeProfit: Number,
        pendingOrder: {
            buyLimit: Number,
            buyStop: Number,
            sellLimit: Number,
            sellStop: Number
        },
        maxTradeRisk: {type: Number, default: undefined},
        drawDown: {type: Number, default: undefined},
        timeFrame: {type: String, default: "1m"},
        closeVolume: {type:Number, default: 0},
        isPendingOrder: {type: Boolean, default: false},
        closeAll: {type: String, default: 'Nothing'},
        specificPrice: {
            breakEven: {type: Boolean, default: false},
            moveStopLoss: {type: Number, default: 0},
            moveTakeProfit: {type: Number, default: 0},
            entryPoint: {type:Number, default: 0}
        },
        isStopLoss: {type: Boolean, default:true}
    });

    const Masters = mongoose.model("Masters", schema); // Changed model name to "Master"
    return Masters;
};