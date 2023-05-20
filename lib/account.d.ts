import { AccountTransaction, Customer, Investment, PixKey } from "./models";
import { Context } from "./context";
export declare class Account {
    private _context;
    private _accountId;
    private _customerId;
    get context(): Context;
    constructor(_context: Context);
    me(): Promise<Customer>;
    private ready;
    getId(): Promise<string>;
    getCustomerId(): Promise<string>;
    getPixKeys(): Promise<PixKey[]>;
    getBalance(): Promise<number>;
    /**
     *
     * @deprecated Use getFeedPaginated instead
     */
    getFeed(): Promise<AccountTransaction[]>;
    /**
     *
     * @deprecated Use getTransactionsPaginated instead
     */
    getTransactions(): Promise<AccountTransaction[]>;
    getFeedPaginated(cursor?: string): Promise<{
        items: AccountTransaction[];
        nextCursor?: string;
    }>;
    getTransactionsPaginated(cursor?: string): Promise<AccountTransaction[]>;
    getInvestments(): Promise<Investment[]>;
}
