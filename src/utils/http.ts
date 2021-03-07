import axios from 'axios';

import {
  DISCOVERY_APP_URL,
  DISCOVERY_URL,
  HEADERS,
} from "../constants";

interface Route {
  href: string;
}

export type Routes = Record<string, Route>;

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  privateUrls: Routes;
  publicUrls: Record<string, string>;
}

interface HttpConstructor {
  certPath?: string;
  accessToken?: string;
  refreshToken?: string;
  privateUrls?: Routes;
  publicUrls?: Record<string, string>;
}

export class Http {
  private _accessToken: string = "";
  private _refreshToken: string = "";
  private _privateUrls: Routes;
  private _publicUrls: Record<string, string>;

  public get authState(): AuthState {
    return {
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      privateUrls: this._privateUrls,
      publicUrls: this._publicUrls,
    };
  }

  public set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  public set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }

  public set privateUrls(privateUrls: Routes) {
    this._privateUrls = privateUrls;
  }

  public constructor(params: HttpConstructor = {}) {
    this.accessToken = params?.accessToken ?? "";
    this.refreshToken = params?.refreshToken ?? "";
    this._privateUrls = params?.privateUrls ?? {};
    this._publicUrls = params?.publicUrls ?? {};
  }

  public async ready(): Promise<void> {
    const numberOfUrls: number = Object.keys(this._publicUrls).length;
    if (numberOfUrls > 0) {
      return;
    }
    const [baseUrls, appUrls] = await Promise.all([
      axios.get(DISCOVERY_URL).then((r) => r.data),
      axios.get(DISCOVERY_APP_URL).then((r) => r.data),
    ]);
    this._publicUrls = { ...baseUrls, ...appUrls };
  }

  public async request(
    method: string,
    id: string,
    body?: any,
    params?: any
  ): Promise<any> {
    const url: string = this.isUrl(id) ? id : await this.getUrl(id);

    const options: any = {
      data: body,
      headers: {
        ...HEADERS,
        Authorization: this._accessToken && `Bearer ${this._accessToken}`,
      },
      method,
      params,
      url,
    };
    const { data } = await axios(options);
    return data;
  }

  public async graphql(query: string, variables?: any): Promise<any> {
    const { data } = await this.request("post", "ghostflame", { query, variables });
    return data;
  }

  public async getUrl(id: string): Promise<string> {
    await this.ready();
    if (this._publicUrls[id]) {
      return this._publicUrls[id];
    }
    if (this._privateUrls[id]) {
      return this._privateUrls[id].href;
    }
    throw new Error(`URL for '${id}' does not exist.`);
  }

  public clearSession(): void {
    this._accessToken = "";
    this._refreshToken = "";
    this._privateUrls = {};
  }

  private isUrl(url: string): boolean {
    return url.startsWith("http");
  }
}
