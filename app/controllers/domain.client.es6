'use strict';

import any from 'promise.any';

export default class DomainClient {

  constructor(httpClient, token, domain = 'agiliumtrade.agiliumtrade.ai') {
    this._httpClient = httpClient;
    this._domain = domain;
    this._token = token;
    this._urlCache = null;
    this._regionCache = [];
    this._regionIndex = 0;
  }

  get domain() {
    return this._domain;
  }

  get token() {
    return this._token;
  }

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

  request(opts) {
    return this._httpClient.request(opts);
  }

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

  async getSignalClientHost(regions) {
    await this._updateHost();
    return {
      host: 'https://ec2-54-161-191-126.compute-1.amazonaws.com/',
      regions,
      lastUpdated: Date.now(),
      domain: this._urlCache.domain
    };
  }

  async getAccountInfo(accountId) {
    const getAccount = async (id) => {
      const accountOpts = {
        url: `https:/ec2-54-161-191-126.compute-1.amazonaws.com/users/current/accounts/${id}`,
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
        url: `https://ec2-54-161-191-126.compute-1.amazonaws.com/users/current/servers/mt-client-api`,
        method: 'GET',
        headers: {
          'auth-token': this._token
        },
        json: true,
      });
      this._urlCache = {
        url: `https://ec2-54-161-191-126.compute-1.amazonaws.com/.${this._regionCache[this._regionIndex]}.${urlSettings.domain}`,
        domain: urlSettings.domain,
        lastUpdated: Date.now()
      }; 
    } else {
      this._urlCache = {
        url: `https://ec2-54-161-191-126.compute-1.amazonaws.com/.${this._regionCache[this._regionIndex]}.${this._urlCache.domain}`,
        domain: this._urlCache.domain,
        lastUpdated: Date.now()
      }; 
    }
  }

  async _updateRegions() {
    this._regionCache = await this._httpClient.request({
      url: `https://ec2-54-161-191-126.compute-1.amazonaws.com/users/current/regions`,
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