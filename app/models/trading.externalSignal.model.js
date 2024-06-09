module.exports = mongoose => {
    var schema = mongoose.Schema({
        strategyId: {type: String, default: ''},
        symbol: {type: String, default: 'EURUSD'},
        type: {type: String, default: 'DEAL_TYPE_BUY'},
        time: {type: Date, default: new Date()},
        updateTime: {type: Date, default: new Date()},
        side: {type: String, default: ''},
        volume: Number,
        magic: Number,
        stopLoss: Number,
        takeProfit: Number,
        openPrice: Number,
    });
    
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ExternalSignal = mongoose.model("ExternalSignal", schema); // Changed model name to "ExternalSignal"
    return ExternalSignal;
};