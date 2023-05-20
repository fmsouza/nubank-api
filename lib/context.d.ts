import { AuthState, HttpClient, HttpClientConstructor } from "./http";
import { Auth } from "./auth";
import { Account } from "./account";
import { Card } from "./card";
import { Payment } from "./payment";
export declare const enum AuthType {
    WEB = "Web",
    CERT = "Certificate"
}
export declare class Context {
    private _http;
    private _auth;
    private _account;
    private _card;
    private _payment;
    private _authType;
    constructor(params?: HttpClientConstructor);
    get authType(): AuthType;
    get authState(): AuthState;
    get http(): HttpClient;
    get auth(): Auth;
    get account(): Account;
    get card(): Card;
    get payment(): Payment;
}
