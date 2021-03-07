import { v4 as uuidv4 } from "uuid";

import { AuthState, Http, Routes } from "./http";

import {
  AccountTransaction,
  Bill,
  Boleto,
  Customer,
  Investment,
  MoneyRequest,
  PixKey,
  Transaction,
} from "./models";

import * as GqlOperations from './graphql-operations';

import {
  CLIENT_SECRET,
  PAYMENT_EVENT_TYPES,
} from "./constants";

interface ApiOptions {
  uuidAdapter: () => string;
}

interface NubankApiConstructor {
  certPath?: string;
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

  public generateQrCodeId(): string {
    return this.options.uuidAdapter();
  }

  private async authenticate(
    cpf: string,
    password: string
  ): Promise<void> {
    const { data } = await this.http.request("post", "login", {
      client_id: "other.conta",
      client_secret: CLIENT_SECRET,
      grant_type: "password",
      login: cpf,
      password,
    });
    this.http.accessToken = data.access_token;
    this.http.privateUrls = data._links;
  }

  public async authenticateWithQrCode(cpf: string, password: string, qrCodeId: string): Promise<void> {
    await this.authenticate(cpf, password);

    const data = await this.http.request("post", "lift", {
      qr_code_id: qrCodeId,
      type: "login-webapp",
    });

    this.http.accessToken = data?.access_token;
    this.http.privateUrls = {
      ...this.http.authState.privateUrls,
      ...data?._links,
    };
  }

  public async authenticateWithCertificate(cpf: string, password: string): Promise<void> {
    await this.authenticate(cpf, password);

    const { data } = await this.http.request("post", "token", {
      client_id: 'legacy_client_id',
      client_secret: 'legacy_client_secret',
      grant_type: 'password',
      login: cpf,
      password,
    });

    this.http.refreshToken = data?.refresh_token;
  }

  public async authenticateWithRefreshToken(refreshToken: string): Promise<void> {
    const { data } = await this.http.request("post", "token", {
      client_id: 'legacy_client_id',
      client_secret: 'legacy_client_secret',
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    this.http.accessToken = data?.access_token;
    this.http.refreshToken = data?.refresh_token;
  }

  public revokeAccess(): void {
    this.http.clearSession();
  }

  public async getPixKeys(): Promise<PixKey[]> {
    const { data } = await this.http.graphql(GqlOperations.QUERY_GET_PIX_KEYS);
    return data?.viewer?.savingsAccount;
  }

  public getCustomer(): Promise<Customer> {
    return this.http.request("get", "customer").then((data) => data.customer);
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

  public async getAccountInvestments(): Promise<Investment[]> {
    const { data } = await this.http.graphql(GqlOperations.QUERY_ACCOUNT_INVESTMENTS);
    return data?.viewer?.savingsAccount?.redeemableDeposits;
  }

  private async getBillDetails(bill: Bill): Promise<Bill> {
    const url: string = bill?._links?.self?.href ?? "";
    if (!url) {
      return bill;
    }
    const response: any = await this.http.request("get", url);
    return response.bill;
  }

  public async createBoleto(amount: number): Promise<Boleto> {
    const { data: accountIdData } = await this.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const customerId: string = accountIdData?.viewer?.id;

    const input = {
      amount: String(amount),
      customerId
    };

    const { data: boletoData } = await this.http.graphql(GqlOperations.MUTATION_CREATE_BOLETO, { input });
    return boletoData?.createTransferInBoleto?.boleto;
  }

  public async createMoneyRequest(amount: number): Promise<MoneyRequest> {
    const { data: accountIdData } = await this.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const savingsAccountId: string = accountIdData?.viewer?.savingsAccount?.id;

    const input = {
      amount: String(amount),
      savingsAccountId
    };

    const { data: moneyRequestData } = await this.http.graphql(GqlOperations.MUTATION_CREATE_MONEY_REQUEST, { input });
    return moneyRequestData?.createMoneyRequest;
  }

  public async createPixRequest(amount: number): Promise<MoneyRequest> {
    const { data: accountIdData } = await this.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const savingsAccountId: string = accountIdData?.viewer?.savingsAccount?.id;

    const input = {
      amount: String(amount),
      savingsAccountId
    };

    const { data: moneyRequestData } = await this.http.graphql(GqlOperations.MUTATION_CREATE_MONEY_REQUEST, { input });
    return moneyRequestData?.createMoneyRequest;
  }
}
