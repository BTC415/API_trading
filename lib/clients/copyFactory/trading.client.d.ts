import DomainClient from "../domain.client";
import MetaApiClient from "../metaApi.client";
import { CopyFactoryStrategyIdAndName } from "./history.client";
import SignalClient from "./signal.client";
import StopoutListener from "./streaming/stopoutListener";
import UserLogListener from "./streaming/userLogListener";

/**
 * metaapi.cloud CopyFactory trading API (trade copying trading API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class TradingClient extends MetaApiClient {

  /**
   * Constructs CopyFactory trading API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

  /**
   * Resynchronizes the account. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resynchronize/
   * @param {String} accountId account id
   * @param {Array<String>} [strategyIds] array of strategy ids to recynchronize. Default is to synchronize all
   * strategies
   * @param {Array<String>} [positionIds] array of position ids to resynchronize. Default is to synchronize all
   * positions
   * @return {Promise} promise which resolves when resynchronization is scheduled
   */
  resynchronize(accountId: string, strategyIds?: Array<String>, positionIds?: Array<String>): Promise<any>;

  /**
   * Generates an instance of signal client for an account
   * @param {String} accountId account id
   * @returns {Promise<SignalClient>}
   */
  getSignalClient(accountId: string): Promise<SignalClient>;

  /**
   * Returns subscriber account stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getStopOuts/
   * @param {String} subscriberId subscriber id
   * @return {Promise<Array<CopyFactoryStrategyStopout>>} promise which resolves with stopouts found
   */
  getStopouts(subscriberId: string): Promise<Array<CopyFactoryStrategyStopout>>;

  /**
   * Resets subscription stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetSubscriptionStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {CopyFactoryStrategyStopoutReason} reason stopout reason to reset
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  resetSubscriptionStopouts(subscriberId: string, strategyId: string, reason: CopyFactoryStrategyStopoutReason): Promise<any>;

  /**
   * Resets subscriber stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetSubscriberStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactoryStrategyStopoutReason} reason stopout reason to reset
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  resetSubscriberStopouts(subscriberId: string, reason: CopyFactoryStrategyStopoutReason): Promise<any>;

  /**
   * Returns copy trading user log for an account and time range. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getUserLog/
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] time to start loading data from
   * @param {Date} [endTime] time to stop loading data at
   * @param {String} [strategyId] strategy id filter
   * @param {String} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [offset] pagination offset. Default is 0
   * @param {Number} [limit] pagination limit. Default is 1000
   * @return {Promise<Array<CopyFactoryUserLogMessage>>} promise which resolves with log records found
   */
  getUserLog(subscriberId: string, startTime?: Date, endTime?: Date, strategyId?: string, positionId?: string, level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', offset?: number, limit?: number): Promise<Array<CopyFactoryUserLogMessage>>;

  /**
   * Returns event log for CopyFactory strategy, sorted in reverse chronological order. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getStrategyLog/ 
   * @param {String} strategyId strategy id to retrieve log for
   * @param {Date} [startTime] time to start loading data from
   * @param {Date} [endTime] time to stop loading data at
   * @param {String} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [offset] pagination offset. Default is 0
   * @param {Number} [limit] pagination limit. Default is 1000
   * @return {Promise<Array<CopyFactoryUserLogMessage>>} promise which resolves with log records found
   */
  getStrategyLog(strategyId: string, startTime?: Date, endTime?: Date, positionId?: string, level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', offset?: number, limit?: number): Promise<Array<CopyFactoryUserLogMessage>>;

  /**
   * Adds a stopout listener and creates a job to make requests
   * @param {StopoutListener} listener stopout listener
   * @param {String} [accountId] account id
   * @param {String} [strategyId] strategy id
   * @param {Number} [sequenceNumber] sequence number
   * @return {String} listener id
   */
  addStopoutListener(listener: StopoutListener, accountId?: string, strategyId?: string, sequenceNumber?: number): string;

  /**
   * Removes stopout listener and cancels the event stream
   * @param {String} listenerId stopout listener id
   */
  removeStopoutListener(listenerId: string): void;

  /**
   * Adds a strategy log listener and creates a job to make requests
   * @param {UserLogListener} listener user log listener
   * @param {String} strategyId strategy id
   * @param {Date} [startTime] log search start time
   * @param {String} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [limit] log pagination limit
   * @return {String} listener id
   */
   addStrategyLogListener(listener: UserLogListener, strategyId: string, startTime?: Date, positionId?: string, level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', limit?: number): string;

  /**
   * Removes strategy log listener and cancels the event stream
   * @param {String} listenerId strategy log listener id
   */
  removeStrategyLogListener(listenerId: string): void;

  /**
   * Adds a subscriber log listener and creates a job to make requests
   * @param {UserLogListener} listener user log listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] log search start time
   * @param {String} [strategyId] strategy id filter
   * @param {String} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [limit] log pagination limit
   * @return {String} listener id
   */
  addSubscriberLogListener(listener: UserLogListener, subscriberId: string, startTime?: Date, strategyId?: string, positionId?: string, level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', limit?: number): string;

  /**
   * Removes subscriber log listener and cancels the event stream
   * @param {String} listenerId subscriber log listener id
   */
  removeSubscriberLogListener(listenerId: string): void;

}

/**
 * CopyFactory strategy stopout reason
 */
export declare type CopyFactoryStrategyStopoutReason = 'day-balance-difference' | 'date-balance-difference' |
    'week-balance-difference' | 'week-to-date-balance-difference' |
    'month-balance-difference' | 'month-to-date-balance-difference' | 'quarter-balance-difference' |
    'quarter-to-date-balance-difference' | 'year-balance-difference' |
    'year-to-date-balance-difference' | 'lifetime-balance-difference' | 'day-balance-minus-equity' |
    'date-balance-minus-equity' | 'week-balance-minus-equity' | 'week-to-date-balance-minus-equity' |
    'month-balance-minus-equity' | 'month-to-date-balance-minus-equity' |
    'quarter-balance-minus-equity' | 'quarter-to-date-balance-minus-equity' | 'year-balance-minus-equity' |
    'year-to-date-balance-minus-equity' | 'lifetime-balance-minus-equity' |
    'day-equity-difference' | 'date-equity-difference' | 'week-equity-difference' |
    'week-to-date-equity-difference' | 'month-equity-difference' |
    'month-to-date-equity-difference' | 'quarter-equity-difference' | 'quarter-to-date-equity-difference' |
    'year-equity-difference' | 'year-to-date-equity-difference' | 'lifetime-equity-difference';

/**
 * CopyFactory external signal update payload
 */
export declare type CopyFactoryExternalSignalUpdate = {

  /**
   * trade symbol
   */
  symbol: string,

  /**
   * trade type (one of POSITION_TYPE_BUY, POSITION_TYPE_SELL, ORDER_TYPE_BUY_LIMIT, ORDER_TYPE_SELL_LIMIT, 
   * ORDER_TYPE_BUY_STOP, ORDER_TYPE_SELL_STOP)
   */
  type: string,

  /**
   * time the signal was emitted at
   */
  time: Date,

  /**
   * last time of the signal update
   */
  updateTime?: Date,

  /**
   * volume traded
   */
  volume: number,
  
  /**
   * expert advisor id
   */
  magic?: number,

  /**
   * stop loss price
   */
  stopLoss?: number,

  /**
   * take profit price
   */
  takeProfit?: number,

  /**
   * pending order open price
   */
  openPrice?: number
}

/**
 * CopyFactory trading signal
 */
export declare type CopyFactoryTradingSignal = {

  /**
   * strategy the signal arrived from
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * id of the position the signal was generated from
   */
  positionId: string,

  /**
   * signal time
   */
  time: Date,

  /**
   * symbol traded
   */
  symbol: string,

  /**
   * type of the trade (one of market, limit, stop)
   */
  type: string,

  /**
   * side of the trade (one of buy, sell, close)
   */
  side: string,

  /**
   * open price for limit and stop orders
   */
  openPrice?: number,

  /**
   * stop loss price
   */
  stopLoss?: number,

  /**
   * take profit price
   */
  takeProfit?: number,

  /**
   * the signal volume
   */
  signalVolume: number,

  /**
   * the volume already open on subscriber side
   */
  subscriberVolume: number,

  /**
   * total profit of the position on subscriber side
   */
  subscriberProfit: number,

  /**
   * the time the signal will be automatically closed at
   */
  closeAfter: Date,

  /**
   * flag indicating that only closing side of this signal will be copied
   */
  closeOnly?: boolean
}

/**
 * CopyFactory external signal remove payload
 */
export declare type CopyFactoryExternalSignalRemove = {

  /**
   * the time signal was removed (closed) at
   */
  time: Date
}

/**
 * CopyFactory strategy stopout
 */
export declare type CopyFactoryStrategyStopout = {

  /**
   * Subscriber id
   */
  subscriberId: string,

  /**
   * strategy which was stopped out
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * flag indicating that stopout is partial
   */
  partial: boolean,

  /**
   * stopout reason
   */
  reason: CopyFactoryStrategyStopoutReason,

  /**
   * human-readable description of the stopout reason
   */
  reasonDescription: string,

  /**
   * flag indicating if positions should be closed
   */
  closePositions?: boolean,

  /**
   * time the strategy was stopped at
   */
  stoppedAt: Date,

  /**
   * time the strategy is stopped till
   */
  stoppedTill: Date,

  /**
   * Stopout event sequence number
   */
  sequenceNumber: number
}

/**
 * Trade copying user log record
 */
export declare type CopyFactoryUserLogMessage = {

  /**
   * log record time
   */
  time: Date,

  /**
   * symbol traded
   */
  symbol?: string,

  /**
   * id of the strategy event relates to
   */
  strategyId?: string,
  
  /**
   * name of the strategy event relates to
   */
  strategyName?: string,

  /**
   * position id event relates to
   */
  positionId?: string,

  /**
   * side of the trade event relates to. One of buy, sell, close
   */
  side?: string,

  /**
   * type of the trade event relates to. One of market, limit, stop
   */
  type?: string,

  /**
   * open price for limit and stop orders
   */
  openPrice?: number,

  /**
   * log level. One of INFO, WARN, ERROR
   */
  level: string,

  /**
   * log message
   */
  message: string
}