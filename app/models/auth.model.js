module.exports = mongoose => {
    var schema = mongoose.Schema({
        accountId: {
            type: String,
            required: true,
            default: ''
        },
        name: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            default: ''
        },
        logined: {
            type: Boolean,
            default: false,
        }
    });
    
    schema.method("toJSON", function() {
        const { _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });


    const Authentication = mongoose.model("Authentication", schema); // Changed model name to "Master"
    return Authentication;
};