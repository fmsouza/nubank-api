import { writeFile } from 'fs/promises';

import { NubankApi } from '../src';

const CPF: string = 'your-cpf';
const PASSWORD: string = 'your-password';
const CERT_PATH: string = './cert-nubank.p12';

const api = new NubankApi({
  certPath: CERT_PATH
});

(async () => {
  try {
    await api.auth.authenticateWithCertificate(CPF, PASSWORD);
    console.log('You are authenticated!');
    console.log(api.authState);
    await writeFile('./auth-state-cert.json', JSON.stringify(api.authState));
  } catch (e) {
    console.error(e.stack);
  }
})();
