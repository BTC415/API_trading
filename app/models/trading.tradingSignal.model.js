module.exports = mongoose => {
    var schema = mongoose.Schema({
        strategyId: {type: String, default: ""},
        subscriberId: {type:String, default:""},
        positionId: String,
        subscriberPositionId: String,
        time: {type: Date, default: new Date()},
        symbol: {type: String, default: 'EURUSD'},
        type: {type: String, default: 'market'},
        side: {type: String, default: 'buy'},
        server: {type: String, default: "MT4"},
        openPrice: Number,
        stopLoss: String,
        takeProfit: String,
        signalVolume: Number,
        subscriberVolume: Number,
        subscriberProfit: Number,
        leverage: Number,
        lotSize: {type: String, default: 'standard'},
        // pendingOrder: {},
        timeFrame: {type: String, default: '1m'},
        profit: {type: Number, default: 0},
        closeAfter: Date,
        closeOnly: Boolean,
        slipPage: {type: Number, default: 0},
        demo: {type: Boolean, default: false}
    });
    
    schema.method("toJSON", function() {
        const { _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const TradingSignal = mongoose.model("TradingSignal", schema); // Changed model name to "TradingSignal"
    return TradingSignal;
};