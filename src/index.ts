import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { Http } from "./http";

import {
  AccountTransaction,
  AuthState,
  Bill,
  CustomParams,
  Routes,
  Transaction,
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
  private http: Http;
  private options: ApiOptions;

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
    const url = await this.getUrl("login");

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
    return this.options.uuidAdapter();
  }

  public async validateLogin(code: string): Promise<AuthState> {
    const payload: CustomParams<string> = {
      qr_code_id: code,
      type: "login-webapp",
    };

    const { access_token, _links } = await this.http.request(
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
    const query = GRAPHQL_QUERY_ACCOUNT_BALANCE;
    const { data } = await this.http.request("post", "ghostflame", { query });
    return data.viewer?.savingsAccount?.currentSavingsBalance?.netAmount;
  }

  public async getAccountFeed(): Promise<AccountTransaction[]> {
    const query = GRAPHQL_QUERY_ACCOUNT_FEED;
    const { data } = await this.http.request("post", "ghostflame", { query });
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
