import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

import { NubankApi } from '../src';

const CERT_PATH: string = './cert.p12';

const authState = JSON.parse(readFileSync('./auth-state-cert.json').toString('utf8'));

const api = new NubankApi({
  ...authState,
  clientName: 'github:fmsouza/nubank-api',
  cert: readFileSync(CERT_PATH),
});

(async () => {
  try {
    const {items: transactions} = await api.account.getFeedPaginated();
    await writeFile('./transactions-paginated.json', JSON.stringify(transactions));
    process.exit(0);
  } catch (e) {
    const _error = e as Error;
    console.error(_error.stack);
    process.exit(1);
  }
})();