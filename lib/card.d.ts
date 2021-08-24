import { CardTransaction } from "./models";
import { Context } from "./context";
export declare class Card {
    private _context;
    constructor(_context: Context);
    getFeed(): Promise<CardTransaction[]>;
    getTransactions(): Promise<CardTransaction[]>;
}
