import { Context } from "./context";
import { Pkcs12Asn1 } from "./utils/cert";
declare type RequestAuthenticationCodeInput = {
    cpf: string;
    password: string;
    deviceId: string;
};
declare type ExchangeCertificatesInput = RequestAuthenticationCodeInput & {
    authCode: string;
};
export declare class Auth {
    private _context;
    private _keyPair;
    private _keyPairCrypto;
    private _encryptedCode;
    constructor(_context: Context);
    private authenticate;
    authenticateWithQrCode(cpf: string, password: string, qrCodeId: string): Promise<void>;
    authenticateWithCertificate(cpf: string, password: string, certPath?: string): Promise<void>;
    authenticateWithRefreshToken(refreshToken: string): Promise<void>;
    requestAuthenticationCode({ cpf, password, deviceId, }: RequestAuthenticationCodeInput): Promise<string>;
    exchangeCertificates({ cpf, password, deviceId, authCode, }: ExchangeCertificatesInput): Promise<{
        cert: Pkcs12Asn1;
        certCrypto: Pkcs12Asn1;
    }>;
    private updateAuthState;
    revokeAccess(): void;
}
export {};
