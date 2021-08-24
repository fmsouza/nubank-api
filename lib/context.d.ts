import { AuthState, Http, Routes } from "./utils/http";
import { Auth } from "./auth";
import { Account } from "./account";
import { Card } from "./card";
import { Payment } from "./payment";
interface NubankApiConstructor {
    certPath?: string;
    accessToken?: string;
    privateUrls?: Routes;
    publicUrls?: Record<string, string>;
}
export declare class Context {
    private _http;
    private _auth;
    private _account;
    private _card;
    private _payment;
    constructor(params?: NubankApiConstructor);
    get authState(): AuthState;
    get http(): Http;
    get auth(): Auth;
    get account(): Account;
    get card(): Card;
    get payment(): Payment;
}
export {};
