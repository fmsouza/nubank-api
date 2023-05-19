import { readFileSync } from 'fs';

import { Customer, NubankApi } from '../src';

const authState = JSON.parse(readFileSync('./auth-state.json').toString('utf8'));

const api = new NubankApi(authState);

(async () => {
  try {
    const me: Customer = await api.account.me();
    console.log(me);
    process.exit(0);
  } catch (e) {
    const _err = e as Error;
    console.error(_err.stack);
  }
})();