/// <reference types="node" />
import { Method } from "axios";
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
export declare class HttpClient {
    private _clientName;
    private _cert?;
    private _accessToken;
    private _refreshToken;
    private _refreshBefore?;
    private _privateUrls;
    private _publicUrls;
    private _env;
    get authState(): AuthState;
    get clientName(): string;
    set accessToken(accessToken: string);
    set refreshToken(refreshToken: string);
    set refreshBefore(datetime: string);
    set cert(cert: Buffer);
    set privateUrls(privateUrls: Routes);
    constructor(params?: HttpClientConstructor);
    ready(): Promise<void>;
    request(method: Method, id: string, body?: any, params?: any): Promise<any>;
    rawRequest(method: Method, id: string, body?: any, params?: any): Promise<any>;
    graphql(query: string, variables?: any): Promise<any>;
    getUrl(id: string): Promise<string>;
    clearSession(): void;
    private isUrl;
}
export {};
