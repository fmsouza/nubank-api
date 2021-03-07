import axios from 'axios';

import {
  AuthState,
  CustomParams,
  Routes,
} from "./types";

import {
  DISCOVERY_APP_URL,
  DISCOVERY_URL,
  HEADERS,
} from "./constants";

interface HttpConstructor {
  accessToken?: string;
  privateUrls?: Routes;
  publicUrls?: CustomParams<string>;
}

export class Http {
  private accessToken: string;
  private privateUrls: Routes;
  private publicUrls: CustomParams<string>;

  private get authState(): AuthState {
    return {
      accessToken: this.accessToken,
      privateUrls: this.privateUrls,
      publicUrls: this.publicUrls,
    };
  }

  public constructor(params: HttpConstructor = {}) {
    this.accessToken = params?.accessToken ?? "";
    this.privateUrls = params?.privateUrls ?? {};
    this.publicUrls = params?.publicUrls ?? {};
  }

  public async ready(): Promise<void> {
    const numberOfUrls: number = Object.keys(this.publicUrls).length;
    if (numberOfUrls > 0) {
      return;
    }
    const [baseUrls, appUrls] = await Promise.all([
      axios.get(DISCOVERY_URL).then((r) => r.data),
      axios.get(DISCOVERY_APP_URL).then((r) => r.data),
    ]);
    this.publicUrls = { ...baseUrls, ...appUrls };
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
        Authorization: `Bearer ${this.accessToken}`,
      },
      method,
      params,
      url,
    };
    const { data } = await axios(options);
    return data;
  }

  public async getUrl(id: string): Promise<string> {
    await this.ready();
    if (this.publicUrls[id]) {
      return this.publicUrls[id];
    }
    if (this.privateUrls[id]) {
      return this.privateUrls[id].href;
    }
    throw new Error(`URL for '${id}' does not exist.`);
  }

  private isUrl(url: string): boolean {
    return url.startsWith("http");
  }
}
