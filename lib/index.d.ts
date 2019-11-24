import { AccountTransaction, AuthState, Bill, CustomParams, Routes, Transaction, UUIDProcessingCallback } from "./types";
export default class NubankApi {
    private accessToken;
    private privateUrls;
    private publicUrls;
    private get authState();
    constructor(accessToken?: string, privateUrls?: Routes, publicUrls?: CustomParams<string>);
    login(cpf: string, password: string, secondStepFn: UUIDProcessingCallback): Promise<AuthState>;
    getCardFeed(): Promise<Transaction[]>;
    getCardTransactions(): Promise<Transaction[]>;
    getBills(): Promise<Bill[]>;
    getAccountBalance(): Promise<number>;
    getAccountFeed(): Promise<AccountTransaction[]>;
    getAccountTransactions(): Promise<AccountTransaction[]>;
    private __authenticateWithQRCode;
    private ready;
    private getUrl;
    private isUrl;
    private __request;
    private getBillDetails;
}
