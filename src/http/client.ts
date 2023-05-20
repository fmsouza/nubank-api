import axios, { AxiosRequestConfig, Method } from "axios";

import { DISCOVERY_APP_URL, DISCOVERY_URL, HEADERS } from "../constants";

type Route = {
  href: string;
};

type Env = "node" | "rn" | "web";

export type Routes = Record<string, Route>;

export type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  refreshBefore?: Date;
  privateUrls: Routes;
  publicUrls: Record<string, string>;
};

export type HttpClientConstructor = {
  clientName?: string;
  cert?: Buffer;
  accessToken?: string;
  refreshToken?: string;
  refreshBefore?: string;
  privateUrls?: Routes;
  publicUrls?: Record<string, string>;
  env?: Env;
};

export class HttpClient {
  private _clientName: string;
  private _cert?: Buffer;
  private _accessToken: string = "";
  private _refreshToken: string = "";
  private _refreshBefore?: Date;
  private _privateUrls: Routes;
  private _publicUrls: Record<string, string>;
  private _env: Env;

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

  public set cert(cert: Buffer) {
    this._cert = cert;
  }

  public set privateUrls(privateUrls: Routes) {
    this._privateUrls = privateUrls;
  }

  public constructor(params: HttpClientConstructor = {}) {
    this._clientName = params?.clientName ?? "Nubank API";
    this._cert = params?.cert;
    this.accessToken = params?.accessToken ?? "";
    this.refreshToken = params?.refreshToken ?? "";
    this.refreshBefore = params?.refreshBefore ?? "";
    this._privateUrls = params?.privateUrls ?? {};
    this._publicUrls = params?.publicUrls ?? {};
    this._env = params?.env ?? "node";
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

    let httpsAgent: any;
    if (this._cert) {
      const { Agent } = await import("https");
      httpsAgent = new Agent({
        rejectUnauthorized: false,
        passphrase: "",
        pfx: this._cert,
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

  public async graphql(query: string, variables?: any): Promise<any> {
    try {
      const response = await this.request("post", "ghostflame", {
        query,
        variables,
      });
      return response;
    } catch (e) {
      const error = e as any;
      throw error.response.data.errors[0] ?? error;
    }
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
