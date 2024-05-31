'use strict';

import HttpClient from '../httpClient';
import sinon from 'sinon';
import HistoryClient from './history.client';
import DomainClient from '../domain.client';
import TransactionListener from './streaming//transactionListener';

/**
 * @test {HistoryClient}
 */
describe('HistoryClient', () => {

  let copyFactoryClient;
  const token = 'header.payload.sign';
  let httpClient = new HttpClient();
  let domainClient;
  let sandbox;
  let requestStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    domainClient = new DomainClient(httpClient, token);
    copyFactoryClient = new HistoryClient(domainClient);
    requestStub = sandbox.stub(domainClient, 'requestCopyFactory');
  });

  afterEach(() => {
    sandbox.restore();
  });

  /**
   * @test {HistoryClient#getProvidedTransactions}
   */
  it('should retrieve transactions performed on provided strategies from API', async () => {
    let expected = [{
      id: '64664661:close',
      type: 'DEAL_TYPE_SELL',
      time: new Date('2020-08-02T21:01:01.830Z'),
      subscriberId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      symbol: 'EURJPY',
      subscriberUser: {
        id: 'subscriberId',
        name: 'Subscriber'
      },
      demo: false,
      providerUser: {
        id: 'providerId',
        name: 'Provider'
      },
      strategy: {
        id: 'ABCD'
      },
      improvement: 0,
      providerCommission: 0,
      platformCommission: 0,
      quantity: -0.04,
      lotPrice: 117566.08744776,
      tickPrice: 124.526,
      amount: -4702.643497910401,
      commission: -0.14,
      swap: -0.14,
      profit: 0.49
    }];
    let from = new Date();
    let till = new Date();
    requestStub.resolves(expected);
    let transactions = await copyFactoryClient.getProvidedTransactions(from, till, ['ABCD'],
      ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'], 100, 200);
    transactions.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/provided-transactions',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      params: {
        from,
        till,
        strategyId: ['ABCD'],
        subscriberId: ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'],
        offset: 100,
        limit: 200
      },
      json: true,
    }, true);
  });

  /**
   * @test {HistoryClient#getProvidedTransactions}
   */
  it('should not retrieve transactions on provided strategies from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new HistoryClient(domainClient);
    try {
      await copyFactoryClient.getProvidedTransactions(new Date(), new Date());
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getProvidedTransactions method, because you have connected with account ' + 
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {HistoryClient#getSubscriptionTransactions}
   */
  it('should retrieve transactions performed on strategies current user is subscribed to from API', async () => {
    let expected = [{
      id: '64664661:close',
      type: 'DEAL_TYPE_SELL',
      time: new Date('2020-08-02T21:01:01.830Z'),
      subscriberId: 'e8867baa-5ec2-45ae-9930-4d5cea18d0d6',
      symbol: 'EURJPY',
      subscriberUser: {
        id: 'subscriberId',
        name: 'Subscriber'
      },
      demo: false,
      providerUser: {
        id: 'providerId',
        name: 'Provider'
      },
      strategy: {
        id: 'ABCD'
      },
      improvement: 0,
      providerCommission: 0,
      platformCommission: 0,
      quantity: -0.04,
      lotPrice: 117566.08744776,
      tickPrice: 124.526,
      amount: -4702.643497910401,
      commission: -0.14,
      swap: -0.14,
      profit: 0.49
    }];
    let from = new Date();
    let till = new Date();
    requestStub.resolves(expected);
    let transactions = await copyFactoryClient.getSubscriptionTransactions(from, till, ['ABCD'],
      ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'], 100, 200);
    transactions.should.equal(expected);
    sinon.assert.calledOnceWithExactly(domainClient.requestCopyFactory, {
      url: '/users/current/subscription-transactions',
      method: 'GET',
      headers: {
        'auth-token': token
      },
      json: true,
      params: {
        from,
        till,
        strategyId: ['ABCD'],
        subscriberId: ['e8867baa-5ec2-45ae-9930-4d5cea18d0d6'],
        offset: 100,
        limit: 200
      },
    }, true);
  });

  /**
   * @test {HistoryClient#getSubscriptionTransactions}
   */
  it('should not retrieve transactions on strategies subscribed to from API with account token', async () => {
    domainClient = new DomainClient(httpClient, 'token');
    copyFactoryClient = new HistoryClient(domainClient);
    try {
      await copyFactoryClient.getSubscriptionTransactions(new Date(), new Date());
      throw new Error('MethodAccessError expected');
    } catch (error) {
      error.name.should.equal('MethodAccessError');
      error.message.should.equal(
        'You can not invoke getSubscriptionTransactions method, because you have connected with account ' + 
        'access token. Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  /**
   * @test {HistoryClient#addStrategyTransactionListener}
   * @test {HistoryClient#removeStopoutListener}
   */
  describe('transactionListener', () => {

    let listener;

    beforeEach(() => {

      class Listener extends TransactionListener {
        async onStopout(strategyStopoutEvent) {}
      }

      listener = new Listener();
    });

    /**
     * @test {HistoryClient#addStrategyTransactionListener}
     */
    it('should add strategy listener', async () => {
      const callStub = sinon.stub(copyFactoryClient._transactionListenerManager, 'addStrategyTransactionListener')
        .returns('listenerId');
      const listenerId = copyFactoryClient.addStrategyTransactionListener(listener, 'ABCD');
      sinon.assert.match(listenerId, 'listenerId');
      sinon.assert.calledWith(callStub, listener, 'ABCD');
    });

    /**
     * @test {HistoryClient#removeStrategyTransactionListener}
     */
    it('should remove strategy listener', async () => {
      const callStub = sinon.stub(copyFactoryClient._transactionListenerManager, 'removeStrategyTransactionListener');
      copyFactoryClient.removeStrategyTransactionListener('id');
      sinon.assert.calledWith(callStub, 'id');
    });

    /**
     * @test {HistoryClient#addSubscriberTransactionListener}
     */
    it('should add subscriber listener', async () => {
      const callStub = sinon.stub(copyFactoryClient._transactionListenerManager, 'addSubscriberTransactionListener')
        .returns('listenerId');
      const listenerId = copyFactoryClient.addSubscriberTransactionListener(listener, 'accountId');
      sinon.assert.match(listenerId, 'listenerId');
      sinon.assert.calledWith(callStub, listener, 'accountId');
    });

    /**
     * @test {HistoryClient#removeSubscriberTransactionListener}
     */
    it('should remove subscriber listener', async () => {
      const callStub = sinon.stub(copyFactoryClient._transactionListenerManager, 'removeSubscriberTransactionListener');
      copyFactoryClient.removeSubscriberTransactionListener('id');
      sinon.assert.calledWith(callStub, 'id');
    });

  });

});
