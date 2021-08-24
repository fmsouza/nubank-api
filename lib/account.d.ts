import { AccountTransaction, Bill, Customer, Investment, PixKey } from "./models";
import { Context } from "./context";
export declare class Account {
    private _context;
    private _accountId;
    private _customerId;
    constructor(_context: Context);
    me(): Promise<Customer>;
    private ready;
    getId(): Promise<string>;
    getCustomerId(): Promise<string>;
    getPixKeys(): Promise<PixKey[]>;
    getBills(options: {
        getFutureBillsDetails?: boolean;
        billsAfterDueDate?: Date;
    }): Promise<Bill[]>;
    getBalance(): Promise<number>;
    getFeed(): Promise<AccountTransaction[]>;
    getTransactions(): Promise<AccountTransaction[]>;
    getInvestments(): Promise<Investment[]>;
    private getBillDetails;
    private parseDate;
}
