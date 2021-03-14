import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  AccountTransaction,
  AuthState,
  Bill,
  CustomParams,
  Routes,
  Transaction,
  UUIDProcessingCallback,
} from "./types";

import {
  CLIENT_SECRET,
  DISCOVERY_APP_URL,
  DISCOVERY_URL,
  GRAPHQL_QUERY_ACCOUNT_BALANCE,
  GRAPHQL_QUERY_ACCOUNT_FEED,
  HEADERS,
  PAYMENT_EVENT_TYPES,
} from "./constants";

interface ApiOptions {
  uuidAdapter: () => string;
}

interface NubankApiConstructor {
  accessToken?: string;
  privateUrls?: Routes;
  publicUrls?: CustomParams<string>;
  options?: ApiOptions;
}

export default class NubankApi {
  private accessToken: string = "";
  private privateUrls: Routes = {};
  private publicUrls: CustomParams<string> = {};
  private options: ApiOptions = {
    uuidAdapter: uuidv4,
  };

  private get authState(): AuthState {
    return {
      accessToken: this.accessToken,
      privateUrls: this.privateUrls,
      publicUrls: this.publicUrls,
    };
  }

  public constructor(params: NubankApiConstructor = {}) {
    if (params.accessToken) {
      this.accessToken = params.accessToken;
    }
    if (params.privateUrls) {
      this.privateUrls = params.privateUrls;
    }
    if (params.publicUrls) {
      this.publicUrls = params.publicUrls;
    }
    if (params.options) {
      this.options = params.options;
    }
  }

  public async login(
    cpf: string,
    password: string,
    validateCallback?: UUIDProcessingCallback
  ): Promise<AuthState | string> {
    const url = await this.getUrl("login");
    if (this.accessToken && this.privateUrls) {
      return this.authState;
    }

    const options: any = {
      data: {
        client_id: "other.conta",
        client_secret: CLIENT_SECRET,
        grant_type: "password",
        login: cpf,
        password,
      },
      headers: HEADERS,
      method: "post",
      url,
    };
    const { data } = await axios(options);
    this.accessToken = data.access_token;
    this.privateUrls = data._links;
    const uuid: string = this.options.uuidAdapter();
    if (!validateCallback) return uuid;
    await validateCallback(uuid);
    return this.validateLogin(uuid);
  }

  public getCardFeed(): Promise<Transaction[]> {
    return this.__request("get", "events").then((data) => data.events);
  }

  public getCardTransactions(): Promise<Transaction[]> {
    return this.getCardFeed().then((feed) =>
      feed.filter((statement) => statement.category === "transaction")
    );
  }

  public getBills(options: {
    getFutureBillsDetails?: boolean;
    billsAfterDueDate?: Date;
  }): Promise<Bill[]> {

    options = { getFutureBillsDetails: false, ...options };

    return this.__request("get", "bills_summary").then((data) => {

      const futureBillsUrl = data._links?.future?.href;

      if (options.getFutureBillsDetails && futureBillsUrl) {

        return this.__request("get", futureBillsUrl)
          .then(dataFuture => {

            const oldAndCurrentBills = data.bills.filter(bill => bill.state != 'future');
            let allBills = dataFuture.bills.concat(oldAndCurrentBills);

            if (options.billsAfterDueDate) {
              
              allBills = allBills.filter(bill => this.parseDate(bill.summary.due_date) >= (options.billsAfterDueDate as Date));
            }

            return Promise.all(allBills.map((bill: Bill) => this.getBillDetails(bill)));
          });
      }
      else
        return Promise.all(data.bills.map((bill: Bill) => this.getBillDetails(bill)));
    });
  }

  public async getAccountBalance(): Promise<number> {
    const query = GRAPHQL_QUERY_ACCOUNT_BALANCE;
    const { data } = await this.__request("post", "ghostflame", { query });
    return data.viewer?.savingsAccount?.currentSavingsBalance?.netAmount;
  }

  public async getAccountFeed(): Promise<AccountTransaction[]> {
    const query = GRAPHQL_QUERY_ACCOUNT_FEED;
    const { data } = await this.__request("post", "ghostflame", { query });
    return data?.viewer?.savingsAccount?.feed;
  }

  public getAccountTransactions(): Promise<AccountTransaction[]> {
    return this.getAccountFeed().then((feed) =>
      feed.filter((statement) =>
        PAYMENT_EVENT_TYPES.includes(statement.__typename)
      )
    );
  }

  public async validateLogin(code: string): Promise<AuthState> {
    const payload: CustomParams<string> = {
      qr_code_id: code,
      type: "login-webapp",
    };

    const { access_token, _links } = await this.__request(
      "post",
      "lift",
      payload
    );
    this.accessToken = access_token;
    this.privateUrls = {
      ...this.privateUrls,
      ..._links,
    };
    return this.authState;
  }

  private async ready(): Promise<void> {
    const numberOfUrls: number = Object.keys(this.publicUrls).length;
    if (numberOfUrls > 0) {
      return;
    }
    const [baseUrls, appUrls] = await Promise.all([
      axios.get(DISCOVERY_URL).then((r) => r.data),
      axios.get(DISCOVERY_APP_URL).then((r) => r.data),
    ]);
    this.publicUrls = { ...baseUrls, ...appUrls };
  }

  private async getUrl(id: string): Promise<string> {
    await this.ready();
    if (this.publicUrls[id]) {
      return this.publicUrls[id];
    }
    if (this.privateUrls[id]) {
      return this.privateUrls[id].href;
    }
    throw new Error(`URL for '${id}' does not exist.`);
  }

  private isUrl(url: string): boolean {
    return url.startsWith("http");
  }

  private async __request(
    method: string,
    id: string,
    body?: any,
    params?: any
  ): Promise<any> {
    const url: string = this.isUrl(id) ? id : await this.getUrl(id);

    const options: any = {
      data: body,
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${this.accessToken}`,
      },
      method,
      params,
      url,
    };
    const { data } = await axios(options);
    return data;
  }

  private async getBillDetails(bill: Bill): Promise<Bill> {
    const url: string = bill?._links?.self?.href || "";
    if (!url) {
      return bill;
    }
    const response: any = await this.__request("get", url);
    return response.bill;
  }

  private parseDate(dateStr: string) {

    const dateParts = dateStr.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2]));
  }
}
