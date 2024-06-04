'use strict';

import MetaApiClient from '../metaApi.client';
import TransactionListenerManager from './streaming/transactionListenerManager';

export default class HistoryClient extends MetaApiClient {

  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._transactionListenerManager = new TransactionListenerManager(domainClient);
  }
  async getProvidedTransactions(from, till, strategyIds, subscriberIds, offset, limit) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getProvidedTransactions');
    }
    let params = {
      from,
      till
    };
    if (strategyIds) {
      params.strategyId = strategyIds;
    }
    if (subscriberIds) {
      params.subscriberId = subscriberIds;
    }
    if (offset !== undefined) {
      params.offset = offset;
    }
    if (limit) {
      params.limit = limit;
    }
    const opts = {
      url: '/users/current/provided-transactions',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    let transactions = await this._domainClient.requestCopyFactory(opts, true);
    transactions.forEach(t => t.time = new Date(t.time));
    return transactions;
  }

  async getSubscriptionTransactions(from, till, strategyIds, subscriberIds, offset, limit) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSubscriptionTransactions');
    }
    let params = {
      from,
      till
    };
    if (strategyIds) {
      params.strategyId = strategyIds;
    }
    if (subscriberIds) {
      params.subscriberId = subscriberIds;
    }
    if (offset !== undefined) {
      params.offset = offset;
    }
    if (limit) {
      params.limit = limit;
    }
    const opts = {
      url: '/users/current/subscription-transactions',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    let transactions = await this._domainClient.requestCopyFactory(opts, true);
    transactions.forEach(t => t.time = new Date(t.time));
    return transactions;
  }

  addStrategyTransactionListener(listener, strategyId, startTime) {
    return this._transactionListenerManager.addStrategyTransactionListener(listener, strategyId, startTime);
  }

  removeStrategyTransactionListener(listenerId) {
    this._transactionListenerManager.removeStrategyTransactionListener(listenerId);
  }

  addSubscriberTransactionListener(listener, subscriberId, startTime) {
    return this._transactionListenerManager.addSubscriberTransactionListener(listener, subscriberId, startTime);
  }

  removeSubscriberTransactionListener(listenerId) {
    this._transactionListenerManager.removeSubscriberTransactionListener(listenerId);
  }

}
