import axios, { AxiosRequestConfig, Method } from "axios";
import { Agent } from "https";
import { readFileSync } from "fs";

import { DISCOVERY_APP_URL, DISCOVERY_URL, HEADERS } from "../constants";

interface Route {
  href: string;
}

export type Routes = Record<string, Route>;

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  refreshBefore?: Date;
  privateUrls: Routes;
  publicUrls: Record<string, string>;
}

interface HttpConstructor {
  clientName?: string;
  certPath?: string;
  accessToken?: string;
  refreshToken?: string;
  refreshBefore?: string;
  privateUrls?: Routes;
  publicUrls?: Record<string, string>;
}

export class Http {
  private _clientName: string;
  private _certPath?: string;
  private _accessToken: string = "";
  private _refreshToken: string = "";
  private _refreshBefore?: Date;
  private _privateUrls: Routes;
  private _publicUrls: Record<string, string>;

  public get authState(): AuthState {
    return {
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      refreshBefore: this._refreshBefore,
      privateUrls: this._privateUrls,
      publicUrls: this._publicUrls,
    };
  }

  public get clientName(): string {
    return this._clientName;
  }

  public set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  public set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }

  public set refreshBefore(datetime: string) {
    this._refreshBefore = new Date(datetime);
  }

  public set privateUrls(privateUrls: Routes) {
    this._privateUrls = privateUrls;
  }

  public constructor(params: HttpConstructor = {}) {
    this._clientName = params?.clientName ?? "Nubank API";
    this._certPath = params?.certPath;
    this.accessToken = params?.accessToken ?? "";
    this.refreshToken = params?.refreshToken ?? "";
    this.refreshBefore = params?.refreshBefore ?? "";
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
    method: Method,
    id: string,
    body?: any,
    params?: any
  ): Promise<any> {
    const { data } = await this.rawRequest(method, id, body, params);
    return data;
  }

  public async rawRequest(
    method: Method,
    id: string,
    body?: any,
    params?: any
  ): Promise<any> {
    const url: string = this.isUrl(id) ? id : await this.getUrl(id);

    const headers = { ...HEADERS };
    if (this._accessToken) {
      // tslint:disable-next-line
      headers["Authorization"] = `Bearer ${this._accessToken}`;
    }

    let httpsAgent: Agent | undefined;
    if (this._certPath) {
      const certStream: Buffer = readFileSync(this._certPath);
      httpsAgent = new Agent({
        rejectUnauthorized: false,
        passphrase: "",
        pfx: certStream, // TODO: Fix error when certificate is added
      });
    }

    const options: AxiosRequestConfig = {
      data: body,
      headers,
      method,
      params,
      url,
      httpsAgent,
    };

    return axios(options);
  }

  public graphql(query: string, variables?: any): Promise<any> {
    return this.request("post", "ghostflame", { query, variables });
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
    this._refreshBefore = undefined;
    this._privateUrls = {};
  }

  private isUrl(url: string): boolean {
    return url.startsWith("http");
  }
}
