'use strict';

import axios from '@axios';
import {
  UnauthorizedError, ForbiddenError, ApiError, ValidationError, InternalError, 
  NotFoundError, TooManyRequestsError, ConflictError
} from './errorHandler';
import TimeoutError from './timeoutError';

/**
 * HTTP client library based on request-promise
 */
export default class HttpClient {

  /**
   * @typedef {Object} RetryOptions retry options
   * @property {Number} [retries] the number of attempts to retry failed request, default 5
   * @property {Number} [minDelayInSeconds] minimum delay in seconds before retrying, default 1
   * @property {Number} [maxDelayInSeconds] maximum delay in seconds before retrying, default 30
   */

  /**
   * Constructs HttpClient class instance
   * @param {Number} [timeout] request timeout in seconds
   * @param {Number} [extendedTimeout] request timeout in seconds
   * @param {RetryOptions} [retryOpts] retry options
   */
  constructor(timeout = 10, extendedTimeout = 70, retryOpts = {}) {
    this._timeout = timeout * 1000;
    this._extendedTimeout = extendedTimeout * 1000;
    this._retries = retryOpts.retries || 5;
    this._minRetryDelay = (retryOpts.minDelayInSeconds || 1) * 1000;
    this._maxRetryDelay = (retryOpts.maxDelayInSeconds || 30) * 1000;
  }

  /**
   * Performs a request. Response errors are returned as ApiError or subclasses.
   * @param {Object} options request options
   * @param {Boolean} isExtendedTimeout whether to run the request with an extended timeout
   * @returns {Object|String|any} request result
   */
  async request(options, isExtendedTimeout, endTime = Date.now() + this._maxRetryDelay * this._retries) {
    options.timeout = isExtendedTimeout ? this._extendedTimeout : this._timeout;
    try {
      const response = await this._makeRequest(options);
      return (response && response.data) || undefined;
    } catch (err) {
      const error = this._convertError(err);
      if(error.name === 'TooManyRequestsError') {
        const retryTime = Date.parse(error.metadata.recommendedRetryTime);
        const date = Date.now();
        if (retryTime < endTime) {
          if(retryTime > date) {
            await this._wait(retryTime - date);
          }
          return await this.request(options, isExtendedTimeout, endTime);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Performs a request with a failover. Response errors are returned as ApiError or subclasses.
   * @param {Object} options request options
   * @returns {Object|String|any} request result
   */
  async requestWithFailover(options, retryCounter = 0, endTime = Date.now() + this._maxRetryDelay * this._retries) {
    options.timeout = this._timeout;
    let retryAfterSeconds = 0;
    options.callback = (e, res) => {
      if (res && res.status === 202) {
        retryAfterSeconds = res.headers['retry-after'];
      }
    };
    let body;
    try {
      const response = await this._makeRequest(options);
      options.callback(null, response);
      body = (response && response.data) || undefined;
    } catch (err) {
      retryCounter = await this._handleError(err, retryCounter, endTime);
      return this.requestWithFailover(options, retryCounter, endTime);
    }
    if (retryAfterSeconds) {
      await this._handleRetry(endTime, retryAfterSeconds * 1000);
      body = await this.requestWithFailover(options, retryCounter, endTime);
    }
    return body;
  }

  _makeRequest(options) {
    return axios({
      transitional: {
        clarifyTimeoutError: true,
      },
      ...options
    });
  }

  async _wait(pause) {
    await new Promise(res => setTimeout(res, pause));
  }

  async _handleRetry(endTime, retryAfter) {
    if(endTime > Date.now() + retryAfter) {
      await this._wait(retryAfter);
    } else {
      throw new TimeoutError('Timed out waiting for the response');
    }
  }

  async _handleError(err, retryCounter, endTime) {
    const error = this._convertError(err);
    if(['ConflictError', 'InternalError', 'ApiError', 'TimeoutError'].includes(error.name)
      && retryCounter < this._retries) {
      const pause = Math.min(Math.pow(2, retryCounter) * this._minRetryDelay, this._maxRetryDelay);
      await this._wait(pause);
      return retryCounter + 1;
    } else if(error.name === 'TooManyRequestsError') {
      const retryTime = Date.parse(error.metadata.recommendedRetryTime);
      if (retryTime < endTime) {
        await this._wait(retryTime - Date.now());
        return retryCounter;
      }
    }
    throw error;
  }

  // eslint-disable-next-line complexity
  _convertError(err) {
    const errorResponse = err.response || {};
    const errorData = errorResponse.data || {};
    const status = errorResponse.status || err.status;
    const url = err?.config?.url;

    const errMsg = errorData.message || err.message;
    const errMsgDefault = errorData.message || err.code || err.message;

    switch (status) {
    case 400:
      return new ValidationError(errMsg, errorData.details || err.details, url);
    case 401:
      return new UnauthorizedError(errMsg, url);
    case 403:
      return new ForbiddenError(errMsg, url);
    case 404:
      return new NotFoundError(errMsg, url);
    case 409:
      return new NotFoundError(errMsg, url);
    case 429:
      return new TooManyRequestsError(errMsg, errorData.metadata || err.metadata, url);
    case 500:
      return new InternalError(errMsg, url);
    default:
      return new ApiError(ApiError, errMsgDefault, status, url);
    }
  }
}

/**
 * HTTP client service mock for tests
 */
export class HttpClientMock extends HttpClient {

  /**
   * Constructs HTTP client mock
   * @param {Function(options:Object):Promise} requestFn mocked request function
   * @param {Number} timeout request timeout in seconds
   * @param {RetryOptions} retryOpts retry options
   */
  constructor(requestFn, timeout, extendedTimeout, retryOpts) {
    super(timeout, extendedTimeout, retryOpts);
    this._requestFn = requestFn;
  }

  _makeRequest() {
    return this._requestFn.apply(this, arguments);
  }

}
