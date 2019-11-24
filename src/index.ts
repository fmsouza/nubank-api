import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { AuthState, CustomParams, Routes, UUIDProcessingCallback, Transaction, Bill, AccountTransaction } from './types';

import {
  CLIENT_SECRET,
  DISCOVERY_URL,
  DISCOVERY_APP_URL,
  HEADERS,
  GRAPHQL_QUERY_ACCOUNT_BALANCE,
  GRAPHQL_QUERY_ACCOUNT_FEED,
  PAYMENT_EVENT_TYPES
} from './constants';

export default class NubankApi {

  private get authState(): AuthState {
    return {
      accessToken: this.accessToken,
      urls: this.privateUrls
    };
  }

  public constructor(
    private accessToken: string,
    private privateUrls: Routes = {},
    private publicUrls: CustomParams<string> = {}
  ) {}

  public async login(cpf: string, password: string, secondStepFn: UUIDProcessingCallback): Promise<AuthState> {
    const url = await this.getUrl('login');
    if (this.accessToken && this.privateUrls) return this.authState;

    const options: any = {
      method: 'post',
      url,
      headers: HEADERS,
      data: {
        login: cpf,
        password,
        grant_type: 'password',
        client_id: 'other.conta',
        client_secret: CLIENT_SECRET
      }
    };
    const { data } = await axios(options);
    this.accessToken = data.access_token;
    this.privateUrls = data._links;
    return this.__authenticateWithQRCode(secondStepFn);
  }

  public getCardFeed(): Promise<Transaction[]> {
    return this.__request('get', 'events')
      .then(data => data.events);
  }

  public getCardTransactions(): Promise<Transaction[]> {
    return this.getCardFeed()
      .then(feed => feed.filter(statement => statement.category === 'transaction'));
  }

  public getBills(): Promise<Bill[]> {
    return this.__request('get', 'bills_summary')
      .then(data => Promise.all(
          data.bills.map(
            (bill: Bill) => this.getBillDetails(bill)
          )
        )
      );
  }

  public async getAccountBalance(): Promise<number> {
    const query = GRAPHQL_QUERY_ACCOUNT_BALANCE;
    const { data } = await this.__request('post', 'ghostflame', { query });
    return data.viewer?.savingsAccount?.currentSavingsBalance?.netAmount;
  }

  public async getAccountFeed(): Promise<AccountTransaction[]> {
     const query = GRAPHQL_QUERY_ACCOUNT_FEED;
     const { data } = await this.__request('post', 'ghostflame', { query });
     return data?.viewer?.savingsAccount?.feed;
  }

  public getAccountTransactions(): Promise<AccountTransaction[]> {
    return this.getAccountFeed()
      .then(feed => feed.filter(statement => PAYMENT_EVENT_TYPES.includes(statement.__typename)));
  }

  private async __authenticateWithQRCode(secondStepFn: UUIDProcessingCallback): Promise<any> {
    const qr_code_id: string = uuidv4();
    await secondStepFn(qr_code_id);

    const payload: CustomParams<string> = {
      qr_code_id,
      type: 'login-webapp'
    };

    const { access_token, _links } = await this.__request('post', 'lift', payload);
    this.accessToken = access_token;
    this.privateUrls = {
      ...this.privateUrls,
      ..._links
    };
    return this.authState;
  }

  private async ready(): Promise<void> {
    const numberOfUrls: number = Object.keys(this.publicUrls).length;
    if (numberOfUrls > 0) return;
    const [baseUrls, appUrls] = await Promise.all([
      axios.get(DISCOVERY_URL).then(r => r.data),
      axios.get(DISCOVERY_APP_URL).then(r => r.data)
    ])
    this.publicUrls = { ...baseUrls, ...appUrls };
  }

  private async getUrl(id: string): Promise<string> {
    await this.ready();
    if (this.publicUrls[id]) return this.publicUrls[id];
    if (this.privateUrls[id]) return this.privateUrls[id].href;
    throw new Error(`URL for '${id}' does not exist.`);
  }

  private isUrl(url: string): boolean {
    return url.startsWith('http');
  }

  private async __request(method: string, id: string, body?: any, params?: any): Promise<any> {
    const url: string = this.isUrl(id) ? id : await this.getUrl(id);

    const options: any = {
      method,
      url,
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${this.accessToken}`
      },
      data: body,
      params
    }
    const { data } = await axios(options);
    return data;
  }

  private async getBillDetails(bill: Bill): Promise<Bill> {
    const url: string = bill?._links?.self?.href || '';
    if (!url) return bill;
    const response: any = await this.__request('get', url);
    return response.bill;
  }
}
