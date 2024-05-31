import ConfigurationClient from "./clients/copyFactory/configuration.client";
import HistoryClient from "./clients/copyFactory/history.client";
import TradingClient from "./clients/copyFactory/trading.client";

/**
 * MetaApi CopyFactory copy trading API SDK
 */
export default class CopyFactory {

  /**
   * Constructs CopyFactory class instance
   * @param {String} token authorization token
   * @param {Object} opts connection options
   * @param {String} [opts.domain] domain to connect to
   * @param {String} [opts.extendedTimeout] timeout for extended http requests in seconds
   * @param {Number} [opts.requestTimeout] timeout for http requests in seconds
   */
  constructor(token: string, opts?: Object);

  /**
   * Returns CopyFactory configuration API
   * @returns {ConfigurationClient} configuration API
   */
  get configurationApi(): ConfigurationClient;

  /**
   * Returns CopyFactory history API
   * @return {HistoryClient} history API
   */
  get historyApi(): HistoryClient;

  /**
   * Returns CopyFactory trading API
   * @return {TradingClient} trading API
   */
  get tradingApi(): TradingClient
}