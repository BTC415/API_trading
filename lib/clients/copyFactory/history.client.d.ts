import MetaApiClient from "../metaApi.client";
import DomainClient from "../domain.client";
import TransactionListener from "./streaming/transactionListener";
/**
 * metaapi.cloud CopyFactory history API (trade copying history API) client (see
 * https://metaapi.cloud/docs/copyfactory/)
 */
export default class HistoryClient extends MetaApiClient {

  /**
   * Constructs CopyFactory history API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient: DomainClient);

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
  getProvidedTransactions(from: Date, till: Date, strategyIds?: Array<String>, subscriberIds?: Array<String>, offset?: number, limit?: number): Promise<Array<CopyFactoryTransaction>>;

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
  getSubscriptionTransactions(from: Date, till: Date, strategyIds?: Array<String>, subscriberIds?: Array<String>, offset?: number, limit?: number): Promise<Array<CopyFactoryTransaction>>;

  /**
   * Adds a strategy transaction listener and creates a job to make requests
   * @param {TransactionListener} listener transaction listener
   * @param {string} strategyId strategy id
   * @param {Date} [startTime] transaction search start time
   * @return {string} listener id
   */
  addStrategyTransactionListener(listener: TransactionListener, strategyId: string, startTime?: Date): string;

  /**
   * Removes strategy transaction listener and cancels the event stream
   * @param {string} listenerId strategy transaction listener id
   */
  removeStrategyTransactionListener(listenerId: string): void;

  /**
   * Adds a subscriber transaction listener and creates a job to make requests
   * @param {TransactionListener} listener transaction listener
   * @param {string} subscriberId subscriber id
   * @param {Date} [startTime] transaction search start time
   * @return {string} listener id
   */
  addSubscriberTransactionListener(listener: TransactionListener, subscriberId: string, startTime?: Date): string;

  /**
   * Removes subscriber transaction listener and cancels the event stream
   * @param {string} listenerId subscriber transaction listener id
   */
  removeSubscriberTransactionListener(listenerId: string): string;
}

/**
 * CopyFactory provider or subscriber user
 */
export declare type CopyFactorySubscriberOrProviderUser = {

  /**
   * profile id
   */
  id: string,

  /**
   * user name
   */
  name: string,

  /**
   * array of strategy IDs provided by provider or subscribed to by subscriber
   */
  strategies?: Array<CopyFactoryStrategyIdAndName>
}

/**
 * CopyFactory strategy id and name
 */
export declare type CopyFactoryStrategyIdAndName = {
  
  /**
   * unique strategy id
   */
  id: string,

  /**
   * human-readable strategy name
   */
  name: string
}

/**
 * CopyFactory transaction
 */
export declare type CopyFactoryTransaction = {

  /**
   * transaction id
   */
  id: string,

  /**
   * transaction type (one of DEAL_TYPE_BUY, DEAL_TYPE_SELL, DEAL_TYPE_BALANCE,
   * DEAL_TYPE_CREDIT, DEAL_TYPE_CHARGE, DEAL_TYPE_CORRECTION, DEAL_TYPE_BONUS, DEAL_TYPE_COMMISSION,
   * DEAL_TYPE_COMMISSION_DAILY, DEAL_TYPE_COMMISSION_MONTHLY, DEAL_TYPE_COMMISSION_AGENT_DAILY,
   * DEAL_TYPE_COMMISSION_AGENT_MONTHLY, DEAL_TYPE_INTEREST, DEAL_TYPE_BUY_CANCELED, DEAL_TYPE_SELL_CANCELED,
   * DEAL_DIVIDEND, DEAL_DIVIDEND_FRANKED, DEAL_TAX). See
   * https://www.mql5.com/en/docs/constants/tradingconstants/dealproperties#enum_deal_type
   */
  type: string,

  /**
   * transaction time
   */
  time: Date,

  /**
   * CopyFactory subscriber id
   */
  subscriberId: string,

  /**
   * symbol traded
   */
  symbol?: string,

  /**
   * strategy subscriber
   */
  subscriberUser: CopyFactorySubscriberOrProviderUser,

  /**
   * demo account flag
   */
  demo: boolean,

  /**
   * strategy provider
   */
  providerUser: CopyFactorySubscriberOrProviderUser,

  /**
   * strategy
   */
  strategy: CopyFactoryStrategyIdAndName,

  /**
   * source position id
   */
  positionId?: string,

  /**
   * slave position id
   */
  slavePositionId?: string,

  /**
   * high-water mark strategy balance improvement
   */
  improvement: number,

  /**
   * provider commission
   */
  providerCommission: number,

  /**
   * platform commission
   */
  platformCommission: number,

  /**
   * commission paid by provider to underlying providers
   */
  incomingProviderCommission?: number,

  /**
   * platform commission paid by provider to underlying providers
   */
  incomingPlatformCommission?: number,

  /**
   * trade volume
   */
  quantity?: number,

  /**
   * trade lot price
   */
  lotPrice?: number,

  /**
   * trade tick price
   */
  tickPrice?: number,

  /**
   * trade amount
   */
  amount?: number,

  /**
   * trade commission
   */
  commission?: number,

  /**
   * trade swap 
   */
  swap: number,

  /**
   * trade profit
   */
  profit: number,

  /**
   * trade copying metrics such as slippage and latencies. Measured
   * selectively for copied trades
   */
  metrics?: CopyFactoryTransactionMetrics
}

/**
 * Trade copying metrics such as slippage and latencies
 */
export declare type CopyFactoryTransactionMetrics = {

  /**
   * trade copying latency, measured in milliseconds based on transaction time
   * provided by broker
   */
  tradeCopyingLatency?: number,

  /**
   * trade copying slippage, measured in basis points (0.01
   * percent) based on transaction price provided by broker
   */
  tradeCopyingSlippageInBasisPoints?: number,

  /**
   * trade copying slippage, measured in account currency
   * based on transaction price provided by broker
   */
  tradeCopyingSlippageInAccountCurrency?: number,

  /**
   * trade signal latency introduced by broker and MT platform, measured
   * in milliseconds
   */
  mtAndBrokerSignalLatency?: number,

  /**
   * trade algorithm latency introduced by CopyFactory servers, measured in
   * milliseconds
   */
  tradeAlgorithmLatency?: number,

  /**
   * trade latency for a copied trade introduced by broker and MT platform,
   * measured in milliseconds
   */
  mtAndBrokerTradeLatency?: number
}
