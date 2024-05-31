'use strict';

import MetaApiClient from './metaApi.client';

/**
 * @test {MetaApiClient}
 */
describe('MetaApiClient', () => {

  let apiClient;
  let domainClient;

  beforeEach(() => {
    domainClient = {
      token: 'token'
    };
    apiClient = new MetaApiClient(domainClient);
  });

  it('should return account token type', () => {
    apiClient._tokenType.should.equal('account');
  });

  it('should return api token type', () => {
    domainClient.token = 'header.payload.sign';
    apiClient = new MetaApiClient(domainClient);
    apiClient._tokenType.should.equal('api');
  });

  it('should check that current token is not JWT', () => {
    apiClient._isNotJwtToken().should.equal(true);
  });

  it('should check that current token is not account token', () => {
    domainClient.token = 'header.payload.sign';
    apiClient = new MetaApiClient(domainClient);
    apiClient._isNotAccountToken().should.equal(true);
  });

  it('should handle no access error with account token', async () => {
    try {
      await apiClient._handleNoAccessError('methodName');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke methodName method, because you have connected with account access token. ' +
        'Please use API access token from https://app.metaapi.cloud/token page to invoke this method.'
      );
    }
  });

  it('should handle no access error with api token', async () => {
    domainClient.token = 'header.payload.sign';
    apiClient = new MetaApiClient(domainClient);
    try {
      await apiClient._handleNoAccessError('methodName');
    } catch (error) {
      error.message.should.equal(
        'You can not invoke methodName method, because you have connected with API access token. ' +
        'Please use account access token to invoke this method.'
      );
    }
  });

});