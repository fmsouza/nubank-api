import { AccountTransaction, AuthState, Bill, CustomParams, Routes, Transaction, UUIDProcessingCallback } from "./types";
interface ApiOptions {
    uuidAdapter: () => string;
}
interface NubankApiConstructor {
    accessToken?: string;
    privateUrls?: Routes;
    publicUrls?: CustomParams<string>;
    options?: ApiOptions;
}
export default class NubankApi {
    private accessToken;
    private privateUrls;
    private publicUrls;
    private options;
    private get authState();
    constructor(params?: NubankApiConstructor);
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
export {};
