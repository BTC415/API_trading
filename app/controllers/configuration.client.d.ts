// import moment from "moment";
import MetaApiClient from "../metaApi.client";
import DomainClient from "../domain.client";

export default class ConfigurationClient extends MetaApiClient {

  constructor(domainClient: DomainClient);

  generateStrategyId(): Promise<StrategyId>;

  generateAccountId(): string;
  getStrategies(includeRemoved?: boolean, limit?: number, offset?: number): Promise<Array<CopyFactoryStrategy>>;

  getStrategy(strategyId: string): Promise<CopyFactoryStrategy>;

  updateStrategy(strategyId: string, strategy: CopyFactoryStrategyUpdate): Promise<any>

  removeStrategy(strategyId: string, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>

  getPortfolioStrategies(includeRemoved?: boolean, limit?: number, offset?: number): Promise<Array<CopyFactoryPortfolioStrategy>>;

  getPortfolioStrategy(portfolioId: string): Promise<CopyFactoryPortfolioStrategy>;

  updatePortfolioStrategy(portfolioId: string, portfolio: CopyFactoryPortfolioStrategyUpdate): Promise<any>

  removePortfolioStrategy(portfolioId: string, closeInstructions: CopyFactoryCloseInstructions): Promise<any>;

  removePortfolioStrategyMember(portfolioId: string, strategyId: string, closeInstructions: CopyFactoryCloseInstructions): Promise<any>;

  getSubscribers(includeRemoved?: boolean, limit?: number, offset?: number): Promise<Array<CopyFactorySubscriber>>;

  getSubscriber(subscriberId: string): Promise<CopyFactorySubscriber>;

  updateSubscriber(subscriberId: string, subscriber: CopyFactorySubscriberUpdate): Promise<any>;

  removeSubscriber(subscriberId: string, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>;

  removeSubscription(subscriberId: string, strategyId: string, closeInstructions?: CopyFactoryCloseInstructions): Promise<any>;


}

export declare type StrategyId = {

  id: string
}

export declare type StrategySignalDelay = {

  minInSeconds: number,

  maxInSeconds: number
}

export declare type CopyFactoryStrategySubscription = {

  strategyId: string,

  multiplier?: number,

  skipPendingOrders?: boolean,

  closeOnly?: string,

  maxTradeRisk?: number,

  reverse?: boolean,

  reduceCorrelations?: string,

  symbolFilter?: CopyFactoryStrategySymbolFilter

  newsFilter?: CopyFactoryStrategyNewsFilter,

  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  maxLeverage?: number,

  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  copyStopLoss?: boolean,

  copyTakeProfit?: boolean,

  allowedSides?: string[],

  minTradeVolume?: number,

  maxTradeVolume?: number,

  signalDelay?: StrategySignalDelay,

  removed?: boolean
}

export declare type CopyFactoryStrategyTradeSizeScaling = {

  mode: string,

  tradeVolume?: number,

  riskFraction?: number,

  forceTinyTrades?: boolean,

  maxRiskCoefficient?: number,

  expression?: string
}

export declare type CopyFactoryStrategySymbolFilter = {

  included: Array<String>,

  excluded: Array<String>
}

export declare type CopyFactoryStrategyNewsFilter = {

  breakingNewsFilter?: CopyFactoryStrategyBreakingNewsFilter

  calendarNewsFilter?: CopyFactoryStrategyCalendarNewsFilter
}

export declare type CopyFactoryStrategyBreakingNewsFilter = {

  priorities: Array<String>,

  closePositionTimeGapInMinutes?: number,

  openPositionFollowingTimeGapInMinutes?: number
}

export declare type CopyFactoryStrategyCalendarNewsFilter = {

  priorities: Array<String>,

  closePositionTimeGapInMinutes?: number,

  openPositionPrecedingTimeGapInMinutes?: number

  openPositionFollowingTimeGapInMinutes?: number
}

export declare type CopyFactoryStrategyRiskLimitType = 'day' | 'date' | 'week' | 'week-to-date' | 'month' |
    'month-to-date' | 'quarter' | 'quarter-to-date' | 'year' | 'year-to-date' | 'lifetime';

export declare type CopyFactoryStrategyRiskLimitApplyTo = 'balance-difference' | 'balance-minus-equity' |
  'equity-difference';

export declare type CopyFactoryStrategyRiskLimit = {

  type: CopyFactoryStrategyRiskLimitType,

  applyTo: CopyFactoryStrategyRiskLimitApplyTo,

  maxAbsoluteRisk?: number;

  maxRelativeRisk?: number;

  closePositions: boolean;

  startTime?: Date | string | moment.Moment;
}

export declare type CopyFactoryStrategyMaxStopLoss = {

  value: number,

  units: string
}

export declare type CopyFactoryStrategySymbolMapping = {

  from: string,

  to: string
}
export declare type CopyFactorySubscriberUpdate = {

  name: string

nFraction?: number,

  phoneNumbers?: Array<String>,

  minTradeAmount?: number,

  closeOnly?: string,

  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  maxLeverage?: number,

  copyStopLoss?: boolean,

  copyTakeProfit?: boolean,

  allowedSides?: string[],

  minTradeVolume?: number,

  maxTradeVolume?: number,

  signalDelay?: StrategySignalDelay,

  subscriptions?: Array<CopyFactoryStrategySubscription>
}

export declare type CopyFactorySubscriber = CopyFactorySubscriberUpdate & {

  _id: string
}

export declare type CopyFactoryStrategy = CopyFactoryStrategyUpdate & {

  _id: string,

  platformCommissionRate: number

  closeOnRemovalMode?: string
}

export declare type CopyFactoryStrategyCommissionScheme = {

  type: string,

  billingPeriod: string,

  commissionRate: number
}

export declare type CopyFactoryStrategyMagicFilter = {

  included: Array<String>,

  excluded: Array<String>

  publishing: StrategyTelegramPublishingSettings;
}

export declare type StrategyTelegramPublishingSettings = {

  token: string;

  chatId: string;

  template: string;
}

export declare type CopyFactoryStrategyEquityCurveFilter = {

  period: number,

  timeframe: string
}

export declare type CopyFactoryStrategyDrawdownFilter = {

  maxDrawdown: number,

  action: string
}

export declare type CopyFactoryStrategyUpdate = {

  name: string,

  description: string,

  accountId: string,

  skipPendingOrders?: boolean,

  commissionScheme?: CopyFactoryStrategyCommissionScheme,

  maxTradeRisk?: number,

  reverse?: boolean,

  reduceCorrelations?: string,

  symbolFilter?: CopyFactoryStrategySymbolFilter,

  newsFilter?: CopyFactoryStrategyNewsFilter,

  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  maxLeverage?: number,

  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  copyStopLoss?: boolean,

  copyTakeProfit?: boolean,

  allowedSides?: string[],

  minTradeVolume?: number,

  maxTradeVolume?: number,

  signalDelay?: StrategySignalDelay,

  magicFilter?: CopyFactoryStrategyMagicFilter,

  equityCurveFilter?: CopyFactoryStrategyEquityCurveFilter,

  drawdownFilter?: CopyFactoryStrategyDrawdownFilter,

  symbolsTraded?: Array<String>,

  timeSettings?: CopyFactoryStrategyTimeSettings,

  telegram?: StrategyTelegramSettings;
}

export declare type CopyFactoryCloseInstructions = {

  mode?: string,

  skipPendingOrders?: boolean,

  maxTradeRisk: number,

  reverse?: boolean,

  reduceCorrelations?: string,

  symbolFilter?: CopyFactoryStrategySymbolFilter,

  newsFilter?: CopyFactoryStrategyNewsFilter,

  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  maxLeverage?: number,

  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  copyStopLoss?: boolean,

  copyTakeProfit?: boolean,

  allowedSides?: string[],

  minTradeVolume?: number,

  maxTradeVolume?: number,

  signalDelay?: StrategySignalDelay,

  closeOnRemovalMode?: string
}

export declare type CopyFactoryPortfolioStrategyUpdate = {

  name: string,

  description: string,

  members: Array<CopyFactoryPortfolioStrategyMember>,

  
  commissionScheme?: CopyFactoryStrategyCommissionScheme,

  skipPendingOrders?: boolean,

  maxTradeRisk?: number,

  reverse?: boolean,

  reduceCorrelations?: string,

  symbolFilter?: CopyFactoryStrategySymbolFilter,

  newsFilter?: CopyFactoryStrategyNewsFilter,

  riskLimits?: Array<CopyFactoryStrategyRiskLimit>,

  maxStopLoss?: CopyFactoryStrategyMaxStopLoss,

  maxLeverage?: number,

  symbolMapping?: Array<CopyFactoryStrategySymbolMapping>,

  tradeSizeScaling?: CopyFactoryStrategyTradeSizeScaling,

  copyStopLoss?: boolean,

  copyTakeProfit?: boolean,

  allowedSides?: string[],

  minTradeVolume?: number,

  maxTradeVolume?: number,

  signalDelay?: StrategySignalDelay
}

export declare type CopyFactoryPortfolioStrategy = CopyFactoryPortfolioStrategyUpdate & {

  _id: string,

  platformCommissionRate: number

  closeOnRemovalMode?: string
}