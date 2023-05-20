import { PAYMENT_EVENT_TYPES } from "./constants";
import { AccountTransaction, Customer, Investment, PixKey } from "./models";
import { AuthType, Context } from "./context";
import * as GqlOperations from "./utils/graphql-operations";
import { parseGenericTransaction } from "./utils/parsing";
import { RequiresAuth } from "./utils/decorators";

export class Account {
  private _accountId: string = "";
  private _customerId: string = "";

  public get context(): Context {
    return this._context;
  }

  public constructor(private _context: Context) {}

  @RequiresAuth(AuthType.CERT, AuthType.WEB)
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

  @RequiresAuth(AuthType.CERT)
  public async getId(): Promise<string> {
    await this.ready();
    return this._accountId;
  }

  @RequiresAuth(AuthType.CERT)
  public async getCustomerId(): Promise<string> {
    await this.ready();
    return this._customerId;
  }

  @RequiresAuth(AuthType.CERT)
  public async getPixKeys(): Promise<PixKey[]> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_GET_PIX_KEYS
    );
    return data?.viewer?.savingsAccount?.dict?.keys;
  }

  @RequiresAuth(AuthType.CERT)
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
  @RequiresAuth(AuthType.CERT)
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
  @RequiresAuth(AuthType.CERT)
  public getTransactions(): Promise<AccountTransaction[]> {
    return this.getFeed().then((feed) =>
      feed.filter((statement) =>
        PAYMENT_EVENT_TYPES.includes(statement.__typename)
      )
    );
  }

  @RequiresAuth(AuthType.CERT)
  public async getFeedPaginated(
    cursor?: string
  ): Promise<{ items: AccountTransaction[]; nextCursor?: string }> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_ACCOUNT_FEED_PAGINATED,
      { cursor }
    );
    const { feedItems } = data?.viewer?.savingsAccount ?? {};
    const items =
      feedItems?.edges.map((edge: any) => parseGenericTransaction(edge.node)) ??
      [];
    const nextCursor = feedItems?.pageInfo?.hasNextPage
      ? feedItems?.edges?.slice(-1)[0]?.cursor
      : undefined;

    return { items, nextCursor };
  }

  @RequiresAuth(AuthType.CERT)
  public getTransactionsPaginated(
    cursor?: string
  ): Promise<AccountTransaction[]> {
    return this.getFeedPaginated(cursor).then(({ items }) =>
      items.filter((statement) => statement.amount! > 0)
    );
  }

  @RequiresAuth(AuthType.CERT)
  public async getInvestments(): Promise<Investment[]> {
    const { data } = await this._context.http.graphql(
      GqlOperations.QUERY_ACCOUNT_INVESTMENTS
    );
    return data?.viewer?.savingsAccount?.redeemableDeposits;
  }
}
