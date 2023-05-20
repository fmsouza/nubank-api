import { Boleto, MoneyRequest, PixKey, PixPaymentRequest } from "./models";
import { AuthType, Context } from "./context";
import * as GqlOperations from "./utils/graphql-operations";
import { RequiresAuth } from "./utils/decorators";

export class Payment {
  public get context(): Context {
    return this._context;
  }

  public constructor(private _context: Context) {}

  @RequiresAuth(AuthType.CERT)
  public async createBoleto(amount: number): Promise<Boleto> {
    const customerId: string = await this._context.account.getCustomerId();

    const input = {
      amount: String(amount),
      customerId,
    };

    const { data: boletoData } = await this._context.http.graphql(
      GqlOperations.MUTATION_CREATE_BOLETO,
      { input }
    );
    return boletoData?.createTransferInBoleto?.boleto;
  }

  @RequiresAuth(AuthType.CERT)
  public async createMoneyRequest(amount: number): Promise<MoneyRequest> {
    const savingsAccountId: string = await this._context.account.getId();

    const input = {
      amount,
      savingsAccountId,
    };

    const { data: moneyRequestData } = await this._context.http.graphql(
      GqlOperations.MUTATION_CREATE_MONEY_REQUEST,
      { input }
    );
    return moneyRequestData?.createMoneyRequest;
  }

  @RequiresAuth(AuthType.CERT)
  public async createPixPaymentRequest(
    pixKey: PixKey,
    amount: number
  ): Promise<PixPaymentRequest> {
    const savingsAccountId: string = await this._context.account.getId();

    const createPaymentRequestInput = {
      amount,
      pixAlias: pixKey.value,
      savingsAccountId,
    };

    const { data: moneyRequestData } = await this._context.http.graphql(
      GqlOperations.MUTATION_CREATE_MONEY_REQUEST,
      { createPaymentRequestInput }
    );
    return moneyRequestData?.createMoneyRequest;
  }
}
