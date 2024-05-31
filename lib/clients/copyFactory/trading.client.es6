'use strict';

import MetaApiClient from '../metaApi.client';
import SignalClient from './signal.client';
import StopoutListenerManager from './streaming/stopoutListenerManager';
import UserLogListenerManager from './streaming/userLogListenerManager';

/**
 * metaapi.cloud CopyFactory trading API (trade copying trading API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class TradingClient extends MetaApiClient {

  /**
   * Constructs CopyFactory trading API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._stopoutListenerManager = new StopoutListenerManager(domainClient);
    this._userLogListenerManager = new UserLogListenerManager(domainClient);
  }

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
  async resynchronize(accountId, strategyIds, positionIds) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resynchronize');
    }
    const opts = {
      url: `/users/current/subscribers/${accountId}/resynchronize`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      params: {
        strategyId: strategyIds,
        positionId: positionIds
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Generates an instance of signal client for an account
   * @param {String} accountId account id
   */
  async getSignalClient(accountId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSignalClient');
    }

    let accountData = await this._domainClient.getAccountInfo(accountId);
    const host = await this._domainClient.getSignalClientHost(accountData.regions);
    return new SignalClient(accountData.id, host, this._domainClient);
  }

  /**
   * CopyFactory strategy stopout reason
   * @typedef {'day-balance-difference' | 'date-balance-difference' | 'week-balance-difference' |
   * 'week-to-date-balance-difference' | 'month-balance-difference' | 'month-to-date-balance-difference' |
   * 'quarter-balance-difference' | 'quarter-to-date-balance-difference' | 'year-balance-difference' |
   * 'year-to-date-balance-difference' | 'lifetime-balance-difference' | 'day-balance-minus-equity' |
   * 'date-balance-minus-equity' | 'week-balance-minus-equity' | 'week-to-date-balance-minus-equity' |
   * 'month-balance-minus-equity' | 'month-to-date-balance-minus-equity' |
   * 'quarter-balance-minus-equity' | 'quarter-to-date-balance-minus-equity' | 'year-balance-minus-equity' |
   * 'year-to-date-balance-minus-equity' | 'lifetime-balance-minus-equity' |
   * 'day-equity-difference' | 'date-equity-difference' | 'week-equity-difference' |
   * 'week-to-date-equity-difference' | 'month-equity-difference' |
   * 'month-to-date-equity-difference' | 'quarter-equity-difference' | 'quarter-to-date-equity-difference' |
   * 'year-equity-difference' | 'year-to-date-equity-difference' |
   * 'lifetime-equity-difference'} CopyFactoryStrategyStopoutReason
   */

  /**
   * CopyFactory strategy stopout
   * @typedef {Object} CopyFactoryStrategyStopout
   * @property {String} subscriberId subscriber id
   * @property {CopyFactoryStrategyIdAndName} strategy strategy which was stopped out
   * @property {Boolean} partial flag indicating that stopout is partial
   * @property {CopyFactoryStrategyStopoutReason} reason stopout reason
   * @property {String} reasonDescription human-readable description of the stopout reason
   * @property {Boolean} [closePositions] flag indicating if positions should be closed
   * @property {Date} stoppedAt time the strategy was stopped at
   * @property {Date} stoppedTill time the strategy is stopped till
   * @property {Number} sequenceNumber stopout event sequence number
   */

  /**
   * Returns subscriber account stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/getStopOuts/
   * @param {String} subscriberId subscriber id
   * @return {Promise<Array<CopyFactoryStrategyStopout>>} promise which resolves with stopouts found
   */
  async getStopouts(subscriberId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStopouts');
    }
    const opts = {
      url: `/users/current/subscribers/${subscriberId}/stopouts`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Resets subscription stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetSubscriptionStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {String} strategyId strategy id
   * @param {CopyFactoryStrategyStopoutReason} reason stopout reason to reset
   * yearly-equity, monthly-equity, daily-equity
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  resetSubscriptionStopouts(subscriberId, strategyId, reason) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resetSubscriptionStopouts');
    }
    const opts = {
      url: `/users/current/subscribers/${subscriberId}/subscription-strategies/` +
        `${strategyId}/stopouts/${reason}/reset`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Resets subscriber stopouts. See
   * https://metaapi.cloud/docs/copyfactory/restApi/api/trading/resetSubscriberStopOuts/
   * @param {String} subscriberId subscriber id
   * @param {CopyFactoryStrategyStopoutReason} reason stopout reason to reset
   * yearly-equity, monthly-equity, daily-equity
   * @return {Promise} promise which resolves when the stopouts are reset
   */
  resetSubscriberStopouts(subscriberId, reason) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('resetSubscriberStopouts');
    }
    const opts = {
      url: `/users/current/subscribers/${subscriberId}/stopouts/${reason}/reset`,
      method: 'POST',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  /**
   * Trade copying user log record
   * @typedef {Object} CopyFactoryUserLogMessage
   * @property {Date} time log record time
   * @property {string} [symbol] symbol traded
   * @property {string} [strategyId] id of the strategy event relates to
   * @property {string} [strategyName] name of the strategy event relates to
   * @property {string} [positionId] position id event relates to
   * @property {string} [side] side of the trade event relates to. One of buy, sell, close
   * @property {string} [type] type of the trade event relates to. One of market, limit, stop
   * @property {number} [openPrice] open price for limit and stop orders
   * @property {string} level log level. One of INFO, WARN, ERROR
   * @property {string} message log message
   */

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
  async getUserLog(subscriberId, startTime, endTime, strategyId, positionId, level, offset = 0, limit = 1000) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getUserLog');
    }
    const opts = {
      url: `/users/current/subscribers/${subscriberId}/user-log`,
      method: 'GET',
      params: {
        startTime,
        endTime,
        strategyId, 
        positionId, 
        level,
        offset,
        limit
      },
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    let result = await this._domainClient.requestCopyFactory(opts, true);
    if (result) {
      result.map(r => r.time = new Date(r.time));
    }
    return result;
  }

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
  async getStrategyLog(strategyId, startTime, endTime, positionId, level, offset = 0, limit = 1000) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategyLog');
    }
    const opts = {
      url: `/users/current/strategies/${strategyId}/user-log`,
      method: 'GET',
      params: {
        startTime,
        endTime,
        positionId,
        level,
        offset,
        limit
      },
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    let result = await this._domainClient.requestCopyFactory(opts, true);
    if (result) {
      result.map(r => r.time = new Date(r.time));
    }
    return result;
  }

  /**
   * Adds a stopout listener and creates a job to make requests
   * @param {StopoutListener} listener stopout listener
   * @param {String} [accountId] account id
   * @param {String} [strategyId] strategy id
   * @param {Number} [sequenceNumber] sequence number
   * @return {String} listener id
   */
  addStopoutListener(listener, accountId, strategyId, sequenceNumber) {
    return this._stopoutListenerManager.addStopoutListener(listener, accountId, strategyId, sequenceNumber);
  }

  /**
   * Removes stopout listener and cancels the event stream
   * @param {String} listenerId stopout listener id
   */
  removeStopoutListener(listenerId) {
    this._stopoutListenerManager.removeStopoutListener(listenerId);
  }

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
  addStrategyLogListener(listener, strategyId, startTime, positionId, level, limit) {
    return this._userLogListenerManager.addStrategyLogListener(
      listener, 
      strategyId, 
      startTime, 
      positionId, 
      level, 
      limit
    );
  }

  /**
   * Removes strategy log listener and cancels the event stream
   * @param {String} listenerId strategy log listener id
   */
  removeStrategyLogListener(listenerId) {
    this._userLogListenerManager.removeStrategyLogListener(listenerId);
  }

  /**
   * Adds a subscriber log listener and creates a job to make requests
   * @param {UserLogListener} listener user log listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] log search start time
   * @param {string} [strategyId] strategy id filter
   * @param {string} [positionId] position id filter
   * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} [level] minimum severity level
   * @param {Number} [limit] log pagination limit
   * @return {String} listener id
   */
  addSubscriberLogListener(listener, subscriberId, startTime, strategyId, positionId, level, limit) {
    return this._userLogListenerManager.addSubscriberLogListener(
      listener, 
      subscriberId, 
      startTime, 
      strategyId, 
      positionId, 
      level, 
      limit
    );
  }

  /**
   * Removes subscriber log listener and cancels the event stream
   * @param {String} listenerId subscriber log listener id
   */
  removeSubscriberLogListener(listenerId) {
    this._userLogListenerManager.removeSubscriberLogListener(listenerId);
  }

}
