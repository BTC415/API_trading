'use strict';

import any from 'promise.any';

/**
 * Connection URL and request managing client
 */
export default class DomainClient {

  /**
   * Constructs domain client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {String} token authorization token
   * @param {String} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient, token, domain = 'agiliumtrade.agiliumtrade.ai') {
    this._httpClient = httpClient;
    this._domain = domain;
    this._token = token;
    this._urlCache = null;
    this._regionCache = [];
    this._regionIndex = 0;
  }

  /**
   * Returns domain client domain
   * @returns {String} client domain
   */
  get domain() {
    return this._domain;
  }

  /**
   * Returns domain client token
   * @returns {String} client token
   */
  get token() {
    return this._token;
  }

  /**
   * Sends a CopyFactory API request
   * @param {Object} opts options request options
   * @param {Boolean} isExtendedTimeout whether to run the request with an extended timeout
   * @returns {Object|String|any} request result
   */
  async requestCopyFactory(opts, isExtendedTimeout = false) {
    await this._updateHost();
    const regionIndex = this._regionIndex;
    try {
      return await this._httpClient.request(Object.assign({}, opts, {
        url: this._urlCache.url + opts.url
      }), isExtendedTimeout);
    } catch (err) {
      if(!['ConflictError', 'InternalError', 'ApiError', 'TimeoutError'].includes(err.name)) {
        throw err;
      } else {
        if(this._regionCache.length === this._regionIndex + 1) {
          this._regionIndex = 0;
          throw err;
        } else {
          if(this._regionIndex === regionIndex) {
            this._regionIndex++;
          }
          return await this.requestCopyFactory(opts, isExtendedTimeout);
        }
      }
    }

  }

  /**
   * Sends an http request
   * @param {Object} opts options request options
   * @returns {Object|String|any} request result
   */
  request(opts) {
    return this._httpClient.request(opts);
  }

  /**
   * Sends a signal client request
   * @param {Object} opts options request options 
   * @param {Object} host signal client host data
   * @param {String} accountId account id
   * @returns {Object|String|any} request result
   */
  async requestSignal(opts, host, accountId) {
    this._updateAccountRegions(host, accountId);
    try {
      return await any(host.regions.map(region => {
        return this._httpClient.requestWithFailover(Object.assign({}, opts, {
          url: `${host.host}.${region}.${host.domain}` + opts.url,
          headers: {
            'auth-token': this._token
          },
        }));
      }));
    } catch (error) {
      throw error.errors[0]; 
    }
  }

  /**
   * Returns CopyFactory host for signal client requests
   * @param {String[]} regions subscriber regions
   * @returns {String} signal client CopyFactory host
   */
  async getSignalClientHost(regions) {
    await this._updateHost();
    return {
      host: 'https://copyfactory-api-v1',
      regions,
      lastUpdated: Date.now(),
      domain: this._urlCache.domain
    };
  }

  /**
   * Account request info
   * @typedef {Object} AccountInfo
   * @property {String} id primary account id
   * @property {String[]} regions account available regions
   */

  /**
   * Returns account data by id
   * @param {String} accountId account id
   * @returns {AccountInfo} account data
   */
  async getAccountInfo(accountId) {
    const getAccount = async (id) => {
      const accountOpts = {
        url: `https://mt-provisioning-api-v1.${this.domain}/users/current/accounts/${id}`,
        method: 'GET',
        headers: {
          'auth-token': this.token
        },
        json: true
      };
      return await this._httpClient.requestWithFailover(accountOpts);
    };

    let accountData = await getAccount(accountId);
    let primaryAccountId = '';
    if(accountData.primaryAccountId) {
      primaryAccountId = accountData.primaryAccountId;
      accountData = await getAccount(primaryAccountId);
    } else {
      primaryAccountId = accountData._id;
    }

    let regions = [accountData.region].concat(accountData.accountReplicas && 
      accountData.accountReplicas.map(replica => replica.region) || []);
    return {
      id: primaryAccountId,
      regions
    };
  }

  async _updateHost() {
    if(!this._urlCache || this._urlCache.lastUpdated < Date.now() - 1000 * 60 * 10) {
      await this._updateRegions();
      const urlSettings = await this._httpClient.request({
        url: `https://mt-provisioning-api-v1.${this._domain}/users/current/servers/mt-client-api`,
        method: 'GET',
        headers: {
          'auth-token': this._token
        },
        json: true,
      });
      this._urlCache = {
        url: `https://copyfactory-api-v1.${this._regionCache[this._regionIndex]}.${urlSettings.domain}`,
        domain: urlSettings.domain,
        lastUpdated: Date.now()
      }; 
    } else {
      this._urlCache = {
        url: `https://copyfactory-api-v1.${this._regionCache[this._regionIndex]}.${this._urlCache.domain}`,
        domain: this._urlCache.domain,
        lastUpdated: Date.now()
      }; 
    }
  }

  async _updateRegions() {
    this._regionCache = await this._httpClient.request({
      url: `https://mt-provisioning-api-v1.${this._domain}/users/current/regions`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true,
    });
    this._regionIndex = 0;
  }

  async _updateAccountRegions(host, accountId) {
    if(host.lastUpdated < Date.now() - 1000 * 60 * 10) {
      const accountData = await this.getAccountInfo(accountId);
      host.lastUpdated = Date.now();
      host.regions = accountData.regions;
    }
  }

}