import { readFileSync } from 'fs';

import { AccountTransaction, NubankApi } from '../src';

const CERT_PATH: string = './cert.p12';

const authState = JSON.parse(readFileSync('./auth-state-cert.json').toString('utf8'));

const api = new NubankApi({
  ...authState,
  clientName: 'github:fmsouza/nubank-api',
  certPath: CERT_PATH,
});

(async () => {
  try {
    const transactions: AccountTransaction[] = await api.account.getFeed();
    console.log(transactions);
    process.exit(0);
  } catch (e) {
    const _error = e as Error;
    console.error(_error.stack);
    process.exit(1);
  }
})();