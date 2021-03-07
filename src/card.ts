import { CardTransaction } from "./models";
import { Context } from './context';

export class Card {

  public constructor(private _context: Context) { }

  public getFeed(): Promise<CardTransaction[]> {
    return this._context.http.request("get", "events").then((data) => data.events);
  }

  public getTransactions(): Promise<CardTransaction[]> {
    return this.getFeed().then((feed) =>
      feed.filter((statement) => statement.category === "transaction")
    );
  }
}