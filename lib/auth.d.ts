import { Context } from "./context";
export declare class Auth {
    private _context;
    constructor(_context: Context);
    private authenticate;
    authenticateWithQrCode(cpf: string, password: string, qrCodeId: string): Promise<void>;
    authenticateWithCertificate(cpf: string, password: string): Promise<void>;
    authenticateWithRefreshToken(refreshToken: string): Promise<void>;
    private updateAuthState;
    revokeAccess(): void;
}
