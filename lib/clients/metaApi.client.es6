'use strict';

import MethodAccessError from './methodAccessError';

/**
 * metaapi.cloud MetaTrader API client
 */
export default class MetaApiClient {

  /**
   * Constructs MetaTrader API client instance
   * @param {DomainClient} domainClient domain client
   */
  constructor(domainClient) {
    this._domainClient = domainClient;
    this._token = domainClient.token;
  }

  /**
   * Returns type of current token
   * @returns {string} Type of current token
   * @protected
   */
  get _tokenType() {
    if (typeof this._token === 'string' && this._token.split('.').length === 3) {
      return 'api';
    }
    if (typeof this._token === 'string' && this._token.split('.').length === 1) {
      return 'account';
    }
    return '';
  }

  /**
   * Checks that current token is not api token
   * @returns {boolean} Indicator of absence api token
   * @protected
   */
  _isNotJwtToken() {
    return typeof this._token !== 'string' || this._token.split('.').length !== 3;
  }

  /**
   * Checks that current token is not account token
   * @returns {boolean} Indicator of absence account token
   * @protected
   */
  _isNotAccountToken() {
    return typeof this._token !== 'string' || this._token.split('.').length !== 1;
  }

  /**
   * Handles no accessing to the method
   * @param {string} methodName Name of method
   * @protected
   * @throws
   */
  _handleNoAccessError(methodName) {
    return Promise.reject(new MethodAccessError(methodName, this._tokenType));
  }

}
