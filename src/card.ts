import { Bill, CardTransaction } from "./models";
import { AuthType, Context } from "./context";
import { RequiresAuth } from "./utils/decorators";

export class Card {
  public get context(): Context {
    return this._context;
  }

  public constructor(private _context: Context) {}

  @RequiresAuth(AuthType.CERT, AuthType.WEB)
  public getFeed(): Promise<CardTransaction[]> {
    return this._context.http
      .request("get", "events")
      .then((data) => data.events);
  }

  @RequiresAuth(AuthType.CERT, AuthType.WEB)
  public getTransactions(): Promise<CardTransaction[]> {
    return this.getFeed().then((feed) =>
      feed.filter((statement) => statement.category === "transaction")
    );
  }

  @RequiresAuth(AuthType.CERT, AuthType.WEB)
  public getPayments(): Promise<any[]> {
    return this.getFeed().then((feed) =>
      feed.filter((statement) => statement.category === "payment")
    );
  }

  @RequiresAuth(AuthType.CERT, AuthType.WEB)
  public async getBills(options: {
    getFutureBillsDetails?: boolean;
    billsAfterDueDate?: Date;
  }): Promise<Bill[]> {
    options = { getFutureBillsDetails: false, ...options };

    const data = await this._context.http.request("get", "bills_summary");

    const futureBillsUrl = data._links?.future?.href;
    let bills = data.bills;

    if (options.getFutureBillsDetails && futureBillsUrl) {
      const dataFuture = await this._context.http.request(
        "get",
        futureBillsUrl
      );
      const closedAndOpenedBills = data.bills.filter(
        (bill: Bill) => bill.state !== "future"
      );
      bills = dataFuture.bills.concat(closedAndOpenedBills);
    }

    if (options.billsAfterDueDate) {
      bills = bills.filter(
        (bill: Bill) =>
          this.parseDate(bill.summary.due_date) >=
          (options.billsAfterDueDate as Date)
      );
    }

    return await Promise.all(
      bills.map((bill: Bill) => this.getBillDetails(bill))
    );
  }

  @RequiresAuth(AuthType.CERT, AuthType.WEB)
  public async getBillDetails(bill: Bill): Promise<Bill> {
    const url: string = bill?._links?.self?.href ?? "";
    if (!url) {
      return bill;
    }
    const response: any = await this._context.http.request("get", url);
    return response.bill;
  }

  private parseDate(dateStr: string): Date {
    const dateParts = dateStr.split("-");
    return new Date(
      parseInt(dateParts[0], 10),
      parseInt(dateParts[1], 10),
      parseInt(dateParts[2], 10)
    );
  }
}
