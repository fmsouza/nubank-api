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
  private _http: Http;
  private options: ApiOptions;

  public constructor(params: NubankApiConstructor = {}) {
    this._http = new Http(params);
    this.options = params?.options ?? {
      uuidAdapter: uuidv4
    };
  }

  public get authState(): AuthState {
    return this._http.authState;
  }

  public get adapters(): Adapters {
    return {
      uuid: this.options.uuidAdapter
    };
  }

  public get http(): Http {
    return this._http;
  }

  public get auth(): Auth {
    return new Auth(this);
  }

  public get account(): Account {
    return new Account(this);
  }

  public get card(): Card {
    return new Card(this);
  }

  public get payment(): Payment {
    return new Payment(this);
  }
}
