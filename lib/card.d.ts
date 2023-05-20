import { Bill, CardTransaction } from "./models";
import { Context } from "./context";
export declare class Card {
    private _context;
    get context(): Context;
    constructor(_context: Context);
    getFeed(): Promise<CardTransaction[]>;
    getTransactions(): Promise<CardTransaction[]>;
    getPayments(): Promise<any[]>;
    getBills(options: {
        getFutureBillsDetails?: boolean;
        billsAfterDueDate?: Date;
    }): Promise<Bill[]>;
    getBillDetails(bill: Bill): Promise<Bill>;
    private parseDate;
}
