module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            id: {
                type: String,
                required: true, // Corrected spelling of 'required'
                unique: true
            },
            name: String,
            description: String,
            skipPendingOrders: {type: Boolean, default: false}, // Changed to Boolean type
            accountId: String,
            commissionScheme: {
                type: String,
                billingPeriod: String, // Added default value
                commissionRate: Number // Added default value
            },
            platformCommissionRate: Number,
            maxTradeRisk: Number,
            reverse: {type: Boolean, default: false}, // Changed to Boolean type
            reduceCorrelations: String,
            symbolFilter: {
                included: [],
                excluded: [],
            },
            newsFilter: {
                breakingNewsFilter: {
                    priorities: [],
                    closePositionTimeGapInMinutes: Number,
                    openPositionFollowingTimeGapInMinutes: Number,
                },
                calendarNewsFilter: {
                    priorities: [],
                    closePositionTimeGapInMinutes: Number,
                    openPositionPrecedingTimeGapInMinutes: Number,
                    openPositionFollowingTimeGapInMinutes: Number,
                },
            },
            riskLimits: [],
            maxStopLoss: {
                value: Number,
                units: String,
            },
            maxLeverage: Number,
            symborMapping: {
                to: String,
                from: String,
            },
            tradeSizeScaling: {
                mode: String,
                tradeVolumne: Number,
                riskFraction: Number,
                forceTinyTrades: Boolean,
                maxRiskCoefficient: Number,
                expression: String,
            }
        }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const ChatUser = mongoose.model("chatuser", schema);
    return ChatUser;
  };
