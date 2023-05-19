import { PAYMENT_EVENT_TYPES } from "./constants";
import {
  AccountTransaction,
  Customer,
  Investment,
  PixKey,
} from "./models";
import { Context } from "./context";
import * as GqlOperations from "./utils/graphql-operations";
import { parseGenericTransaction } from "./utils/parsing";

export class Account {
  private _accountId: string = "";
  private _customerId: string = "";

  public constructor(private _context: Context) {}

  public me(): Promise<Customer> {
    return this._context.http
      .request("get", "customer")
      .then((data) => data.customer);
  }

  private async ready(): Promise<void> {
    if (!this._accountId || !this._customerId) {
      const { data } = await this._context.http.graphql(
        GqlOperations.QUERY_ACCOUNT_ID
      );
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
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_GET_PIX_KEYS
    );
    return data?.viewer?.savingsAccount?.dict?.keys;
  }

  public async getBalance(): Promise<number> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_ACCOUNT_BALANCE
    );
    return data.viewer?.savingsAccount?.currentSavingsBalance?.netAmount;
  }

  /**
   * 
   * @deprecated Use getFeedPaginated instead
   */
  public async getFeed(): Promise<AccountTransaction[]> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_ACCOUNT_FEED
    );
    return data?.viewer?.savingsAccount?.feed.map(parseGenericTransaction);
  }

  /**
   * 
   * @deprecated Use getTransactionsPaginated instead
   */
  public getTransactions(): Promise<AccountTransaction[]> {
    return this.getFeed().then((feed) =>
      feed.filter((statement) =>
        PAYMENT_EVENT_TYPES.includes(statement.__typename)
      )
    );
  }

  public async getFeedPaginated(cursor?: string): Promise<{items: AccountTransaction[], nextCursor?: string}> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_ACCOUNT_FEED_PAGINATED,
      { cursor }
    );
    const { feedItems } = data?.viewer?.savingsAccount ?? {};
    const items = feedItems?.edges.map((edge: any) => parseGenericTransaction(edge.node)) ?? [];
    const nextCursor = feedItems?.pageInfo?.hasNextPage ? feedItems?.edges?.slice(-1)[0]?.cursor : undefined;

    return { items, nextCursor };
  }

  public getTransactionsPaginated(cursor?: string): Promise<AccountTransaction[]> {
    return this.getFeedPaginated(cursor).then(({ items }) =>
      items.filter((statement) => statement.amount! > 0)
    );
  }

  public async getInvestments(): Promise<Investment[]> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_ACCOUNT_INVESTMENTS
    );
    return data?.viewer?.savingsAccount?.redeemableDeposits;
  }
}
