import { PAYMENT_EVENT_TYPES } from "./constants";
import { AccountTransaction, Bill, Customer, Investment, PixKey } from "./models";
import { Context } from './context';
import * as GqlOperations from './utils/graphql-operations';

export class Account {
  private _accountId: string = '';

  public constructor(private _context: Context) { }

  public me(): Promise<Customer> {
    return this._context.http.request("get", "customer").then((data) => data.customer);
  }

  public async getAccountId(): Promise<string> {
    if (this._accountId) {
      return this._accountId;
    }
    const { data: accountIdData } = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const savingsAccountId: string = accountIdData?.viewer?.savingsAccount?.id;
    this._accountId = savingsAccountId;
    return this._accountId;
  }

  public async getPixKeys(): Promise<PixKey[]> {
    const { data } = await this._context.http.graphql(GqlOperations.QUERY_GET_PIX_KEYS);
    return data?.viewer?.savingsAccount?.dict;
  }

  public getBills(): Promise<Bill[]> {
    return this._context.http.request("get", "bills_summary").then((data) =>
      Promise.all(data.bills.map((bill: Bill) => this.getBillDetails(bill)))
    );
  }

  public async getBalance(): Promise<number> {
    const data = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_BALANCE);
    return data.viewer?.savingsAccount?.currentSavingsBalance?.netAmount;
  }

  public async getFeed(): Promise<AccountTransaction[]> {
    const data = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_FEED);
    return data?.viewer?.savingsAccount?.feed;
  }

  public getTransactions(): Promise<AccountTransaction[]> {
    return this.getFeed().then((feed) =>
      feed.filter((statement) =>
        PAYMENT_EVENT_TYPES.includes(statement.__typename)
      )
    );
  }

  public async getInvestments(): Promise<Investment[]> {
    const { data } = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_INVESTMENTS);
    return data?.viewer?.savingsAccount?.redeemableDeposits;
  }

  private async getBillDetails(bill: Bill): Promise<Bill> {
    const url: string = bill?._links?.self?.href ?? "";
    if (!url) {
      return bill;
    }
    const response: any = await this._context.http.request("get", url);
    return response.bill;
  }
}