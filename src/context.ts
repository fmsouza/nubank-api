import { v4 as uuidv4 } from "uuid";

import { AuthState, Http, Routes } from "./utils/http";

import { Auth } from "./auth";
import { Account } from "./account";
import { Card } from "./card";
import { Payment } from "./payment";

interface Adapters {
  uuid: Function;
}

interface ApiOptions {
  uuidAdapter: () => string;
}

interface NubankApiConstructor {
  certPath?: string;
  accessToken?: string;
  privateUrls?: Routes;
  publicUrls?: Record<string, string>;
  options?: ApiOptions;
}

export class Context {
  private _options: ApiOptions;
  private _http: Http;
  private _auth: Auth;
  private _account: Account;
  private _card: Card;
  private _payment: Payment;

  public constructor(params: NubankApiConstructor = {}) {
    this._options = params?.options ?? {
      uuidAdapter: uuidv4
    };
    this._http = new Http(params);
    this._auth = new Auth(this);
    this._account = new Account(this);
    this._card = new Card(this);
    this._payment = new Payment(this);
  }

  public get authState(): AuthState {
    return this._http.authState;
  }

  public get adapters(): Adapters {
    return {
      uuid: this._options.uuidAdapter
    };
  }

  public get http(): Http {
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
