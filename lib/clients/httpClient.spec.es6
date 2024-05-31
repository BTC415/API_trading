'use strict';

import should from 'should';
import sinon  from 'sinon';
import HttpClient, {HttpClientMock} from './httpClient';
import {ValidationError, ApiError, InternalError, TooManyRequestsError} from './errorHandler';

/**
 * @test {HttpClient}
 */
describe('HttpClient', () => {

  let httpClient;

  /**
   * @test {HttpClient#request}
   */
  describe('Real request', () => {

    beforeEach(() => {
      httpClient = new HttpClient();
    });

    /**
     * @test {HttpClient#request}
     */
    it('should load HTML page from example.com', async () => {
      const opts = {url: 'http://example.com'};
      const response = await httpClient.request(opts);
      response.should.match(/doctype html/);
    });
  
    /**
     * @test {HttpClient#requestWithFailover}
     */
    it('should load HTML page from example.com with failover', async () => {
      const opts = {url: 'http://example.com'};
      const response = await httpClient.requestWithFailover(opts);
      response.should.match(/doctype html/);
    });

    /**
     * @test {HttpClient#requestWithFailover}
     */
    it('should return NotFound error if server returns 404', async () => {
      let opts = {url: 'http://example.com/not-found'};
      try {
        const response = await httpClient.requestWithFailover(opts);
        should.not.exist(response);
      } catch (err) {
        err.name.should.be.eql('NotFoundError');
      }
    });

    /**
     * @test {HttpClient#requestWithFailover}
     */
    it('should return timeout error if request is timed out', async () => {
      httpClient = new HttpClient(0.001, 60, {retries: 2});
      let opts = {url: 'http://metaapi.cloud'};
      try {
        const response = await httpClient.requestWithFailover(opts);
        should.not.exist(response);
      } catch (err) {
        err.name.should.be.eql('ApiError');
        err.message.should.be.eql('ETIMEDOUT' + '. Request URL: ' + opts.url);
      }
    }).timeout(10000);

  });

  describe('Request', () => {
    const opts = {url: 'http://metaapi.cloud'};
    const getTooManyRequestsError = (sec) => {
      const date = new Date();
      date.setSeconds(date.getSeconds() + sec);
      const recommendedRetryTime = date.toUTCString();
      return new TooManyRequestsError('test', {recommendedRetryTime});
    };
    let sandbox, stub;

    before(() => {
      sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
      stub = sandbox.stub();
      httpClient = new HttpClientMock(stub);
    });

    afterEach(() => {
      sandbox.restore();
    });

    /**
     * @test {HttpClient#request}
     */
    it('should return ApiError error', async () => {
      stub.rejects(new ApiError(ApiError, 'test'));
      httpClient = new HttpClientMock(stub, 10, 60, {retries: 2});
      try {
        const response = await httpClient.request(opts);
        should.not.exist(response);
      } catch (err) {
        err.name.should.eql('ApiError');
        err.message.should.eql('test');
      }
      sinon.assert.calledOnce(stub);
    });

    /**
     * @test {HttpClient#request}
     */
    it('should retry request after waiting on fail with TooManyRequestsError error', async () => {
      stub.onFirstCall().rejects(getTooManyRequestsError(2))
        .onSecondCall().rejects(getTooManyRequestsError(3))
        .onThirdCall().resolves({ data: 'response' });
      const response = await httpClient.request(opts);
      response.should.eql('response');
      sinon.assert.calledThrice(stub);
    }).timeout(10000);

    /**
     * @test {HttpClient#request}
     */
    it('should return error if recommended retry time is too long', async () => {
      stub.onFirstCall().rejects(getTooManyRequestsError(2))
        .onSecondCall().rejects(getTooManyRequestsError(300))
        .onThirdCall().resolves({ data: 'response' });
      try {
        const response = await httpClient.request(opts);
        should.not.exist(response);
      } catch (err) {
        err.name.should.eql('TooManyRequestsError');
        err.message.should.eql('test');
      }
      sinon.assert.calledTwice(stub);
    }).timeout(10000);

  });

  /**
   * @test {HttpClient#requestWithFailover}
   */
  describe('Retry request', () => {

    const opts = {url: 'http://metaapi.cloud'};
    let sandbox, stub;

    before(() => {
      sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
      stub = sandbox.stub();
      httpClient = new HttpClientMock(stub);
    });

    afterEach(() => {
      sandbox.restore();
    });

    /**
     * @test {HttpClient#requestWithFailover}
     */
    describe('when InternalError or ApiError error occured', () => {

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should retry request on fail with ApiError error', async () => {
        stub.onFirstCall().rejects(new ApiError(ApiError, 'test'))
          .onSecondCall().rejects(new ApiError(ApiError, 'test'))
          .onThirdCall().resolves({ data: 'response' });
        const response = await httpClient.requestWithFailover(opts);
        response.should.match('response');
        sinon.assert.calledThrice(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should retry request on fail with InternalError error', async () => {
        stub.onFirstCall().rejects(new InternalError('test'))
          .onSecondCall().rejects(new InternalError('test'))
          .onThirdCall().resolves({ data: 'response' });
        const response = await httpClient.requestWithFailover(opts);
        response.should.match('response');
        sinon.assert.calledThrice(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should return error if retry limit exceeded', async () => {
        stub.rejects(new ApiError(ApiError, 'test'));
        httpClient = new HttpClientMock(stub, 10, 60, {retries: 2});
        try {
          const response = await httpClient.requestWithFailover(opts);
          should.not.exist(response);
        } catch (err) {
          err.name.should.eql('ApiError');
          err.message.should.eql('test');
        }
        sinon.assert.calledThrice(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should not retry if error is neither InternalError nor ApiError', async () => {
        stub.onFirstCall().rejects(new ValidationError('test'))
          .onSecondCall().rejects(new ValidationError('test'))
          .onThirdCall().resolves({ data: 'response' });
        try {
          const response = await httpClient.requestWithFailover(opts);
          should.not.exist(response);
        } catch (err) {
          err.name.should.eql('ValidationError');
          err.message.should.eql('test');
        }
        sinon.assert.calledOnce(stub);
      }).timeout(10000);

    });

    /**
     * @test {HttpClient#requestWithFailover}
     */
    describe('when TooManyRequestsError error occured', () => {

      const getTooManyRequestsError = (sec) => {
        const date = new Date();
        date.setSeconds(date.getSeconds() + sec);
        const recommendedRetryTime = date.toUTCString();
        return new TooManyRequestsError('test', {recommendedRetryTime});
      };

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should retry request after waiting on fail with TooManyRequestsError error', async () => {
        stub.onFirstCall().rejects(getTooManyRequestsError(2))
          .onSecondCall().rejects(getTooManyRequestsError(3))
          .onThirdCall().resolves({ data: 'response' });
        const response = await httpClient.requestWithFailover(opts);
        response.should.eql('response');
        sinon.assert.calledThrice(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should return error if recommended retry time is too long', async () => {
        stub.onFirstCall().rejects(getTooManyRequestsError(2))
          .onSecondCall().rejects(getTooManyRequestsError(300))
          .onThirdCall().resolves({ data: 'response' });
        try {
          const response = await httpClient.requestWithFailover(opts);
          should.not.exist(response);
        } catch (err) {
          err.name.should.eql('TooManyRequestsError');
          err.message.should.eql('test');
        }
        sinon.assert.calledTwice(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should not count retrying TooManyRequestsError error', async () => {
        stub.onFirstCall().rejects(getTooManyRequestsError(1))
          .onSecondCall().rejects(new ApiError(ApiError, 'test'))
          .onThirdCall().resolves({ data: 'response' });
        httpClient = new HttpClientMock(stub, 10, 60, {retries: 1});
        const response = await httpClient.requestWithFailover(opts);
        response.should.eql('response');
        sinon.assert.calledThrice(stub);
      }).timeout(10000);

    });

    /**
     * @test {HttpClient#requestWithFailover}
     */
    describe('when status 202 response received', () => {

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should wait for the retry-after header time before retrying', async () => {
        stub.callsFake((options)=> {
          options.callback(null, {headers: {'retry-after': 3}, status: 202});
        }).onThirdCall().resolves({ data: 'response' });
        const response = await httpClient.requestWithFailover(opts);
        response.should.eql('response');
        sinon.assert.calledThrice(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should return TimeoutError error if retry-after header time is too long', async () => {
        stub.callsFake((options)=> {
          options.callback(null, {headers: {'retry-after': 30}, status: 202});
        });
        httpClient = new HttpClientMock(stub, 10, 60, {maxDelayInSeconds: 3});
        try {
          await httpClient.requestWithFailover(opts);
          should.not.exist('Should not exist this assertion');
        } catch (err) {
          err.name.should.eql('TimeoutError');
          err.message.should.eql('Timed out waiting for the response');
        }
        sinon.assert.calledOnce(stub);
      }).timeout(10000);

      /**
       * @test {HttpClient#requestWithFailover}
       */
      it('should return TimeoutError error if timed out to retry', async () => {
        stub.callsFake((options)=> {
          options.callback(null, {headers: {'retry-after': 1}, status: 202});
        });
        httpClient = new HttpClientMock(stub, 10, 60, {maxDelayInSeconds: 2, retries: 3});
        try {
          await httpClient.requestWithFailover(opts);
          should.not.exist('Should not exist this assertion');
        } catch (err) {
          err.name.should.eql('TimeoutError');
          err.message.should.eql('Timed out waiting for the response');
        }
        sinon.assert.callCount(stub, 6);
      }).timeout(10000);

    });

  });

});
