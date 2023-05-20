/// <reference types="node" />
import { Context } from "./context";
type RequestAuthenticationCodeInput = {
    cpf: string;
    password: string;
    deviceId: string;
};
type ExchangeCertificatesInput = RequestAuthenticationCodeInput & {
    authCode: string;
};
export declare class Auth {
    private _context;
    private _keyPair;
    private _keyPairCrypto;
    private _encryptedCode;
    get context(): Context;
    constructor(_context: Context);
    private authenticate;
    authenticateWithQrCode(cpf: string, password: string, qrCodeId: string): Promise<void>;
    authenticateWithCertificate(cpf: string, password: string, cert?: Buffer): Promise<void>;
    authenticateWithRefreshToken(refreshToken: string): Promise<void>;
    requestAuthenticationCode({ cpf, password, deviceId, }: RequestAuthenticationCodeInput): Promise<string>;
    exchangeCertificates({ cpf, password, deviceId, authCode, }: ExchangeCertificatesInput): Promise<{
        cert: Buffer;
        certCrypto: Buffer;
    }>;
    private updateAuthState;
    revokeAccess(): void;
}
export {};
