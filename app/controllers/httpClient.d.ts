export default class HttpClient {

  constructor(timeout?: number, extendedTimeout?: number, retryOpts?: RetryOptions);

  request(options: Object): Promise<Object> | Promise<string> | Promise<any>;

  requestWithFailover(options: Object): Promise<Object> | Promise<string> | Promise<any>;
}

export declare type RetryOptions = {

  retries?: number,

  minDelayInSeconds?: number,

  maxDelayInSeconds?: number
}