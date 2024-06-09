module.exports = mongoose => {
    var schema = mongoose.Schema({
        strategy: {
            id: String,
            name: String,
        },
        subscriberId: {type:String, default:"105646d8-8c97-4d4d-9b74-413bd66cd4ed"},
        positionId: String,
        time: {type: Date, default: new Date()},
        symbol: {type: String, default: 'EURUSD'},
        type: {type: String, default: 'DEAL_TYPE_BUY'},
        side: {type: String, default: ''},
        openPrice: Number,
        stopLoss: Number,
        takeProfit: Number,
        signalVolume: Number,
        subscriberVolume: Number,
        subscriberProfit: Number,
        closeAfter: {type: Date, default: new Date()},
        closeOnly: Boolean,
    });
    
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const TradingSignal = mongoose.model("TradingSignal", schema); // Changed model name to "TradingSignal"
    return TradingSignal;
};