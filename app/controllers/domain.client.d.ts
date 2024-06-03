import HttpClient from "./httpClient";

export default class DomainClient {

  constructor(httpClient: HttpClient, token: string, domain: string);

  get domain(): string;

  get token(): string;

  requestCopyFactory(opts: Object): Promise<any>;

  request(opts: Object): Promise<any>;

  requestSignal(opts: Object, host: Object, accountId: string): Promise<any>;

  getSignalClientHost(regions: string[]): string;

  getAccountInfo(accountId: string): Promise<any>;

}

interface AccountInfo {

  id: string;

  regions: string[];

}
