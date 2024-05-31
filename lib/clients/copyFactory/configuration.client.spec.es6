'use strict';

import should from 'should';
import sinon from 'sinon';
import DomainClient from '../domain.client';
import HttpClient from '../httpClient';
import ConfigurationClient from './configuration.client';

describe('ConfigurationClient', () => {

  let sandbox;
  let copyFactoryClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let domainClient;
  let requestStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    domainClient = new DomainClient(httpClient, token);
    copyFactoryClient = new ConfigurationClient(domainClient);
    requestStub = sandbox.stub(domainClient, 'requestCopyFactory');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should generate account id', async () => {
    copyFactoryClient.generateAccountId().length.should.equal(64);
  });

  it('should generate strategy id', async () => {
    let expected = {
      id: 'ABCD'
    };
    requestStub.resolves(expected);
    let id = await copyFactoryClient.generateStrategyId();
    id.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/unused-strategy-id',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  it('should not generate strategy id with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.generateStrategyId();
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke generateStrategyId method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  it('should retrieve strategies from API', async () => {
    let expected = [{
      _id: 'ABCD',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      accountId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      maxTradeRisk: 0.1,
      riskLimits: [{
        type: 'monthly',
        applyTo: 'balance',
        maxRelativeRisk: 0.5,
        closePositions: false,
        startTime: '2020-08-24T00:00:01.000Z'
      }],
      timeSettings: {
        lifetimeInHours: 192,
        openingIntervalInMinutes: 5
      }
    }];
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getStrategies(true, 100, 200);
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      params: { 
        includeRemoved: true, 
        limit: 100,
        offset: 200 
      },
      json: true,
    }, true);
  });
  
  it('should not retrieve strategies from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.getStrategies();
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getStrategies method, because you have connected with account access token. ' +
          'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  it('should retrieve strategy from API', async () => {
    let expected = {
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      connectionId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      maxTradeRisk: 0.1,
      timeSettings: {
        lifetimeInHours: 192,
        openingIntervalInMinutes: 5
      }
    };
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getStrategy('ABCD');
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/strategies/ABCD',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });
  
  it('should not retrieve strategy from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.getStrategy('ABCD');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getStrategy method, because you have connected with account access token. ' +
          'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  it('should update strategy via API', async () => {
    const strategy = {
      name: 'Test strategy',
      accountId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      maxTradeRisk: 0.1,
      riskLimits: [{
        type: 'monthly',
        applyTo: 'balance',
        maxRelativeRisk: 0.5,
        closePositions: false,
        startTime: '2020-08-24T00:00:01.000Z'
      }],
      timeSettings: {
        lifetimeInHours: 192,
        openingIntervalInMinutes: 5
      }
    };
    await copyFactoryClient.updateStrategy('ABCD', strategy);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/strategies/ABCD',
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      data: strategy});
  });

  it('should not update strategy via API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.updateStrategy('ABCD', {});
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke updateStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  it('should remove strategy via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient.removeStrategy('ABCD', payload);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/strategies/ABCD',
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      data: payload,
      json: true,
    });
  });

  it('should not remove strategy from via with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.removeStrategy('ABCD');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke removeStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategies}
   */
  it('should retrieve portfolio strategies from API', async () => {
    let expected = [{
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      members: [
        {
          strategyId: 'BCDE'
        }
      ],
      maxTradeRisk: 0.1
    }];
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getPortfolioStrategies(true, 100, 200);
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/portfolio-strategies',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      params: { 
        includeRemoved: true, 
        limit: 100,
        offset: 200 
      },
      json: true,
    }, true);
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategies}
   */
  it('should not retrieve portfolio strategies from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.getPortfolioStrategies();
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getPortfolioStrategies method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategy}
   */
  it('should retrieve portfolio strategy from API', async () => {
    let expected = {
      _id: 'ABCD',
      providerId: 'providerId',
      platformCommissionRate: 0.01,
      name: 'Test strategy',
      members: [
        {
          strategyId: 'BCDE'
        }
      ],
      maxTradeRisk: 0.1
    };
    requestStub.resolves(expected);
    let strategies = await copyFactoryClient.getPortfolioStrategy('ABCD');
    strategies.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/portfolio-strategies/ABCD',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#getPortfolioStrategy}
   */
  it('should not retrieve portfolio strategy from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.getPortfolioStrategy('ABCD');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getPortfolioStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#updatePortfolioStrategy}
   */
  it('should update portfolio strategy via API', async () => {
    const strategy = {
      name: 'Test strategy',
      members: [
        {
          strategyId: 'BCDE'
        }
      ],
      maxTradeRisk: 0.1
    };
    await copyFactoryClient.updatePortfolioStrategy('ABCD', strategy);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/portfolio-strategies/ABCD',
      method: 'PUT',
      headers: {
        'auth-token': token
      },
      json: true,
      data: strategy
    });
  });

  /**
   * @test {ConfigurationClient#updatePortfolioStrategy}
   */
  it('should not update portfolio strategy via API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.updatePortfolioStrategy('ABCD', {});
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke updatePortfolioStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#removePortfolioStrategy}
   */
  it('should remove portfolio strategy via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient.removePortfolioStrategy('ABCD', payload);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/portfolio-strategies/ABCD',
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      data: payload,
      json: true,
    });
  });

  /**
   * @test {ConfigurationClient#removePortfolioStrategy}
   */
  it('should not remove portfolio strategy from via with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.removePortfolioStrategy('ABCD');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke removePortfolioStrategy method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {ConfigurationClient#removePortfolioStrategyMember}
   */
  it('should remove portfolio strategy member via API', async () => {
    const payload = {mode: 'preserve', removeAfter: '2020-08-24T00:00:00.000Z'};
    await copyFactoryClient.removePortfolioStrategyMember('ABCD', 'BCDE', payload);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/portfolio-strategies/ABCD/members/BCDE',
      method: 'DELETE',
      headers: {
        'auth-token': token
      },
      data: payload,
      json: true,
    });
  });
  
  /**
     * @test {ConfigurationClient#removePortfolioStrategyMember}
     */
  it('should not remove portfolio strategy member from via with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.removePortfolioStrategyMember('ABCD', 'BCDE');
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke removePortfolioStrategyMember method, because you have connected with account access ' +
        'token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {TradingClient#getSubscribers}
   */
  it('should retrieve CopyFactory subscribers from API', async () => {
    let expected = [{
      _id: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      name: 'Demo account',
      reservedMarginFraction: 0.25,
      subscriptions: [
        {
          strategyId: 'ABCD',
          multiplier: 1
        }
      ]
    }];
    requestStub.resolves(expected);
    let accounts = await copyFactoryClient.getSubscribers(true, 100, 200);
    accounts.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/configuration/subscribers',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      params: { 
        includeRemoved: true, 
        limit: 100,
        offset: 200 
      },
      json: true,
    }, true);
  });
  
  /**
     * @test {TradingClient#getSubscribers}
     */
  it('should not retrieve subscribers from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new ConfigurationClient(domainClient);
    try {
      await copyFactoryClient.getSubscribers();
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getSubscribers method, because you have connected with account access token. ' +
          'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

});
