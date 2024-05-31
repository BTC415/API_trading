'use strict';

import MetaApiClient from '../metaApi.client';
import TimeoutError from '../timeoutError';
import randomstring from 'randomstring';

/**
 * metaapi.cloud CopyFactory configuration API (trade copying configuration API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class ConfigurationClient extends MetaApiClient {

  /**
   * Constructs CopyFactory configuration API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
  }

  /**
   * Strategy id
   * @typedef {Object} StrategyId
   * @property {String} id strategy id
   */

  /**
   * Retrieves new unused strategy id. Method is accessible only with API access token. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/generateStrategyId/
   * @return {Promise<StrategyId>} promise resolving with strategy id generated
   */
  generateStrategyId() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('generateStrategyId');
    }
    const opts = {
      url: '/users/current/configuration/unused-strategy-id',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Generates random account id
   * @return {String} account id
   */
  generateAccountId() {
    return randomstring.generate(64);
  }

  /**
   * Strategy signal delay
   * @typedef {Object} StrategySignalDelay
   * @property {Number} minInSeconds min extra trading signal delay value expressed in seconds
   * @property {Number} maxInSeconds max extra trading signal delay value expressed in seconds
   */

  /**
   * CopyFactory strategy subscriptions
   * @typedef {Object} CopyFactoryStrategySubscription
   * @property {String} strategyId id of the strategy to subscribe to
   * @property {Number} [multiplier] subscription multiplier, default is 1x
   * @property {Boolean} [skipPendingOrders] flag indicating that pending orders should not be copied. Default
   * is to copy pending orders
   * @property {String} [closeOnly] setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). immediately means to close all positions immediately. One of 'by-position', 'by-symbol', 'immediately'
   * @property {Number} [maxTradeRisk] max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filter which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] strategy risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] stop loss value restriction
   * @property {Number} [maxLeverage] setting indicating maximum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeScaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {string[]} [allowedSides] Trade sides which will be copied. Buy trades only, sell trades only or all
   * trades. Default is to copy all trades
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {StrategySignalDelay} [signalDelay] extra trade copying delay introduced by trade copier before
   * applying the trade signal. You can configure either a fixed or a random delay
   * @property {boolean} [removed] flag indicating that the subscription was scheduled for removal once all subscription
   * positions will be closed
   */

  /**
   * CopyFactory strategy trade size scaling settings
   * @typedef {Object} CopyFactoryStrategyTradeSizeScaling
   * @property {string} mode If set to balance, the trade size on strategy subscriber will be scaled according
   * to balance to preserve risk. If set to equity, the trade size on strategy subscriber will be scaled according
   * to subscriber equity. If value is none, then trade size will be preserved irregardless of the subscriber
   * balance. If value is contractSize, then trade size will be scaled according to contract size. If fixedVolume
   * is set, then trade will be copied with a fixed volume of tradeVolume setting. If fixedRisk is set, then each
   * trade will be copied with a trade volume set to risk specific fraction of balance as configured by
   * riskFraction setting. Note, that in fixedRisk mode trades without a SL are not copied. If expression is
   * set, then trade volume will be calculated using a user-defined expression. Note, that expression trade
   * size scaling mode is intended for advanced users and we DO NOT RECOMMEND using it unless you understand
   * what are you doing, as mistakes in expression can result in loss.
   * Allowed values: none, contractSize, balance, equity, fixedVolume, fixedRisk, expression.
   * @property {number} [tradeVolume] Fixed trade volume for use with fixedVolume trade size scaling mode
   * @property {number} [riskFraction] Fixed risk fraction for use with fixedRisk trade size scaling mode
   * @property {boolean} [forceTinyTrades] if set to true, that trades smaller than minVolume - 0.5 * volumeStep will
   * be placed with minVolume volume, in spite that they will result in increased trade risk, as long as risk
   * increase is in line with maxRiskCoefficient configuration. Otherwise such trades will be skipped to avoid
   * taking excessive trade risk. Default is false.
   * @property {number} [maxRiskCoefficient] sometimes when placing a small trade, the risk taken can exceed the
   * subscription expectation due to volume rounding or forcefully placing tiny trades in accordance with
   * forceTinyTrades setting. The maxRiskCoefficient setting will act as an extra line of protection to restrict
   * trades if actual risk exceeds the value of expected subscription risk multiplied by maxRiskCoefficient. As a
   * result trade volume will be decreased correspondingly or trade will be skipped if resulting volume is less
   * than minVolume. Default value is 5, minimum value is 1.
   * @property {string} [expression] math.js expression which will be used to calculate trade volume
   * (see https://mathjs.org/docs/expressions/syntax.html). Following variables are available in expression
   * scope: providerVolume - provider signal trade size; providerTradeAmount - provider signal trade value in
   * trade copier base curency; multiplier - subscription multiplier value; providerBalance - provider balance
   * value in trade copier base currency; balance - subscriber balance value in trade copier base currency;
   * quoteOrOpenPrice - current asset price (for market orders) or open price (for pending orders) on subscriber
   * side; tickValue - current asset tick value on subscriber side expressed in trade copier base currency;
   * tickSize - tick size on subscriber side; providerScaledVolume - provider trade volume multiplied by provider
   * contract size; contractSize - subscriber contract size; providerStopLoss - provider signal stop loss price;
   * providerTakeProfit - provider signal take profit price; accountCurrencyExchangeRate - subscriber exchange
   * rate of account currency to trade copier base currency 
   */

  /**
   * CopyFactory symbol filter
   * @typedef {Object} CopyFactoryStrategySymbolFilter
   * @property {Array<String>} included list of symbols copied. Leave the value empty to copy all symbols
   * @property {Array<String>} excluded list of symbols excluded from copying. Leave the value empty to copy all symbols
   */

  /**
   * CopyFactory news risk filter
   * @typedef {Object} CopyFactoryStrategyNewsFilter
   * @property {CopyFactoryStrategyBreakingNewsFilter} [breakingNewsFilter] breaking news filter
   * @property {CopyFactoryStrategyCalendarNewsFilter} [calendarNewsFilter] calendar news filter
   */

  /**
   * CopyFactory breaking news risk filter
   * @typedef {Object} CopyFactoryStrategyBreakingNewsFilter
   * @property {Array<String>} priorities list of breaking news priorities to stop trading on, leave empty to disable
   * breaking news filter. One of high, medium, low.
   * @property {Number} [closePositionTimeGapInMinutes] time interval specifying when to force close an already
   * open position after breaking news. Default value is 60 minutes
   * @property {Number} [openPositionFollowingTimeGapInMinutes] time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */

  /**
   * CopyFactory calendar new filter
   * @typedef {Object} CopyFactoryStrategyCalendarNewsFilter
   * @property {Array<String>} priorities list of calendar news priorities to stop trading on, leave empty to disable
   * calendar news filter. One of election, high, medium, low.
   * @property {Number} [closePositionTimeGapInMinutes] time interval specifying when to force close an already
   * open position before calendar news. Default value is 60 minutes
   * @property {Number} [openPositionPrecedingTimeGapInMinutes] time interval specifying when it is still
   * allowed to open position before calendar news. Default value is 120 minutes
   * @property {Number} [openPositionFollowingTimeGapInMinutes] time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */

  /**
   * CopyFactory strategy risk limit type
   * @typedef {'day' | 'date' | 'week' | 'week-to-date' | 'month' | 'month-to-date' | 'quarter' | 'quarter-to-date' |
   * 'year' | 'year-to-date' | 'lifetime'} CopyFactoryStrategyRiskLimitType
   */

  /**
   * CopyFactory strategy risk limit apply to enum
   * @typedef {'balance-difference' | 'balance-minus-equity' | 'equity-difference'} CopyFactoryStrategyRiskLimitApplyTo
   */

  /**
   * CopyFactory risk limit filter
   * @typedef {Object} CopyFactoryStrategyRiskLimit
   * @property {CopyFactoryStrategyRiskLimitType} type restriction type
   * @property {CopyFactoryStrategyRiskLimitApplyTo} applyTo account metric to apply limit to
   * @property {Number} [maxAbsoluteRisk] max drawdown allowed, measured in account currency
   * @property {Number} [maxRelativeRisk] max drawdown allowed, measured in account currency
   * @property {Boolean} closePositions whether to force close positions when the risk is reached. If value is false
   * then only the new trades will be halted, but existing ones will not be closed
   * @property {Date|string|moment.Moment} [startTime] time to start risk tracking from. All previous trades will be ignored. You
   * can use this value to reset the filter after stopout event
   */

  /**
   * CopyFactory strategy max stop loss settings
   * @typedef {Object} CopyFactoryStrategyMaxStopLoss
   * @property {Number} value maximum SL value
   * @property {String} units SL units. Only pips value is supported at this point
   */

  /**
   * CopyFactory strategy symbol mapping
   * @typedef {Object} CopyFactoryStrategySymbolMapping
   * @property {String} from symbol name to convert from
   * @property {String} to symbol name to convert to
   */

  /**
   * CopyFactory account update
   * @typedef {Object} CopyFactorySubscriberUpdate
   * @property {String} name account human-readable name
   * @property {Number} [reservedMarginFraction] fraction of reserved margin to reduce a risk of margin call.
   * Default is to reserve no margin. We recommend using maxLeverage setting instead. Specified as a fraction of balance
   * thus the value is usually greater than 1
   * @property {Array<String>} [phoneNumbers] phone numbers to send sms notifications to. Leave empty to
   * receive no sms notifications
   * @property {Number} [minTradeAmount] value of minimal trade size allowed, expressed in amount of account
   * currency. Can be useful if your broker charges a fixed fee per transaction so that you can skip small trades with
   * high broker commission rates. Default is 0
   * @property {String} [closeOnly] setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). immediately means to close all positions immediately. One of 'by-position', 'by-symbol', 'immediately'
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] account risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   * @property {Number} [maxLeverage] setting indicating maxumum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {string[]} [allowedSides] Trade sides which will be copied. Buy trades only, sell trades only or all
   * trades. Default is to copy all trades
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {StrategySignalDelay} [signalDelay] extra trade copying delay introduced by trade copier before
   * applying the trade signal. You can configure either a fixed or a random delay
   * @property {Array<CopyFactoryStrategySubscription>} subscriptions strategy subscriptions
   */

  /**
   * CopyFactory subscriber model
   * @typedef {CopyFactorySubscriberUpdate} CopyFactorySubscriber
   * @property {String} _id id of the MetaApi account to copy trades to 
   */

  /**
   * CopyFactory provider strategy
   * @typedef {CopyFactoryStrategyUpdate} CopyFactoryStrategy
   * @property {String} _id unique strategy id
   * @property {Number} platformCommissionRate commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   * @property {String} [closeOnRemovalMode] position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory. close-gracefully-by-position means
   * that positions will continue to be managed by CopyFactory, but only close signals will be copied.
   * close-gracefully-by-symbol means that positions will continue to be managed by CopyFactory, but only close
   * signals will be copied or signals to open positions for the symbols which already have positions opened.
   * close-immediately means that all positions will be closed immediately. Default is close-immediately.
   * This field can be changed via remove potfolio member API only, one of preserve, close-gracefully-by-position,
   * close-gracefully-by-symbol, close-immediately
   */

  /**
   * CopyFactory strategy commission scheme
   * @typedef {Object} CopyFactoryStrategyCommissionScheme
   * @property {String} type commission type. One of flat-fee, lots-traded, lots-won, amount-traded, amount-won,
   * high-water-mark
   * @property {String} billingPeriod billing period. One of week, month, quarter
   * @property {Number} commissionRate commission rate. Should be greater than or equal to zero if commission type is
   * flat-fee, lots-traded or lots-won, should be greater than or equal to zero and less than or equal to 1 if
   * commission type is amount-traded, amount-won, high-water-mark.
   */

  /**
   * CopyFactory strategy magic filter
   * @typedef {Object} CopyFactoryStrategyMagicFilter
   * @property {Array<String>} included list of magics (expert ids) or magic ranges copied. Leave the value empty to
   * copy all magics
   * @property {Array<String>} excluded list of magics (expert ids) or magic ranges excluded from copying. Leave the
   * value empty to copy all magics
   */

  /**
   * CopyFactory strategy time settings
   * @typedef {Object} CopyFactoryStrategyTimeSettings
   * @property {number} [lifetimeInHours] position lifetime. Default is to keep positions open up to 90 days
   * @property {number} [openingIntervalInMinutes] time interval to copy new positions. Default is to let 1
   * minute for the position to get copied. If position were not copied during this time, the copying will not be
   * retried anymore.
   * @property {boolean} [expirePendingOrderSignals] If set to true, the openingIntervalInMinutes setting will be
   * applied to pending order signals as well. By default pending order signals do not expire
   */

  /**
   * CopyFactory strategy equity curve filter
   * @typedef {Object} CopyFactoryStrategyEquityCurveFilter
   * @property {Number} period moving average period, must be greater or equal to 1
   * @property {String} timeframe moving average timeframe, a positive integer followed by time unit, e.g. 2h.
   * Allowed units are s, m, h, d and w.
   */

  /**
   * Retrieves CopyFactory copy trading strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategies/
   * @param {Boolean} [includeRemoved] flag instructing to include removed strategies in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactoryStrategy>>} promise resolving with CopyFactory strategies found
   */
  getStrategies(includeRemoved, limit, offset) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategies');
    }
    let params = {};
    if(includeRemoved !== undefined) {
      params.includeRemoved = includeRemoved;
    }
    if(limit !== undefined) {
      params.limit = limit;
    }
    if(offset !== undefined) {
      params.offset = offset;
    }
    const opts = {
      url: '/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts, true);
  }

  /**
   * Retrieves CopyFactory copy trading strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategy/
   * @param {string} strategy id trading strategy id
   * @return {Promise<CopyFactoryStrategy>} promise resolving with CopyFactory strategy found
   */
  getStrategy(strategyId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategy');
    }
    const opts = {
      url: `/users/current/configuration/strategies/${strategyId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * CopyFactory strategy drawdown filter
   * @typedef {Object} CopyFactoryStrategyDrawdownFilter
   * @property {Number} maxDrawdown maximum drawdown value after which action is executed. Drawdown should
   * be configured as a fraction of 1, i.e. 0.15 means 15% drawdown value
   * @property {String} action action to take when drawdown exceeds maxDrawdown value. include means the trading
   * signal will be transmitted only if dd is greater than maxDrawdown value. exclude means the trading signal 
   * will be transmitted only if dd is less than maxDrawdown value
   */

  /**
   * Telegram publishing settings
   * @typedef {Object} StrategyTelegramPublishingSettings
   * @property {String} token telegram bot API token
   * @property {String} chatId telegram chatId to publish signals to. It can reference either a public
   * channel (e.g. @myChannel), private channel (works by chat id only) or a user (works by chatId only).
   * Note that in order to publish signals to a channel bot must be an admin of the channel
   * @property {String} template telegram message template. A substring of ${description} will be replaced
   * with a signal description. Other variables you can use: ${operation}, ${orderId}, ${side}, ${type}, ${volume},
   * ${symbol}, ${openPrice}, ${stopLoss}, ${takeProfit}.
   */

  /**
   * Strategy Telegram integration settings
   * @typedef {Object} StrategyTelegramSettings
   * @property {StrategyTelegramPublishingSettings} publishing telegram publishing settings
   */

  /**
   * CopyFactory strategy update
   * @typedef {Object} CopyFactoryStrategyUpdate
   * @property {String} name strategy human-readable name
   * @property {String} description longer strategy human-readable description
   * @property {String} accountId id of the MetaApi account providing the strategy
   * @property {Boolean} [skipPendingOrders] flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   * @property {CopyFactoryStrategyCommissionScheme} [commissionScheme] commission scheme allowed by this strategy
   * @property {Number} [maxTradeRisk] max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] stop loss value restriction
   * @property {Number} [maxLeverage] max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeScaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {string[]} [allowedSides] Trade sides which will be copied. Buy trades only, sell trades only or all
   * trades. Default is to copy all trades
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {StrategySignalDelay} [signalDelay] extra trade copying delay introduced by trade copier before
   * applying the trade signal. You can configure either a fixed or a random delay
   * @property {CopyFactoryStrategyMagicFilter} [magicFilter] magic (expert id) filter
   * @property {CopyFactoryStrategyEquityCurveFilter} [equityCurveFilter] filter which permits the trades only if account
   * equity is greater than balance moving average
   * @property {CopyFactoryStrategyDrawdownFilter} [drawdownFilter] master account strategy drawdown filter
   * @property {Array<String>} [symbolsTraded] symbols traded by this strategy. Specifying the symbols will improve trade
   * latency on first trades made by strategy. If you do not specify this setting the application will monitor the strategy
   * trades and detect the symbols automatically over time 
   * @property {StrategyTelegramSettings} [telegram] telegram publishing settings
   * @property {CopyFactoryStrategyTimeSettings} [timeSettings] settings to manage copying timeframe and position
   * lifetime. Default is to copy position within 1 minute from being opened at source and let the position to live for
   * up to 90 days
   */

  /**
   * Updates a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateStrategy/
   * @param {String} strategyId copy trading strategy id
   * @param {CopyFactoryStrategyUpdate} strategy trading strategy update
   * @return {Promise} promise resolving when strategy is updated
   */
  updateStrategy(strategyId, strategy) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateStrategy');
    }
    const opts = {
      url: `/users/current/configuration/strategies/${strategyId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      data: strategy,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * CopyFactory close instructions
   * @typedef {Object} CopyFactoryCloseInstructions
   * @property {String} [mode] position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory.
   * close-gracefully-by-position means that positions will continue to be managed by CopyFactory,
   * but only close signals will be copied. close-gracefully-by-symbol means that positions will
   * continue to be managed by CopyFactory, but only close signals will be copied or signals to
   * open positions for the symbols which already have positions opened. close-immediately means
   * that all positions will be closed immediately. Default is close-immediately. One of 'preserve',
   * 'close-gracefully-by-position', 'close-gracefully-by-symbol', 'close-immediately'
   * @property {Date} [removeAfter] time to force remove object after. The object will be removed after
   * this time, even if positions are not yet closed fully. Default is current date plus 30 days.
   * Can not be less than 30 days or greater than current date plus 90 days. The setting is ignored
   * when a subscription is being removed
   */

  /**
   * Deletes a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeStrategy/
   * @param {String} strategyId copy trading strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when strategy is removed
   */
  removeStrategy(strategyId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeStrategy');
    }
    const opts = {
      url: `/users/current/configuration/strategies/${strategyId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Portfolio strategy member
   * @typedef {Object} CopyFactoryPortfolioStrategyMember
   * @property {String} strategyId member strategy id
   * @property {Number} multiplier copying multiplier (weight in the portfolio)
   * @property {Boolean} [skipPendingOrders] flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   * @property {Number} [maxTradeRisk] max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] stop loss value restriction
   * @property {Number} [maxLeverage] max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeScaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {string[]} [allowedSides] Trade sides which will be copied. Buy trades only, sell trades only or all
   * trades. Default is to copy all trades
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {StrategySignalDelay} [signalDelay] extra trade copying delay introduced by trade copier before
   * applying the trade signal. You can configure either a fixed or a random delay
   * @property {String} [closeOnRemovalMode] position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory. close-gracefully-by-position means
   * that positions will continue to be managed by CopyFactory, but only close signals will be copied.
   * close-gracefully-by-symbol means that positions will continue to be managed by CopyFactory, but only close
   * signals will be copied or signals to open positions for the symbols which already have positions opened.
   * close-immediately means that all positions will be closed immediately. Default is close-immediately.
   * This field can be changed via remove potfolio member API only, one of preserve, close-gracefully-by-position,
   * close-gracefully-by-symbol, close-immediately
   */

  /**
   * Portfolio strategy update
   * @typedef {Object} CopyFactoryPortfolioStrategyUpdate
   * @property {String} name strategy human-readable name
   * @property {String} description longer strategy human-readable description
   * @property {Array<CopyFactoryPortfolioStrategyMember>} members array of portfolio members
   * @property {CopyFactoryStrategyCommissionScheme} [commissionScheme] commission scheme allowed by this strategy. By
   * default monthly billing period with no commission is being used
   * @property {Boolean} [skipPendingOrders] flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   * @property {Number} [maxTradeRisk] max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   * @property {Boolean} [reverse] flag indicating that the strategy should be copied in a reverse direction
   * @property {String} [reduceCorrelations] setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   * @property {CopyFactoryStrategySymbolFilter} [symbolFilter] symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   * @property {CopyFactoryStrategyNewsFilter} [newsFilter] news risk filter configuration
   * @property {Array<CopyFactoryStrategyRiskLimit>} [riskLimits] strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   * @property {CopyFactoryStrategyMaxStopLoss} [maxStopLoss] stop loss value restriction
   * @property {Number} [maxLeverage] max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   * @property {Array<CopyFactoryStrategySymbolMapping>} [symbolMapping] defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   * @property {CopyFactoryStrategyTradeSizeScaling} [tradeSizeScaling] Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   * @property {boolean} [copyStopLoss] flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   * @property {boolean} [copyTakeProfit] flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   * @property {string[]} [allowedSides] Trade sides which will be copied. Buy trades only, sell trades only or all
   * trades. Default is to copy all trades
   * @property {number} [minTradeVolume] Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   * @property {number} [maxTradeVolume] Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   * @property {StrategySignalDelay} [signalDelay] extra trade copying delay introduced by trade copier before
   * applying the trade signal. You can configure either a fixed or a random delay
   */

  /**
   * Portfolio strategy, i.e. the strategy which includes a set of other strategies
   * @typedef {CopyFactoryPortfolioStrategyUpdate} CopyFactoryPortfolioStrategy
   * @property {String} _id unique strategy id
   * @property {Number} platformCommissionRate commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   * @property {String} [closeOnRemovalMode] position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory. close-gracefully-by-position means
   * that positions will continue to be managed by CopyFactory, but only close signals will be copied.
   * close-gracefully-by-symbol means that positions will continue to be managed by CopyFactory, but only close
   * signals will be copied or signals to open positions for the symbols which already have positions opened.
   * close-immediately means that all positions will be closed immediately. Default is close-immediately.
   * This field can be changed via remove potfolio member API only, one of preserve, close-gracefully-by-position,
   * close-gracefully-by-symbol, close-immediately
   */

  /**
   * Retrieves CopyFactory copy portfolio strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategies/
   * @param {Boolean} [includeRemoved] flag instructing to include removed portfolio strategies in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactoryPortfolioStrategy>>} promise resolving with CopyFactory portfolio strategies
   * found
   */
  getPortfolioStrategies(includeRemoved, limit, offset) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getPortfolioStrategies');
    }
    let params = {};
    if(includeRemoved !== undefined) {
      params.includeRemoved = includeRemoved;
    }
    if(limit !== undefined) {
      params.limit = limit;
    }
    if(offset !== undefined) {
      params.offset = offset;
    }
    const opts = {
      url: '/users/current/configuration/portfolio-strategies',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts, true);
  }

  /**
   * Retrieves CopyFactory copy portfolio strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategy/
   * @param {string} portfolioId portfolio strategy id
   * @return {Promise<CopyFactoryPortfolioStrategy>} promise resolving with CopyFactory portfolio strategy found
   */
  getPortfolioStrategy(portfolioId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getPortfolioStrategy');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Updates a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updatePortfolioStrategy/
   * @param {String} portfolioId copy trading portfolio strategy id
   * @param {CopyFactoryPortfolioStrategyUpdate} portfolio portfolio strategy update
   * @return {Promise} promise resolving when portfolio strategy is updated
   */
  updatePortfolioStrategy(portfolioId, portfolio) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updatePortfolioStrategy');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      data: portfolio,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Deletes a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removePortfolioStrategy/
   * @param {String} portfolioId portfolio strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when portfolio strategy is removed
   */
  removePortfolioStrategy(portfolioId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removePortfolioStrategy');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Deletes a CopyFactory portfolio strategy member. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removePortfolioStrategyMember/
   * @param {String} portfolioId portfolio strategy id
   * @param {String} strategyId id of the strategy to delete member for
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when portfolio strategy is removed
   */
  removePortfolioStrategyMember(portfolioId, strategyId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removePortfolioStrategyMember');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}/members/${strategyId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Returns CopyFactory subscribers the user has configured. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getSubscribers/
   * @param {Boolean} [includeRemoved] flag instructing to include removed subscribers in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactorySubscriber>>} promise resolving with subscribers found
   */
  getSubscribers(includeRemoved, limit, offset) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSubscribers');
    }
    let params = {};
    if(includeRemoved !== undefined) {
      params.includeRemoved = includeRemoved;
    }
    if(limit !== undefined) {
      params.limit = limit;
    }
    if(offset !== undefined) {
      params.offset = offset;
    }
    const opts = {
      url: '/users/current/configuration/subscribers',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts, true);
  }

  /**
   * Returns CopyFactory subscriber by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getSubscriber/
   * @param {String} subscriberId subscriber id
   * @returns {Promise<CopyFactorySubscriber>} promise resolving with subscriber found
   */
  getSubscriber(subscriberId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSubscriber');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Updates CopyFactory subscriber configuration. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateSubscriber/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactorySubscriberUpdate} subscriber subscriber update
   * @returns {Promise} promise resolving when subscriber is updated
   */
  updateSubscriber(subscriberId, subscriber) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateSubscriber');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      data: subscriber,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Deletes subscriber configuration. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeSubscriber/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] subscriber close instructions
   * @returns {Promise} promise resolving when subscriber is removed
   */
  removeSubscriber(subscriberId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeSubscriber');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Deletes a subscription of subscriber to a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeSubscription/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] subscriber close instructions
   * @returns {Promise} promise resolving when subscriber is removed
   */
  removeSubscription(subscriberId, strategyId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeSubscription');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}/subscriptions/${strategyId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

}
