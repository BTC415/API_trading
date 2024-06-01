'use strict';

import MetaApiClient from '../metaApi.client';
import SignalClient from './signal.client';
import StopoutListenerManager from './streaming/stopoutListenerManager';
import UserLogListenerManager from './streaming/userLogListenerManager';

export default class TradingClient extends MetaApiClient {

  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._stopoutListenerManager = new StopoutListenerManager(domainClient);
    this._userLogListenerManager = new UserLogListenerManager(domainClient);
  }

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

  async getSignalClient(accountId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSignalClient');
    }

    let accountData = await this._domainClient.getAccountInfo(accountId);
    const host = await this._domainClient.getSignalClientHost(accountData.regions);
    return new SignalClient(accountData.id, host, this._domainClient);
  }

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

  addStopoutListener(listener, accountId, strategyId, sequenceNumber) {
    return this._stopoutListenerManager.addStopoutListener(listener, accountId, strategyId, sequenceNumber);
  }

  removeStopoutListener(listenerId) {
    this._stopoutListenerManager.removeStopoutListener(listenerId);
  }

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

  removeStrategyLogListener(listenerId) {
    this._userLogListenerManager.removeStrategyLogListener(listenerId);
  }

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

  removeSubscriberLogListener(listenerId) {
    this._userLogListenerManager.removeSubscriberLogListener(listenerId);
  }

}
