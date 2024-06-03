'use strict';

import MetaApiClient from '../metaApi.client';
import TimeoutError from '../timeoutError';
import randomstring from 'randomstring';

export default class ConfigurationClient extends MetaApiClient {

  constructor(domainClient) {
    super(domainClient);
    this._domainClient = domainClient;
  }

  generateStrategyId() {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('generateStrategyId');
    }
    const opts = {
      url: '/users/current/configuration/unused-strategy-id',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  generateAccountId() {
    return randomstring.generate(64);
  }

  getStrategies(includeRemoved, limit, offset) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategies');
    }
    let params = {};
    if(includeRemoved !== undefined) {
      params.includeRemoved = includeRemoved;
    }
    if(limit !== undefined) {
      params.limit = limit;
    }
    if(offset !== undefined) {
      params.offset = offset;
    }
    const opts = {
      url: '/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts, true);
  }

  getStrategy(strategyId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getStrategy');
    }
    const opts = {
      url: `/users/current/configuration/strategies/${strategyId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  updateStrategy(strategyId, strategy) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateStrategy');
    }
    const opts = {
      url: `/users/current/configuration/strategies/${strategyId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      data: strategy,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  removeStrategy(strategyId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeStrategy');
    }
    const opts = {
      url: `/users/current/configuration/strategies/${strategyId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  getPortfolioStrategies(includeRemoved, limit, offset) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getPortfolioStrategies');
    }
    let params = {};
    if(includeRemoved !== undefined) {
      params.includeRemoved = includeRemoved;
    }
    if(limit !== undefined) {
      params.limit = limit;
    }
    if(offset !== undefined) {
      params.offset = offset;
    }
    const opts = {
      url: '/users/current/configuration/portfolio-strategies',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts, true);
  }

  getPortfolioStrategy(portfolioId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getPortfolioStrategy');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  updatePortfolioStrategy(portfolioId, portfolio) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updatePortfolioStrategy');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      data: portfolio,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  removePortfolioStrategy(portfolioId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removePortfolioStrategy');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  removePortfolioStrategyMember(portfolioId, strategyId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removePortfolioStrategyMember');
    }
    const opts = {
      url: `/users/current/configuration/portfolio-strategies/${portfolioId}/members/${strategyId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  getSubscribers(includeRemoved, limit, offset) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSubscribers');
    }
    let params = {};
    if(includeRemoved !== undefined) {
      params.includeRemoved = includeRemoved;
    }
    if(limit !== undefined) {
      params.limit = limit;
    }
    if(offset !== undefined) {
      params.offset = offset;
    }
    const opts = {
      url: '/users/current/configuration/subscribers',
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      params,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts, true);
  }

  getSubscriber(subscriberId) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('getSubscriber');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}`,
      method: 'GET',
      headers: {
        'auth-token': this._token
      },
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  updateSubscriber(subscriberId, subscriber) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('updateSubscriber');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}`,
      method: 'PUT',
      headers: {
        'auth-token': this._token
      },
      data: subscriber,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  removeSubscriber(subscriberId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeSubscriber');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

  removeSubscription(subscriberId, strategyId, closeInstructions) {
    if (this._isNotJwtToken()) {
      return this._handleNoAccessError('removeSubscription');
    }
    const opts = {
      url: `/users/current/configuration/subscribers/${subscriberId}/subscriptions/${strategyId}`,
      method: 'DELETE',
      headers: {
        'auth-token': this._token
      },
      data: closeInstructions,
      json: true
    };
    return this._domainClient.requestCopyFactory(opts);
  }

}
