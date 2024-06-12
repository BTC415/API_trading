module.exports = mongoose => {
    var schema = mongoose.Schema({
        subscriberId: {
            type: String,
            default:''
        },
        strategy: {
            id: String,
            name: String,
        },
        partial: {
            type: Boolean,
            default: true,
        },
        reason: String,
        reasonDescription: String,
        closePositions: Boolean,
        StoppedAt: {
            type: Date,
            default: new Date(),
        },
        StoppedTill: {
            type: Date,
            default: new Date(),
        }
    })
}