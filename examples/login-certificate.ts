import { readFile, writeFile } from 'fs/promises';

import { NubankApi } from '../src';

const CPF: string = 'your-cpf';
const PASSWORD: string = 'your-password';
const CERT_PATH: string = './cert.p12';

(async () => {
  const api = new NubankApi({
    clientName: 'github:fmsouza/nubank-api',
    cert: await readFile(CERT_PATH)
  });
  try {
    await api.auth.authenticateWithCertificate(CPF, PASSWORD);
    await writeFile('./auth-state-cert.json', JSON.stringify(api.authState));
    console.log('You are authenticated!');
    console.log(api.authState);
    process.exit(0);
  } catch (e) {
    const _error = e as Error;
    console.error(_error.stack);
    process.exit(1);
  }
})();
