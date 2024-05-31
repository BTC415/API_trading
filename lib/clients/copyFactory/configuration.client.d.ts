import moment from "moment";
import MetaApiClient from "../metaApi.client";
import DomainClient from "../domain.client";

/**
 * metaapi.cloud CopyFactory configuration API (trade copying configuration API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class ConfigurationClient extends MetaApiClient {

  /**
   * Constructs CopyFactory configuration API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

  /**
   * Retrieves new unused strategy id. Method is accessible only with API access token. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/generateStrategyId/
   * @return {Promise<StrategyId>} promise resolving with strategy id generated
   */
  generateStrategyId(): Promise<StrategyId>;

  /**
   * Generates random account id
   * @return {String} account id
   */
  generateAccountId(): string;

  /**
   * Retrieves CopyFactory copy trading strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategies/
   * @param {Boolean} [includeRemoved] flag instructing to include removed strategies in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactoryStrategy>>} promise resolving with CopyFactory strategies found
   */
  getStrategies(includeRemoved?: boolean, limit?: number, offset?: number): Promise<Array<CopyFactoryStrategy>>;

  /**
   * Retrieves CopyFactory copy trading strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getStrategy/
   * @param {String} strategy id trading strategy id
   * @return {Promise<CopyFactoryStrategy>} promise resolving with CopyFactory strategy found
   */
  getStrategy(strategyId: string): Promise<CopyFactoryStrategy>;

  /**
   * Updates a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateStrategy/
   * @param {String} strategyId copy trading strategy id
   * @param {CopyFactoryStrategyUpdate} strategy trading strategy update
   * @return {Promise} promise resolving when strategy is updated
   */
  updateStrategy(strategyId: string, strategy: CopyFactoryStrategyUpdate): Promise<any>

  /**
   * Deletes a CopyFactory strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeStrategy/
   * @param {String} strategyId copy trading strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when strategy is removed
   */
  removeStrategy(strategyId: string, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>

  /**
   * Retrieves CopyFactory copy portfolio strategies. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategies/
   * @param {Boolean} [includeRemoved] flag instructing to include removed portfolio strategies in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactoryPortfolioStrategy>>} promise resolving with CopyFactory portfolio strategies
   * found
   */
  getPortfolioStrategies(includeRemoved?: boolean, limit?: number, offset?: number): Promise<Array<CopyFactoryPortfolioStrategy>>;

  /**
   * Retrieves CopyFactory copy portfolio strategy by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getPortfolioStrategy/
   * @param {String} portfolioId portfolio strategy id
   * @return {Promise<CopyFactoryPortfolioStrategy>} promise resolving with CopyFactory portfolio strategy found
   */
  getPortfolioStrategy(portfolioId: string): Promise<CopyFactoryPortfolioStrategy>;

  /**
   * Updates a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updatePortfolioStrategy/
   * @param {String} portfolioId copy trading portfolio strategy id
   * @param {CopyFactoryPortfolioStrategyUpdate} portfolio portfolio strategy update
   * @return {Promise} promise resolving when portfolio strategy is updated
   */
  updatePortfolioStrategy(portfolioId: string, portfolio: CopyFactoryPortfolioStrategyUpdate): Promise<any>

  /**
   * Deletes a CopyFactory portfolio strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removePortfolioStrategy/
   * @param {String} portfolioId portfolio strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when portfolio strategy is removed
   */
  removePortfolioStrategy(portfolioId: string, closeInstructions: CopyFactoryCloseInstructions): Promise<any>;

  /**
   * Deletes a CopyFactory portfolio strategy member. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removePortfolioStrategyMember/
   * @param {String} portfolioId portfolio strategy id
   * @param {String} strategyId id of the strategy to delete member for
   * @param {CopyFactoryCloseInstructions} [closeInstructions] strategy close instructions
   * @return {Promise} promise resolving when portfolio strategy member is removed
   */
  removePortfolioStrategyMember(portfolioId: string, strategyId: string, closeInstructions: CopyFactoryCloseInstructions): Promise<any>;

  /**
   * Returns CopyFactory subscribers the user has configured. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getSubscribers/
   * @param {Boolean} [includeRemoved] flag instructing to include removed subscribers in results
   * @param {Number} [limit] pagination limit
   * @param {Number} [offset] copy trading strategy id
   * @return {Promise<Array<CopyFactorySubscriber>>} promise resolving with subscribers found
   */
  getSubscribers(includeRemoved?: boolean, limit?: number, offset?: number): Promise<Array<CopyFactorySubscriber>>;

  /**
   * Returns CopyFactory subscriber by id. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/getSubscriber/
   * @param {String} subscriberId subscriber id
   * @returns {Promise<CopyFactorySubscriber>} promise resolving with subscriber found
   */
  getSubscriber(subscriberId: string): Promise<CopyFactorySubscriber>;

  /**
   * Updates CopyFactory subscriber configuration. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/updateSubscriber/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactorySubscriberUpdate} subscriber subscriber update
   * @returns {Promise} promise resolving when subscriber is updated
   */
  updateSubscriber(subscriberId: string, subscriber: CopyFactorySubscriberUpdate): Promise<any>;

  /**
   * Deletes subscriber configuration. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeSubscriber/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] subscriber close instructions
   * @returns {Promise} promise resolving when subscriber is removed
   */
  removeSubscriber(subscriberId: string, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>;

  /**
   * Deletes a subscription of subscriber to a strategy. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/configuration/removeSubscription/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {CopyFactoryCloseInstructions} [closeInstructions] subscriber close instructions
   * @returns {Promise} promise resolving when subscriber is removed
   */
  removeSubscription(subscriberId: string, strategyId: string, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>;


}

/**
 * Strategy id
 */
export declare type StrategyId = {

  /**
   * strategy id
   */
  id: string
}

/**
 * Strategy signal delay
 */
export declare type StrategySignalDelay = {

  /**
   * min extra trading signal delay value expressed in seconds
   */
  minInSeconds: number,

  /**
   * max extra trading signal delay value expressed in seconds
   */
  maxInSeconds: number
}

/**
 * CopyFactory strategy subscriptions
 */
export declare type CopyFactoryStrategySubscription = {

  /**
   * id of the strategy to subscribe to
   */
  strategyId: string,

  /**
   * subscription multiplier, default is 1x
   */
  multiplier?: number,

  /**
   * flag indicating that pending orders should not be copied. Default
   * is to copy pending orders
   */
  skipPendingOrders?: boolean,

  /**
   * setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). immediately means to close all positions immediately. One of 'by-position', 'by-symbol', 'immediately'
   */
  closeOnly?: string,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk?: number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: string,

  /**
   * symbol filter which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * setting indicating maximum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded
   */
  maxLeverage?: number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop loss.
   */
  copyStopLoss?: boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take profit.
   */
  copyTakeProfit?: boolean,

  /**
   * Trade sides which will be copied. Buy trades only, sell trades only or all trades.
   * Default is to copy all trades
   */
  allowedSides?: string[],

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be copied
   */
  minTradeVolume?: number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: number,

  /**
   * Extra trade copying delay introduced by trade copier before applying the trade signal.
   * You can configure either a fixed or a random delay
   */
  signalDelay?: StrategySignalDelay,

  /**
   * flag indicating that the subscription was scheduled for removal once all subscription
   * positions will be closed
   */
  removed?: boolean
}

/**
 * CopyFactory strategy trade size scaling settings
 */
export declare type CopyFactoryStrategyTradeSizeScaling = {

  /**
   * If set to balance, the trade size on strategy subscriber will be scaled according
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
   */
  mode: string,

  /**
   * Fixed trade volume for use with fixedVolume trade size scaling mode
   */
  tradeVolume?: number,

  /**
   * Fixed risk fraction for use with fixedRisk trade size scaling mode
   */
  riskFraction?: number,

  /**
   * If set to true, that trades smaller than minVolume - 0.5 * volumeStep will
   * be placed with minVolume volume, in spite that they will result in increased trade risk, as long as risk
   * increase is in line with maxRiskCoefficient configuration. Otherwise such trades will be skipped to avoid
   * taking excessive trade risk. Default is false.
   */
  forceTinyTrades?: boolean,

  /**
   * Sometimes when placing a small trade, the risk taken can exceed the
   * subscription expectation due to volume rounding or forcefully placing tiny trades in accordance with
   * forceTinyTrades setting. The maxRiskCoefficient setting will act as an extra line of protection to restrict
   * trades if actual risk exceeds the value of expected subscription risk multiplied by maxRiskCoefficient. As a
   * result trade volume will be decreased correspondingly or trade will be skipped if resulting volume is less
   * than minVolume. Default value is 5, minimum value is 1.
   */
  maxRiskCoefficient?: number,

  /**
   * math.js expression which will be used to calculate trade volume
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
  expression?: string
}

/**
 * CopyFactory symbol filter
 */
export declare type CopyFactoryStrategySymbolFilter = {

  /**
   * list of symbols copied. Leave the value empty to copy all symbols
   */
  included: Array<String>,

  /**
   * list of symbols excluded from copying. Leave the value empty to copy all symbols
   */
  excluded: Array<String>
}

/**
 * CopyFactory news risk filter
 */
export declare type CopyFactoryStrategyNewsFilter = {

  /**
   * breaking news filter
   */
  breakingNewsFilter?: CopyFactoryStrategyBreakingNewsFilter

  /**
   * calendar news filter
   */
  calendarNewsFilter?: CopyFactoryStrategyCalendarNewsFilter
}

/**
 * CopyFactory breaking news risk filter
 */
export declare type CopyFactoryStrategyBreakingNewsFilter = {

  /**
   * list of breaking news priorities to stop trading on, leave empty to disable
   * breaking news filter. One of high, medium, low.
   */
  priorities: Array<String>,

  /**
   * time interval specifying when to force close an already
   * open position after breaking news. Default value is 60 minutes
   */
  closePositionTimeGapInMinutes?: number,

  /**
   * time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */
  openPositionFollowingTimeGapInMinutes?: number
}

/**
 * CopyFactory calendar new filter
 */
export declare type CopyFactoryStrategyCalendarNewsFilter = {

  /**
   * list of calendar news priorities to stop trading on, leave empty to disable
   * calendar news filter. One of election, high, medium, low.
   */
  priorities: Array<String>,

  /**
   * time interval specifying when to force close an already
   * open position before calendar news. Default value is 60 minutes
   */
  closePositionTimeGapInMinutes?: number,

  /**
   * time interval specifying when it is still
   * allowed to open position before calendar news. Default value is 120 minutes
   */
  openPositionPrecedingTimeGapInMinutes?: number

  /**
   * time interval specifying when it is allowed to
   * open position after calendar news. Default value is 60 minutes
   */
  openPositionFollowingTimeGapInMinutes?: number
}

/**
 * CopyFactory strategy risk limit type
 */
export declare type CopyFactoryStrategyRiskLimitType = 'day' | 'date' | 'week' | 'week-to-date' | 'month' |
    'month-to-date' | 'quarter' | 'quarter-to-date' | 'year' | 'year-to-date' | 'lifetime';

/**
 * CopyFactory strategy risk limit apply to enum
 */
export declare type CopyFactoryStrategyRiskLimitApplyTo = 'balance-difference' | 'balance-minus-equity' |
  'equity-difference';

/**
 * CopyFactory risk limit filter
 */
export declare type CopyFactoryStrategyRiskLimit = {

  /**
   * restriction type
   */
  type: CopyFactoryStrategyRiskLimitType,

  /**
   * account metric to apply limit to
   */
  applyTo: CopyFactoryStrategyRiskLimitApplyTo,

  /**
   *  Max drawdown allowed, measured in account currency,
   */
  maxAbsoluteRisk?: number;

  /**
  *  Max drawdown allowed, expressed as a fraction of 1,
  */
  maxRelativeRisk?: number;

  /**
   * whether to force close positions when the risk is reached. If value is false
   * then only the new trades will be halted, but existing ones will not be closed
   */
  closePositions: boolean;

  /**
   * time to start risk tracking from. All previous trades will be ignored. You
   * can use this value to reset the filter after stopout event
   */
  startTime?: Date | string | moment.Moment;
}

/**
 * CopyFactory strategy max stop loss settings
 */
export declare type CopyFactoryStrategyMaxStopLoss = {

  /**
   * maximum SL value
   */
  value: number,

  /**
   * SL units. Only pips value is supported at this point
   */
  units: string
}

/**
 * CopyFactory strategy symbol mapping
 */
export declare type CopyFactoryStrategySymbolMapping = {

  /**
   * symbol name to convert from
   */
  from: string,

  /**
   * symbol name to convert to
   */
  to: string
}

/**
 * CopyFactory account update
 */
export declare type CopyFactorySubscriberUpdate = {

  /**
   * account human-readable name
   */
  name: string

  /**
   * fraction of reserved margin to reduce a risk of margin call.
   * Default is to reserve no margin. We recommend using maxLeverage setting instead. Specified as a fraction of balance
   * thus the value is usually greater than 1
   */
  reservedMarginFraction?: number,

  /**
   * phone numbers to send sms notifications to. Leave empty to
   * receive no sms notifications
   */
  phoneNumbers?: Array<String>,

  /**
   * value of minimal trade size allowed, expressed in amount of account
   * currency. Can be useful if your broker charges a fixed fee per transaction so that you can skip small trades with
   * high broker commission rates. Default is 0
   */
  minTradeAmount?: number,

  /**
   * setting wich instructs the application not to open new positions. by-symbol
   * means that it is still allowed to open new positions with a symbol equal to the symbol of an existing strategy
   * position (can be used to gracefuly exit strategies trading in netting mode or placing a series of related trades
   * per symbol). immediately means to close all positions immediately. One of 'by-position', 'by-symbol', 'immediately'
   */
  closeOnly?: string,

  /**
   * account risk limits. You can configure trading to be
   * stopped once total drawdown generated during specific period is exceeded. Can be specified either for balance or
   * equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * setting indicating maxumum leverage allowed when opening a new positions.
   * Any trade which results in a higher leverage will be discarded.
   */
  maxLeverage?: number,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: boolean,

  /**
   * Trade sides which will be copied. Buy trades only, sell trades only or all trades.
   * Default is to copy all trades
   */
  allowedSides?: string[],

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: number,

  /**
   * Extra trade copying delay introduced by trade copier before applying the trade signal.
   * You can configure either a fixed or a random delay
   */
  signalDelay?: StrategySignalDelay,

  /**
   * strategy subscriptions
   */
  subscriptions?: Array<CopyFactoryStrategySubscription>
}

/**
 * CopyFactory subscriber model
 */
export declare type CopyFactorySubscriber = CopyFactorySubscriberUpdate & {

  /**
   * id of the MetaApi account to copy trades to
   */
  _id: string
}

/**
 * CopyFactory provider strategy
 */
export declare type CopyFactoryStrategy = CopyFactoryStrategyUpdate & {

  /**
   * unique strategy id
   */
  _id: string,

  /**
   * commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   */
  platformCommissionRate: number

  /**
   * position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory. close-gracefully-by-position means
   * that positions will continue to be managed by CopyFactory, but only close signals will be copied.
   * close-gracefully-by-symbol means that positions will continue to be managed by CopyFactory, but only close
   * signals will be copied or signals to open positions for the symbols which already have positions opened.
   * close-immediately means that all positions will be closed immediately. Default is close-immediately.
   * This field can be changed via remove potfolio member API only, one of preserve, close-gracefully-by-position,
   * close-gracefully-by-symbol, close-immediately
   */
  closeOnRemovalMode?: string
}

/**
 * CopyFactory strategy commission scheme
 */
export declare type CopyFactoryStrategyCommissionScheme = {

  /**
   * commission type. One of flat-fee, lots-traded, lots-won, amount-traded, amount-won,
   * high-water-mark
   */
  type: string,

  /**
   * billing period. One of week, month, quarter
   */
  billingPeriod: string,

  /**
   * commission rate. Should be greater than or equal to zero if commission type is
   * flat-fee, lots-traded or lots-won, should be greater than or equal to zero and less than or equal to 1 if
   * commission type is amount-traded, amount-won, high-water-mark.
   */
  commissionRate: number
}

/**
 * CopyFactory strategy magic filter
 */
export declare type CopyFactoryStrategyMagicFilter = {

  /**
   * list of magics (expert ids) or magic ranges copied. Leave the value empty to
   * copy all magics
   */
  included: Array<String>,

  /**
   * list of magics (expert ids) or magic ranges excluded from copying. Leave the
   * value empty to copy all magics
   */
  excluded: Array<String>
}

/**
 * CopyFactory strategy time settings
 */
export declare type CopyFactoryStrategyTimeSettings = {

  /**
   * position lifetime. Default is to keep positions open up to 90 days
   */
  lifetimeInHours?: number,

  /**
   * time interval to copy new positions. Default is to let 1
   * minute for the position to get copied. If position were not copied during this time, the copying will not be
   * retried anymore.
   */
  openingIntervalInMinutes?: number,

  /**
   * If set to true, the openingIntervalInMinutes setting will be applied to pending order signals as well. By default
   * pending order signals do not expire
   */
  expirePendingOrderSignals?: boolean
}

/**
 * Telegram publishing settings
 */
export declare type StrategyTelegramSettings = {
  /**
   * telegram publishing settings
   */
  publishing: StrategyTelegramPublishingSettings;
}

/**
 * Strategy Telegram integration settings
 */
export declare type StrategyTelegramPublishingSettings = {

  /**
   * Token telegram bot API 
   */
  token: string;

  /**
   * telegram chatId to publish signals to. It can reference either a public
   * channel (e.g. @myChannel), private channel (works by chat id only) or a user (works by chatId only).
   * Note that in order to publish signals to a channel bot must be an admin of the channel
   */
  chatId: string;

  /**
   * telegram message template. A substring of ${description} will be replaced with a signal description. Other
   * variables you can use: ${operation}, ${orderId}, ${side}, ${type}, ${volume}, ${symbol}, ${openPrice},
   * ${stopLoss}, ${takeProfit}.
   */
  template: string;
}

/**
 * CopyFactory strategy equity curve filter
 */
export declare type CopyFactoryStrategyEquityCurveFilter = {

  /**
   * moving average period, must be greater or equal to 1
   */
  period: number,

  /**
   * moving average timeframe, a positive integer followed by time unit, e.g. 2h.
   * Allowed units are s, m, h, d and w.
   */
  timeframe: string
}

/**
 * CopyFactory strategy drawdown filter
 */
export declare type CopyFactoryStrategyDrawdownFilter = {

  /**
   * maximum drawdown value after which action is executed. Drawdown should
   * be configured as a fraction of 1, i.e. 0.15 means 15% drawdown value
   */
  maxDrawdown: number,

  /**
   * action to take when drawdown exceeds maxDrawdown value. include means the trading
   * signal will be transmitted only if dd is greater than maxDrawdown value. exclude means the trading signal 
   * will be transmitted only if dd is less than maxDrawdown value
   */
  action: string
}

/**
 * CopyFactory strategy update
 */
export declare type CopyFactoryStrategyUpdate = {

  /**
   * strategy human-readable name
   */
  name: string,

  /**
   * longer strategy human-readable description
   */
  description: string,

  /**
   * id of the MetaApi account providing the strategy
   */
  accountId: string,

  /**
   * flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   */
  skipPendingOrders?: boolean,

  /**
   * commission scheme allowed by this strategy
   */
  commissionScheme?: CopyFactoryStrategyCommissionScheme,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk?: number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: string,

  /**
   * symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter,

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   */
  maxLeverage?: number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: boolean,

  /**
   * Trade sides which will be copied. Buy trades only, sell trades only or all trades.
   * Default is to copy all trades
   */
  allowedSides?: string[],

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: number,

  /**
   * Extra trade copying delay introduced by trade copier before applying the trade signal.
   * You can configure either a fixed or a random delay
   */
  signalDelay?: StrategySignalDelay,

  /**
   * magic (expert id) filter
   */
  magicFilter?: CopyFactoryStrategyMagicFilter,

  /**
   * filter which permits the trades only if account
   * equity is greater than balance moving average
   */
  equityCurveFilter?: CopyFactoryStrategyEquityCurveFilter,

  /**
   *  master account strategy drawdown filter
   */
  drawdownFilter?: CopyFactoryStrategyDrawdownFilter,

  /**
   * symbols traded by this strategy. Specifying the symbols will improve trade
   * latency on first trades made by strategy. If you do not specify this setting the application will monitor the strategy
   * trades and detect the symbols automatically over time
   */
  symbolsTraded?: Array<String>,

  /**
   * settings to manage copying timeframe and position
   * lifetime. Default is to copy position within 1 minute from being opened at source and let the position to live for
   * up to 90 days
   */
  timeSettings?: CopyFactoryStrategyTimeSettings,

  /**
   * telegram publishing settings
   */
  telegram?: StrategyTelegramSettings;
}

/**
 * CopyFactory close instructions
 */
export declare type CopyFactoryCloseInstructions = {

  /**
   * position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory.
   * close-gracefully-by-position means that positions will continue to be managed by CopyFactory,
   * but only close signals will be copied. close-gracefully-by-symbol means that positions will
   * continue to be managed by CopyFactory, but only close signals will be copied or signals to
   * open positions for the symbols which already have positions opened. close-immediately means
   * that all positions will be closed immediately. Default is close-immediately. One of 'preserve',
   * 'close-gracefully-by-position', 'close-gracefully-by-symbol', 'close-immediately'
   */
  mode?: string,

  /**
   * time to force remove object after. The object will be removed after
   * this time, even if positions are not yet closed fully. Default is current date plus 30 days.
   * Can not be less than 30 days or greater than current date plus 90 days. The setting is ignored
   * when a subscription is being removed
   */
  removeAfter?: Date
}

/**
 * Portfolio strategy member
 */
export declare type CopyFactoryPortfolioStrategyMember = {

  /**
   * member strategy id
   */
  strategyId: string,

  /**
   * copying multiplier (weight in the portfolio)
   */
  multiplier: number,

  /**
   * flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   */
  skipPendingOrders?: boolean,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk: number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: string,

  /**
   * symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter,

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   */
  maxLeverage?: number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: boolean,

  /**
   * Trade sides which will be copied. Buy trades only, sell trades only or all trades.
   * Default is to copy all trades
   */
  allowedSides?: string[],

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: number,

  /**
   * Extra trade copying delay introduced by trade copier before applying the trade signal.
   * You can configure either a fixed or a random delay
   */
  signalDelay?: StrategySignalDelay,

  /**
   * position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory. close-gracefully-by-position means
   * that positions will continue to be managed by CopyFactory, but only close signals will be copied.
   * close-gracefully-by-symbol means that positions will continue to be managed by CopyFactory, but only close
   * signals will be copied or signals to open positions for the symbols which already have positions opened.
   * close-immediately means that all positions will be closed immediately. Default is close-immediately.
   * This field can be changed via remove potfolio member API only, one of preserve, close-gracefully-by-position,
   * close-gracefully-by-symbol, close-immediately
   */
  closeOnRemovalMode?: string
}

/**
 * Portfolio strategy update
 */
export declare type CopyFactoryPortfolioStrategyUpdate = {

  /**
   * strategy human-readable name
   */
  name: string,

  /**
   * longer strategy human-readable description
   */
  description: string,

  /**
   * array of portfolio members
   */
  members: Array<CopyFactoryPortfolioStrategyMember>,

  /**
   * commission scheme allowed by this strategy. By
   * default monthly billing period with no commission is being used
   */
  commissionScheme?: CopyFactoryStrategyCommissionScheme,

  /**
   * flag indicating that pending orders should not be copied.
   * Default is to copy pending orders
   */
  skipPendingOrders?: boolean,

  /**
   * max risk per trade, expressed as a fraction of 1. If trade has a SL, the
   * trade size will be adjusted to match the risk limit. If not, the trade SL will be applied according to the risk
   * limit
   */
  maxTradeRisk?: number,

  /**
   * flag indicating that the strategy should be copied in a reverse direction
   */
  reverse?: boolean,

  /**
   * setting indicating whether to enable automatic trade
   * correlation reduction. Possible settings are not specified (disable correlation risk restrictions),
   * by-strategy (limit correlations for the strategy) or by-account (limit correlations for the account)
   */
  reduceCorrelations?: string,

  /**
   * symbol filters which can be used to copy only specific
   * symbols or exclude some symbols from copying
   */
  symbolFilter?: CopyFactoryStrategySymbolFilter,

  /**
   * news risk filter configuration
   */
  newsFilter?: CopyFactoryStrategyNewsFilter,

  /**
   * strategy risk limits. You can configure
   * trading to be stopped once total drawdown generated during specific period is exceeded. Can be specified either for
   * balance or equity drawdown
   */
  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  /**
   * stop loss value restriction
   */
  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  /**
   * max leverage risk restriction. All trades resulting in a leverage value
   * higher than specified will be skipped
   */
  maxLeverage?: number,

  /**
   * defines how symbol name should be changed when
   * trading (e.g. when broker uses symbol names with unusual suffixes). By default this setting is disabled and the
   * trades are copied using signal source symbol name
   */
  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  /**
   * Trade size scaling settings. By default the
   * trade size on strategy subscriber side will be scaled according to balance to preserve risk.
   */
  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  /**
   * flag indicating whether stop loss should be copied. Default is to copy stop
   * loss.
   */
  copyStopLoss?: boolean,

  /**
   * flag indicating whether take profit should be copied. Default is to copy take
   * profit.
   */
  copyTakeProfit?: boolean,

  /**
   * Trade sides which will be copied. Buy trades only, sell trades only or all trades.
   * Default is to copy all trades
   */
  allowedSides?: string[],

  /**
   * Minimum trade volume to copy. Trade signals with a smaller volume will not be
   * copied
   */
  minTradeVolume?: number,

  /**
   * Maximum trade volume to copy. Trade signals with a larger volume will be copied
   * with maximum volume instead
   */
  maxTradeVolume?: number,

  /**
   * Extra trade copying delay introduced by trade copier before applying the trade signal.
   * You can configure either a fixed or a random delay
   */
  signalDelay?: StrategySignalDelay
}

/**
 * Portfolio strategy, i.e. the strategy which includes a set of other strategies
 */
export declare type CopyFactoryPortfolioStrategy = CopyFactoryPortfolioStrategyUpdate & {

  /**
   * unique strategy id
   */
  _id: string,

  /**
   * commission rate the platform charges for strategy copying, applied to
   * commissions charged by provider. This commission applies only to accounts not managed directly by provider. Should
   * be fraction of 1
   */
  platformCommissionRate: number

  /**
   * position close mode on strategy or subscription removal. Preserve means
   * that positions will not be closed and will not be managed by CopyFactory. close-gracefully-by-position means
   * that positions will continue to be managed by CopyFactory, but only close signals will be copied.
   * close-gracefully-by-symbol means that positions will continue to be managed by CopyFactory, but only close
   * signals will be copied or signals to open positions for the symbols which already have positions opened.
   * close-immediately means that all positions will be closed immediately. Default is close-immediately.
   * This field can be changed via remove potfolio member API only, one of preserve, close-gracefully-by-position,
   * close-gracefully-by-symbol, close-immediately
   */
  closeOnRemovalMode?: string
}