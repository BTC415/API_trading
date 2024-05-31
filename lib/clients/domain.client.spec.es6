'use strict';

import HttpClient from './httpClient';
import sinon from 'sinon';
import DomainClient from './domain.client';
import { ValidationError, InternalError } from './errorHandler';

/**
 * @test {DomainClient}
 */
describe('DomainClient', () => {

  let domainClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let sandbox;
  let requestStub;
  let getRegionsStub;
  let getHostStub;
  let failoverRequestStub;
  let clock;
  const expected = [{_id: 'ABCD'}];

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    domainClient = new DomainClient(httpClient, token);
    clock = sandbox.useFakeTimers({shouldAdvanceTime: true});
    failoverRequestStub = sandbox.stub(httpClient, 'requestWithFailover');
    requestStub = sandbox.stub(httpClient, 'request');
    requestStub.withArgs({
      url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': token
      },
    }).resolves(expected);
    getRegionsStub = requestStub.withArgs({
      url: 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/regions',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    }).resolves(['vint-hill', 'us-west']);
    getHostStub = requestStub.withArgs({
      url: 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/servers/mt-client-api',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
    }).resolves({domain: 'agiliumtrade.agiliumtrade.ai'});
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  /**
   * @test {DomainClient#requestCopyFactory}
   */
  describe('requestCopyFactory', () => {

    const opts = {
      url: '/users/current/configuration/strategies',
      method: 'GET',
      headers: {
        'auth-token': token
      },
    };

    /**
     * @test {DomainClient#requestCopyFactory}
     */
    it('should execute request', async () => {
      const response = await domainClient.requestCopyFactory(opts);
      sinon.assert.match(response, expected);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      });
    });

    /**
     * @test {DomainClient#requestCopyFactory}
     */
    it('should use cached url on repeated request', async () => {
      await domainClient.requestCopyFactory(opts);
      const response = await domainClient.requestCopyFactory(opts);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.match(response, expected);
      sinon.assert.calledOnce(getHostStub);
      sinon.assert.calledOnce(getRegionsStub);
    });

    /**
     * @test {DomainClient#requestCopyFactory}
     */
    it('should request url again if expired', async () => {
      await domainClient.requestCopyFactory(opts);
      await clock.tickAsync(610000);
      const response = await domainClient.requestCopyFactory(opts);
      sinon.assert.match(response, expected);
      sinon.assert.calledWith(requestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.calledTwice(getHostStub);
      sinon.assert.calledTwice(getRegionsStub);
    });

    /**
     * @test {DomainClient#requestCopyFactory}
     */
    it('should return request error', async () => {
      requestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
        method: 'GET',
        headers: {
          'auth-token': token
        },
      }).throws(new ValidationError('test'));
      try {
        await domainClient.requestCopyFactory(opts);
        throw new Error('ValidationError expected');
      } catch (error) {
        error.name.should.equal('ValidationError');
      }
    });

    /**
     * @test {DomainClient#requestCopyFactory}
     */
    it('should return error if failed to get host', async () => {
      getHostStub.throws(new ValidationError('test'));
      try {
        await domainClient.requestCopyFactory(opts);
        throw new Error('ValidationError expected');
      } catch (error) {
        error.name.should.equal('ValidationError');
      }
    });

    /**
     * @test {DomainClient#requestCopyFactory}
     */
    describe('regions', () => {

      /**
       * @test {DomainClient#requestCopyFactory}
       */
      it('should return error if failed to get regions', async () => {
        getRegionsStub.throws(new ValidationError('test'));
        try {
          await domainClient.requestCopyFactory(opts);
          throw new Error('ValidationError expected');
        } catch (error) {
          error.name.should.equal('ValidationError');
        }
      });

      /**
       * @test {DomainClient#requestCopyFactory}
       */
      it('should try another region if the first failed', async () => {
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' +
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).rejects(new InternalError('test'));
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).resolves(expected);
        const response = await domainClient.requestCopyFactory(opts);
        sinon.assert.calledWith(requestStub, {
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        });
        sinon.assert.match(response, expected);

        sinon.assert.calledOnce(getHostStub);
        sinon.assert.calledOnce(getRegionsStub);
      });

      /**
       * @test {DomainClient#requestCopyFactory}
       */
      it('should return error if all regions failed', async () => {
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).throws(new InternalError('test'));
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).throws(new InternalError('test'));

        try {
          await domainClient.requestCopyFactory(opts);
          throw new Error('InternalError expected');
        } catch (error) {
          error.name.should.equal('InternalError');
        }
      });

      /**
       * @test {DomainClient#requestCopyFactory}
       */
      it('should roll over to the first region if all regions failed', async () => {
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).throws(new InternalError('test'));
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).throws(new InternalError('test'));

        try {
          await domainClient.requestCopyFactory(opts);
          throw new Error('InternalError expected');
        } catch (error) {
          error.name.should.equal('InternalError');
        }
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).resolves(expected);
        const response = await domainClient.requestCopyFactory(opts);
        sinon.assert.match(response, expected);
      });

      /**
       * @test {DomainClient#requestCopyFactory}
       */
      it('should not skip regions if two parallel requests fail', async () => {
        getRegionsStub = requestStub.withArgs({
          url: 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/regions',
          method: 'GET',
          headers: {
            'auth-token': token
          },
          json: true,
        }).resolves(['vint-hill', 'us-west', 'us-east']);
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).callsFake(async () => {
          await new Promise(res => setTimeout(res, 100));
          throw new InternalError('test');
        });
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-west.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).resolves(expected);
        requestStub.withArgs({
          url: 'https://copyfactory-api-v1.us-east.agiliumtrade.agiliumtrade.ai/users/' + 
          'current/configuration/strategies',
          method: 'GET',
          headers: {
            'auth-token': token
          },
        }).resolves([]);
        const results = await Promise.all([
          domainClient.requestCopyFactory(opts),
          domainClient.requestCopyFactory(opts)
        ]);
        sinon.assert.match(results[0], expected);
        sinon.assert.match(results[1], expected);
      });

    });

  });

  /**
   * @test {DomainClient#request}
   */
  describe('request', () => {

    it('should execute request', async () => {
      const opts = {
        url:  'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/accountId',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      };

      requestStub.withArgs(opts).resolves(expected);
      const response = await domainClient.request(opts);
      sinon.assert.match(response, expected);
      sinon.assert.calledWith(requestStub, opts);
    });

  });

  /**
   * @test {DomainClient#requestSignal}
   */
  describe('requestSignal', () => {

    const signalOpts = {
      url: '/users/current/subscribers/accountId/signals',
      method: 'GET',
      json: true
    };

    const expectedSignals = [{
      strategy: { id: '1234', name: 'Test strategy' },
      positionId: '123456',
      time: '2021-11-19T18:56:32.590Z',
      symbol: 'GBPUSD',
      type: 'limit',
      side: 'buy',
    }];

    let host;

    beforeEach(async () => {
      host = {
        host: 'https://copyfactory-api-v1',
        lastUpdated: Date.now(),
        regions: ['vint-hill'],
        domain: 'agiliumtrade.ai'
      };
      failoverRequestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).resolves(expectedSignals);
      failoverRequestStub.withArgs({
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).rejects(new InternalError('test'));
      await domainClient.getSignalClientHost('vint-hill');
    });

    /**
     * @test {DomainClient#requestSignal}
     */
    it('should execute a request', async () => {
      const response = await domainClient.requestSignal(signalOpts, host, 'accountId');
      sinon.assert.match(response, expectedSignals);
      sinon.assert.calledWith(failoverRequestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
    });

    /**
     * @test {DomainClient#requestSignal}
     */
    it('should execute a request with multiple regions', async () => {
      host.regions = ['vint-hill', 'us-west'];
      const response = await domainClient.requestSignal(signalOpts, host, 'accountId');
      sinon.assert.match(response, expectedSignals);
      sinon.assert.calledWith(failoverRequestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.calledWith(failoverRequestStub, {
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
    });
    
    /**
     * @test {DomainClient#requestSignal}
     */
    it('should return an error if all regions failed', async () => {
      host.regions = ['vint-hill', 'us-west'];
      failoverRequestStub.withArgs({
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      }).rejects(new InternalError('test'));

      try {
        await domainClient.requestSignal(signalOpts, host, 'accountId');
        throw new Error('InternalError expected');
      } catch (error) {
        error.name.should.equal('InternalError');
      }
      sinon.assert.calledWith(failoverRequestStub, {
        url: 'https://copyfactory-api-v1.vint-hill.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
      sinon.assert.calledWith(failoverRequestStub, {
        url: 'https://copyfactory-api-v1.us-west.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
    });

    /**
     * @test {DomainClient#requestSignal}
     */
    it('should execute a request and update host if expired', async () => {
      const otherRegionOpts = {
        url: 'https://copyfactory-api-v1.germany.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      };
      const otherRegionStub = failoverRequestStub.withArgs(otherRegionOpts).resolves(expectedSignals);
      const replicaCallStub = failoverRequestStub.withArgs({
        url: 'https://copyfactory-api-v1.france.agiliumtrade.ai/users/current/subscribers/accountId/signals',
        method: 'GET',
        json: true,
        headers: {
          'auth-token': token
        },
      });
      const getAccountStub = failoverRequestStub.withArgs({
        url:  'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/accountId',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      }).resolves({_id: 'accountId', region: 'germany', accountReplicas: [
        {_id: 'accountId2', region: 'france'}
      ]});
      await domainClient.requestSignal(signalOpts, host, 'accountId');
      await new Promise(res => setTimeout(res, 50));
      sinon.assert.notCalled(getAccountStub);
      sinon.assert.notCalled(otherRegionStub);
      sinon.assert.notCalled(replicaCallStub);
      await clock.tickAsync(610000);
      await domainClient.requestSignal(signalOpts, host, 'accountId');
      await new Promise(res => setTimeout(res, 50));
      sinon.assert.calledOnce(getAccountStub);
      sinon.assert.notCalled(otherRegionStub);
      sinon.assert.notCalled(replicaCallStub);
      await domainClient.requestSignal(signalOpts, host, 'accountId');
      await new Promise(res => setTimeout(res, 50));
      sinon.assert.calledOnce(getAccountStub);
      sinon.assert.calledOnce(otherRegionStub);
      sinon.assert.calledOnce(replicaCallStub);
    });

  });

  /**
   * @test {DomainClient#getAccountInfo}
   */
  describe('getAccountInfo', () => {

    let getAccountStub;
    let expectedAccount;

    beforeEach(() => {
      expectedAccount = {_id: 'accountId2', region: 'germany', accountReplicas: []};
      getAccountStub = failoverRequestStub.withArgs({
        url:  'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/accountId',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      }).resolves(expectedAccount);
    });

    /**
     * @test {DomainClient#getAccountInfo}
     */
    it('should get account', async () => {
      const account = await domainClient.getAccountInfo('accountId');
      sinon.assert.match(account, {id: 'accountId2', regions: ['germany']});
    });

    /**
     * @test {DomainClient#getAccountInfo}
     */
    it('should get account with replicas', async () => {
      getAccountStub.resolves({
        _id: 'accountId', 
        region: 'vint-hill', 
        accountReplicas: [
          {
            _id: 'accountId2', 
            region: 'us-west', 
          }
        ]
      });
      const account = await domainClient.getAccountInfo('accountId');
      sinon.assert.match(account, {id: 'accountId', regions: ['vint-hill', 'us-west']});
    });

    /**
     * @test {TradingClient#getAccountInfo}
     */
    it('should get primary account if requested account is a replica', async () => {
      getAccountStub.resolves({
        _id: 'accountId', 
        region: 'vint-hill', 
        primaryAccountId: 'accountId2'
      });
      failoverRequestStub.withArgs({
        url:  'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/accountId2',
        method: 'GET',
        headers: {
          'auth-token': token
        },
        json: true
      }).resolves({
        _id: 'accountId2', region: 'us-west', accountReplicas: [
          {
            _id: 'accountId', 
            region: 'vint-hill', 
          }
        ]
      });
      const account = await domainClient.getAccountInfo('accountId');
      sinon.assert.match(account, {id: 'accountId2', regions: ['us-west', 'vint-hill']});
    });

  });

  /**
   * @test {DomainClient#getSignalClientHost}
   */
  describe('getSignalClientHost', () => {

    /**
     * @test {DomainClient#getSignalClientHost}
     */
    it('should return signal client host', async () => {
      const response = await domainClient.getSignalClientHost(['vint-hill']);
      sinon.assert.match(response, { 
        host: 'https://copyfactory-api-v1',
        regions: ['vint-hill'],
        domain: 'agiliumtrade.agiliumtrade.ai' 
      });
    });

  });

});
