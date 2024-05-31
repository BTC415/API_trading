import HttpClient from "./httpClient";

/**
 * Connection URL and request managing client
 */
export default class DomainClient {

  /**
   * Constructs domain client instance
   * @param {HttpClient} httpClient HTTP client
   * @param {string} token authorization token
   * @param {string} domain domain to connect to, default is agiliumtrade.agiliumtrade.ai
   */
  constructor(httpClient: HttpClient, token: string, domain: string);

  /**
   * Returns domain client domain
   * @returns {string} client domain
   */
  get domain(): string;

  /**
   * Returns domain client token
   * @returns {string} client token
   */
  get token(): string;

  /**
   * Sends a CopyFactory API request
   * @param {Object} opts options request options
   * @returns {Object|String|any} request result
   */
  requestCopyFactory(opts: Object): Promise<any>;

  /**
   * Sends an http request
   * @param {object} opts options request options
   * @returns {object|string|any} request result
   */
  request(opts: Object): Promise<any>;

  /**
   * Sends a signal client request
   * @param {Object} opts options request options 
   * @param {Object} host signal client host data
   * @param {string} accountId account id
   * @returns {Object|string|any} request result
   */
  requestSignal(opts: Object, host: Object, accountId: string): Promise<any>;

  /**
   * Returns CopyFactory host for signal client requests
   * @param {string[]} regions subscriber regions
   * @returns {string} signal client CopyFactory host
   */
  getSignalClientHost(regions: string[]): string;

  /**
   * Returns account data by id
   * @param {string} accountId account id
   * @returns {Object} account data
   */
  getAccountInfo(accountId: string): Promise<any>;

}

/**
 * Account request info
 */
interface AccountInfo {

  /**
   * Primary account id
   */
  id: string;

  /**
   * Account available regions
   */
  regions: string[];

}
