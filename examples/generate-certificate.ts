import { createInterface } from 'readline';
import { readFile, writeFile } from 'fs/promises';

import { NubankApi } from '../src';
import { Pkcs12Asn1, pkcs12ToBuffer } from '../src/utils/cert';

const CPF: string = 'your-cpf';
const PASSWORD: string = 'your-password';
const DEVICE_ID: string = 'test-client';

const api = new NubankApi({
  clientName: 'github:fmsouza/nubank-api'
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function saveCertificate(filepath: string, cert: Pkcs12Asn1): Promise<void> {
  const contents: Buffer = pkcs12ToBuffer(cert);
  return writeFile(filepath, contents, { encoding: 'binary' });
}

(async () => {
  try {
    const response = await api.auth.requestAuthenticationCode({
      cpf: CPF,
      password: PASSWORD,
      deviceId: DEVICE_ID
    });
    console.log('Sent to:', response);

    rl.question(`Input the auth code: `, async (authCode: string) => {
      const certificates = await api.auth.exchangeCertificates({
        cpf: CPF,
        password: PASSWORD,
        deviceId: DEVICE_ID,
        authCode
      });
      await saveCertificate('./cert.p12', certificates.cert);
      await saveCertificate('./cert-crypto.p12', certificates.certCrypto);

      const authCert = await readFile('./cert.p12');

      await api.auth.authenticateWithCertificate(CPF, PASSWORD, authCert);

      await writeFile('./auth-state-cert.json', JSON.stringify(api.authState));
      console.log('You are authenticated!');
      console.log(api.authState);
      process.exit(0);
    });
  } catch (e) {
    const _error = e as Error;
    console.error(_error.stack);
    process.exit(1);
  }
})();
