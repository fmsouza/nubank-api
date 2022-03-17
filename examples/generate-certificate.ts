import { createInterface } from 'readline';
import { readFile, writeFile } from 'fs/promises';

import { NubankApi } from '../src';

const DEVICE_ID: string = 'test-client';

const api = new NubankApi({
  clientName: 'github:fmsouza/nubank-api'
});

function input(text: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(text, (response: string) => {
      resolve(response);
    });
  });
}

function saveCertificate(filepath: string, cert: Buffer): Promise<void> {
  return writeFile(filepath, cert, { encoding: 'binary' });
}

(async () => {
  try {
    const cpf = await input('Input your CPF: ');
    const password = await input('Input your password: ');

    const response = await api.auth.requestAuthenticationCode({
      cpf,
      password,
      deviceId: DEVICE_ID
    });
    console.log('Sent to:', response);

    const authCode: string = await input(`Input the auth code: `);

    const certificates = await api.auth.exchangeCertificates({
      cpf,
      password,
      deviceId: DEVICE_ID,
      authCode
    });
    await saveCertificate('./cert.p12', certificates.cert);
    await saveCertificate('./cert-crypto.p12', certificates.certCrypto);

    const authCert = await readFile('./cert.p12');

    await api.auth.authenticateWithCertificate(cpf, password, authCert);

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
