import { CLIENT_SECRET } from "./constants";
import { Context } from "./context";

export class Auth {
  public constructor(private _context: Context) {}

  private async authenticate(cpf: string, password: string): Promise<void> {
    const data = await this._context.http.request("post", "login", {
      client_id: "other.conta",
      client_secret: CLIENT_SECRET,
      grant_type: "password",
      login: cpf,
      password,
    });

    this.updateAuthState(data);
  }

  public async authenticateWithQrCode(
    cpf: string,
    password: string,
    qrCodeId: string
  ): Promise<void> {
    await this.authenticate(cpf, password);

    const data = await this._context.http.request("post", "lift", {
      qr_code_id: qrCodeId,
      type: "login-webapp",
    });

    this.updateAuthState(data);
  }

  public async authenticateWithCertificate(
    cpf: string,
    password: string
  ): Promise<void> {
    const data = await this._context.http.request("post", "token", {
      client_id: "legacy_client_id",
      client_secret: "legacy_client_secret",
      grant_type: "password",
      login: cpf,
      password,
    });

    this.updateAuthState(data);
  }

  public async authenticateWithRefreshToken(
    refreshToken: string
  ): Promise<void> {
    const data = await this._context.http.request("post", "token", {
      client_id: "legacy_client_id",
      client_secret: "legacy_client_secret",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    this.updateAuthState(data);
  }

  private updateAuthState(data: Record<string, any>): void {
    this._context.http.accessToken =
      data?.access_token ?? this._context.http.accessToken;
    this._context.http.refreshToken =
      data?.refresh_token ?? this._context.http.refreshToken;
    this._context.http.refreshBefore =
      data?.refresh_before ?? this._context.http.refreshBefore;
    this._context.http.privateUrls = {
      ...this._context.http.authState.privateUrls,
      ...data?._links,
    };
  }

  public revokeAccess(): void {
    this._context.http.clearSession();
  }
}
