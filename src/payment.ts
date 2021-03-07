import { Boleto, MoneyRequest } from './models';
import { Context } from './types';
import * as GqlOperations from './utils/graphql-operations';

export class Payment {

  public constructor(private _context: Context) { }

  public async createBoleto(amount: number): Promise<Boleto> {
    const { data: accountIdData } = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const customerId: string = accountIdData?.viewer?.id;

    const input = {
      amount: String(amount),
      customerId
    };

    const { data: boletoData } = await this._context.http.graphql(GqlOperations.MUTATION_CREATE_BOLETO, { input });
    return boletoData?.createTransferInBoleto?.boleto;
  }

  public async createMoneyRequest(amount: number): Promise<MoneyRequest> {
    const { data: accountIdData } = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const savingsAccountId: string = accountIdData?.viewer?.savingsAccount?.id;

    const input = {
      amount: String(amount),
      savingsAccountId
    };

    const { data: moneyRequestData } = await this._context.http.graphql(GqlOperations.MUTATION_CREATE_MONEY_REQUEST, { input });
    return moneyRequestData?.createMoneyRequest;
  }

  public async createPixRequest(amount: number): Promise<MoneyRequest> {
    const { data: accountIdData } = await this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_ID);
    const savingsAccountId: string = accountIdData?.viewer?.savingsAccount?.id;

    const input = {
      amount: String(amount),
      savingsAccountId
    };

    const { data: moneyRequestData } = await this._context.http.graphql(GqlOperations.MUTATION_CREATE_MONEY_REQUEST, { input });
    return moneyRequestData?.createMoneyRequest;
  }
}