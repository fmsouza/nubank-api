import { Method } from "axios";
interface Route {
    href: string;
}
export declare type Routes = Record<string, Route>;
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
export declare class Http {
    private _clientName;
    private _certPath?;
    private _cert?;
    private _accessToken;
    private _refreshToken;
    private _refreshBefore?;
    private _privateUrls;
    private _publicUrls;
    get authState(): AuthState;
    get clientName(): string;
    set accessToken(accessToken: string);
    set refreshToken(refreshToken: string);
    set refreshBefore(datetime: string);
    set certPath(path: string);
    set privateUrls(privateUrls: Routes);
    constructor(params?: HttpConstructor);
    ready(): Promise<void>;
    private getHttpsCertificate;
    request(method: Method, id: string, body?: any, params?: any): Promise<any>;
    rawRequest(method: Method, id: string, body?: any, params?: any): Promise<any>;
    graphql(query: string, variables?: any): Promise<any>;
    getUrl(id: string): Promise<string>;
    clearSession(): void;
    private isUrl;
}
export {};
