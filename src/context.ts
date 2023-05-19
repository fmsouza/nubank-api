import { AuthState, HttpClient, HttpClientConstructor } from "./http";

import { Auth } from "./auth";
import { Account } from "./account";
import { Card } from "./card";
import { Payment } from "./payment";

export class Context {
  private _http: HttpClient;
  private _auth: Auth;
  private _account: Account;
  private _card: Card;
  private _payment: Payment;

  public constructor(params?: HttpClientConstructor) {
    this._http = new HttpClient(params);
    this._auth = new Auth(this);
    this._account = new Account(this);
    this._card = new Card(this);
    this._payment = new Payment(this);
  }

  public get authState(): AuthState {
    return this._http.authState;
  }

  public get http(): HttpClient {
    return this._http;
  }

  public get auth(): Auth {
    return this._auth;
  }

  public get account(): Account {
    return this._account;
  }

  public get card(): Card {
    return this._card;
  }

  public get payment(): Payment {
    return this._payment;
  }
}
