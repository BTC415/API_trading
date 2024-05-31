'use strict';

import HttpClient from './clients/httpClient';
import ConfigurationClient from './clients/copyFactory/configuration.client';
import HistoryClient from './clients/copyFactory/history.client';
import TradingClient from './clients/copyFactory/trading.client';
import DomainClient from './clients/domain.client';
import LoggerManager from './logger';

/**
 * MetaApi CopyFactory copy trading API SDK
 */
export default class CopyFactory {

  /**
   * Enables using Log4js logger with extended log levels for debugging instead of
   * console.* functions. Note that log4js configuration performed by the user.
   */
  static enableLog4jsLogging() {
    LoggerManager.useLog4js();
  }

  /**
   * Constructs CopyFactory class instance
   * @param {String} token authorization token
   * @param {Object} opts connection options
   * @param {String} [opts.domain] domain to connect to
   * @param {String} [opts.extendedTimeout] timeout for extended http requests in seconds
   * @param {Number} [opts.requestTimeout] timeout for http requests in seconds
   */
  constructor(token, opts = {}) {
    this._domain = opts.domain || 'agiliumtrade.agiliumtrade.ai';
    let requestTimeout = opts.requestTimeout || 10;
    let requestExtendedTimeout = opts.extendedTimeout || 70;
    const retryOpts = opts.retryOpts || {};
    this._httpClient = new HttpClient(requestTimeout, requestExtendedTimeout, retryOpts);
    this._domainClient = new DomainClient(this._httpClient, token, this._domain);
    this._configurationClient = new ConfigurationClient(this._domainClient);
    this._historyClient = new HistoryClient(this._domainClient);
    this._tradingClient = new TradingClient(this._domainClient);
  }

  /**
   * Returns CopyFactory configuration API
   * @returns {ConfigurationClient} configuration API
   */
  get configurationApi() {
    return this._configurationClient;
  }

  /**
   * Returns CopyFactory history API
   * @return {HistoryClient} history API
   */
  get historyApi() {
    return this._historyClient;
  }

  /**
   * Returns CopyFactory trading API
   * @return {TradingClient} trading API
   */
  get tradingApi() {
    return this._tradingClient;
  }
}
