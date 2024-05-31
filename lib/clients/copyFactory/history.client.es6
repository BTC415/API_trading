'use strict';

import MetaApiClient from '../metaApi.client';
import TransactionListenerManager from './streaming/transactionListenerManager';

/**
 * metaapi.cloud CopyFactory history API (trade copying history API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class HistoryClient extends MetaApiClient {

  /**
   * Constructs CopyFactory history API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
    this._transactionListenerManager = new TransactionListenerManager(domainClient);
  }

  /**
   * CopyFactory provider or subscriber user
   * @typedef {Object} CopyFactorySubscriberOrProviderUser
   * @property {String} id profile id
   * @property {String} name user name
   * @property {Array<CopyFactoryStrategyIdAndName>} strategies array of strategy IDs provided by provider
   * or subscribed to by subscriber
   */

  /**
   * CopyFactory strategy id and name
   * @typedef {Object} CopyFactoryStrategyIdAndName
   * @property {String} id unique strategy id
   * @property {String} name human-readable strategy name
   */

  /**
   * CopyFactory transaction
   * @typedef {Object} CopyFactoryTransaction
   * @property {String} id transaction id
   * @property {String} type transaction type (one of DEAL_TYPE_BUY, DEAL_TYPE_SELL, DEAL_TYPE_BALANCE,
   * DEAL_TYPE_CREDIT, DEAL_TYPE_CHARGE, DEAL_TYPE_CORRECTION, DEAL_TYPE_BONUS, DEAL_TYPE_COMMISSION,
   * DEAL_TYPE_COMMISSION_DAILY, DEAL_TYPE_COMMISSION_MONTHLY, DEAL_TYPE_COMMISSION_AGENT_DAILY,
   * DEAL_TYPE_COMMISSION_AGENT_MONTHLY, DEAL_TYPE_INTEREST, DEAL_TYPE_BUY_CANCELED, DEAL_TYPE_SELL_CANCELED,
   * DEAL_DIVIDEND, DEAL_DIVIDEND_FRANKED, DEAL_TAX). See
   * https://www.mql5.com/en/docs/constants/tradingconstants/dealproperties#enum_deal_type
   * @property {Date} time transaction time
   * @property {String} subscriberId CopyFactory subscriber id
   * @property {String} [symbol] symbol traded
   * @property {CopyFactorySubscriberOrProviderUser} subscriberUser strategy subscriber
   * @property {Boolean} demo demo account flag
   * @property {CopyFactorySubscriberOrProviderUser} providerUser strategy provider
   * @property {CopyFactoryStrategyIdAndName} strategy strategy
   * @property {String} [positionId] source position id
   * @property {String} [slavePositionId] slave position id
   * @property {Number} improvement high-water mark strategy balance improvement
   * @property {Number} providerCommission provider commission
   * @property {Number} platformCommission platform commission
   * @property {Number} [incomingProviderCommission] commission paid by provider to underlying providers
   * @property {Number} [incomingPlatformCommission] platform commission paid by provider to underlying providers
   * @property {Number} [quantity] trade volume
   * @property {Number} [lotPrice] trade lot price
   * @property {Number} [tickPrice] trade tick price
   * @property {Number} [amount] trade amount
   * @property {Number} [commission] trade commission
   * @property {Number} swap trade swap
   * @property {Number} profit trade profit
   * @property {CopyFactoryTransactionMetrics} [metrics] trade copying metrics such as slippage and latencies. Measured
   * selectively for copied trades
   */

  /**
   * Trade copying metrics such as slippage and latencies
   * @typedef {Object} CopyFactoryTransactionMetrics
   * @property {Number} [tradeCopyingLatency] trade copying latency, measured in milliseconds based on transaction time
   * provided by broker
   * @property {Number} [tradeCopyingSlippageInBasisPoints] trade copying slippage, measured in basis points (0.01
   * percent) based on transaction price provided by broker
   * @property {Number} [tradeCopyingSlippageInAccountCurrency] trade copying slippage, measured in account currency
   * based on transaction price provided by broker
   * @property {Number} [mtAndBrokerSignalLatency] trade signal latency introduced by broker and MT platform, measured
   * in milliseconds
   * @property {Number} [tradeAlgorithmLatency] trade algorithm latency introduced by CopyFactory servers, measured in
   * milliseconds
   * @property {Number} [mtAndBrokerTradeLatency] trade latency for a copied trade introduced by broker and MT platform,
   * measured in milliseconds
   */

  /**
   * Returns list of transactions on the strategies the current user provides to other users
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getProvidedTransactions/
   * @param {Date} from time to load transactions from
   * @param {Date} till time to load transactions till
   * @param {Array<string>} [strategyIds] list of strategy ids to filter transactions by
   * @param {Array<string>} [subscriberIds] the list of CopyFactory subscriber account ids to filter by
   * @param {number} [offset] pagination offset. Default value is 0
   * @param {number} [limit] pagination limit. Default value is 1000
   * @return {Promise<Array<CopyFactoryTransaction>>} promise resolving with transactions found
   */
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

  /**
   * Returns list of trades on the strategies the current user subscribed to
   * https://metaapi.cloud/docs/copyfactory/restApi/api/history/getSubscriptionTransactions/
   * @param {Date} from time to load transactions from
   * @param {Date} till time to load transactions till
   * @param {Array<String>} [strategyIds] list of strategy ids to filter transactions by
   * @param {Array<string>} [subscriberIds] the list of CopyFactory subscriber account ids to filter by
   * @param {Number} offset pagination offset. Default value is 0
   * @param {Number} limit pagination limit. Default value is 1000
   * @return {Promise<Array<CopyFactoryTransaction>>} promise resolving with transactions found
   */
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

  /**
   * Adds a strategy transaction listener and creates a job to make requests
   * @param {TransactionListener} listener transaction listener
   * @param {String} strategyId strategy id
   * @param {Date} [startTime] transaction search start time
   * @return {String} listener id
   */
  addStrategyTransactionListener(listener, strategyId, startTime) {
    return this._transactionListenerManager.addStrategyTransactionListener(listener, strategyId, startTime);
  }

  /**
   * Removes strategy transaction listener and cancels the event stream
   * @param {String} listenerId strategy transaction listener id
   */
  removeStrategyTransactionListener(listenerId) {
    this._transactionListenerManager.removeStrategyTransactionListener(listenerId);
  }

  /**
   * Adds a subscriber transaction listener and creates a job to make requests
   * @param {TransactionListener} listener transaction listener
   * @param {String} subscriberId subscriber id
   * @param {Date} [startTime] transaction search start time
   * @return {String} listener id
   */
  addSubscriberTransactionListener(listener, subscriberId, startTime) {
    return this._transactionListenerManager.addSubscriberTransactionListener(listener, subscriberId, startTime);
  }

  /**
   * Removes subscriber transaction listener and cancels the event stream
   * @param {String} listenerId subscriber transaction listener id
   */
  removeSubscriberTransactionListener(listenerId) {
    this._transactionListenerManager.removeSubscriberTransactionListener(listenerId);
  }

}
