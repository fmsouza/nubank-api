import { PAYMENT_EVENT_TYPES } from "./constants";
import { AccountTransaction, Bill, Customer, Investment, PixKey } from "./models";
import { Context } from './context';
import * as GqlOperations from './utils/graphql-operations';

export class Account {
  private _accountId: string = '';
  private _customerId: string = '';

  public constructor(private _context: Context) { }

  public me(): Promise<Customer> {
    return this._context.http.request("get", "customer").then((data) => data.customer);
  }

  private async ready(): Promise<void> {
    if (!this._accountId || !this._customerId) {
      const { data } = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
      this._accountId = data?.viewer?.savingsAccount?.id;
      this._customerId = data?.viewer?.id;
    }
  }

  public async getId(): Promise<string> {
    await this.ready();
    return this._accountId;
  }

  public async getCustomerId(): Promise<string> {
    await this.ready();
    return this._customerId;
  }

  public async getPixKeys(): Promise<PixKey[]> {
    const { data } = await this._context.http.graphql(GqlOperations.QUERY_GET_PIX_KEYS);
    return data?.viewer?.savingsAccount?.dict;
  }

  public async getBills(options: {
    getFutureBillsDetails?: boolean;
    billsAfterDueDate?: Date;
  }): Promise<Bill[]> {

    options = { getFutureBillsDetails: false, ...options };

    const data = await this._context.http.request("get", "bills_summary");

    const futureBillsUrl = data._links?.future?.href;
    let bills = data.bills;

    if (options.getFutureBillsDetails && futureBillsUrl) {

      const dataFuture = await this._context.http.request("get", futureBillsUrl);        
      const closedAndOpenedBills = data.bills.filter((bill: Bill) => bill.state != 'future');
      bills = dataFuture.bills.concat(closedAndOpenedBills);                                 
    }

    if (options.billsAfterDueDate) {
            
      bills = bills.filter((bill: Bill) => this.parseDate(bill.summary.due_date) >= (options.billsAfterDueDate as Date));
    }

    return await Promise.all(bills.map((bill: Bill) => this.getBillDetails(bill)));
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

  private parseDate(dateStr: string) {

    const dateParts = dateStr.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2]));
  }
}