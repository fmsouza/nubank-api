import { readFileSync } from 'fs';

import { NubankApi, PixKey } from '../src';

const authState = JSON.parse(readFileSync('./auth-state.json').toString('utf8'));

const api = new NubankApi(authState);

(async () => {
  try {
    const pixKeys: PixKey[] = await api.account.getPixKeys();
    console.log(pixKeys);
    const paymentRequest = await api.payment.createPixPaymentRequest(pixKeys[0], 100, "Wow, such payment");
    console.log(paymentRequest);
    process.exit(0);
  } catch (e) {
    console.error(e.stack);
  }
})();