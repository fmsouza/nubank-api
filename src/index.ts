import { v4 as uuidv4 } from "uuid";

import { Http } from "./http";

import {
  AccountTransaction,
  AuthState,
  Bill,
  Routes,
  Transaction,
} from "./types";

import * as GqlOperations from './graphql-operations';

import {
  CLIENT_SECRET,
  PAYMENT_EVENT_TYPES,
} from "./constants";

interface ApiOptions {
  uuidAdapter: () => string;
}

interface NubankApiConstructor {
  accessToken?: string;
  privateUrls?: Routes;
  publicUrls?: Record<string, string>;
  options?: ApiOptions;
}

export default class NubankApi {
  private http: Http;
  private options: ApiOptions;

  public get authState(): AuthState {
    return this.http.authState;
  }

  public constructor(params: NubankApiConstructor = {}) {
    this.http = new Http(params);
    this.options = params?.options ?? {
      uuidAdapter: uuidv4
    };
  }

  public async login(
    cpf: string,
    password: string
  ): Promise<string> {
    const { data } = await this.http.request("post", "login", {
      client_id: "other.conta",
      client_secret: CLIENT_SECRET,
      grant_type: "password",
      login: cpf,
      password,
    });
    this.http.accessToken = data.access_token;
    this.http.privateUrls = data._links;
    return this.options.uuidAdapter();
  }

  public async validateLogin(code: string): Promise<void> {
    const data = await this.http.request("post", "lift", {
      qr_code_id: code,
      type: "login-webapp",
    });

    this.http.accessToken = data?.access_token;
    this.http.privateUrls = {
      ...this.http.authState.privateUrls,
      ...data?._links,
    };
  }

  public getCardFeed(): Promise<Transaction[]> {
    return this.http.request("get", "events").then((data) => data.events);
  }

  public getCardTransactions(): Promise<Transaction[]> {
    return this.getCardFeed().then((feed) =>
      feed.filter((statement) => statement.category === "transaction")
    );
  }

  public getBills(): Promise<Bill[]> {
    return this.http.request("get", "bills_summary").then((data) =>
      Promise.all(data.bills.map((bill: Bill) => this.getBillDetails(bill)))
    );
  }

  public async getAccountBalance(): Promise<number> {
    const data = await this.http.graphql(GqlOperations.QUERY_ACCOUNT_BALANCE);
    return data.viewer?.savingsAccount?.currentSavingsBalance?.netAmount;
  }

  public async getAccountFeed(): Promise<AccountTransaction[]> {
    const data = await this.http.graphql(GqlOperations.QUERY_ACCOUNT_FEED);
    return data?.viewer?.savingsAccount?.feed;
  }

  public getAccountTransactions(): Promise<AccountTransaction[]> {
    return this.getAccountFeed().then((feed) =>
      feed.filter((statement) =>
        PAYMENT_EVENT_TYPES.includes(statement.__typename)
      )
    );
  }

  private async getBillDetails(bill: Bill): Promise<Bill> {
    const url: string = bill?._links?.self?.href ?? "";
    if (!url) {
      return bill;
    }
    const response: any = await this.http.request("get", url);
    return response.bill;
  }
}
