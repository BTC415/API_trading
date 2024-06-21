module.exports = mongoose => {
    var schema = mongoose.Schema({
        accountId: {
            type: String,
            // required: true,
        },
        type: {type: String, default: 'buy'},
        time: {type: Date, default: new Date()},
        subscriberId: {type: String, default: ''},
        symbol: {type: String, default: 'EURVUSD'},
        // subscriberUser: {
        //     id: String,
        //     name: String,
        //     strategies: [{
        //         id: String,
        //         name: String,
        //     }],
        // },
        // demo: Boolean,
        // providerUser: {
        //     id: String,
        //     name: String,
        //     strategies: [{
        //         id: String,
        //         name: String,
        //     }],
        // },
        // strategy: {
        //     id: String,
        //     name: String,
        // },
        positionId: String,
        slavePositionId: String,
        // improvement: Number,
        // providerCommission: Number,
        // platformCommission: Number,
        // incomingProviderCommission: Number,
        // incomingPlatformCommission: Number,
        quantity: Number,
        lotPrice: Number,
        tickPrice: Number,
        amount: Number,
        // commission: Number,
        // swap: Number,
        profit: Number,
        // metrics: {
        //     tradeCopyingLatency: Number,
        //     tradeCopyingSlippageInBasisPoints: Number,
        //     tradeCopyyingSlippageInAccountCurrency: Number,
        //     mtAndBrokerSignalLatency: Number,
        //     tradeAlgorithmLatency: Number,
        //     mtANdBrokerTradeLantency: Number,
        // },
        closed: {type: Boolean, default: false}
    });
    
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Transactioned = mongoose.model("Transactioned", schema); // Changed model name to "Transaction"
    return Transactioned;
};