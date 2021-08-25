import { createInterface } from 'readline';

import { NubankApi } from '../src';

const CPF: string = '10964137798';
const PASSWORD: string = 'kC8KJp6zQMpQpg';

const api = new NubankApi({
  clientName: 'github:fmsouza/nubank-api'
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    const response = await api.auth.requestAuthenticationCode({
      cpf: CPF,
      password: PASSWORD,
      deviceId: 'macos-test-1'
    });
    console.log(response);

    rl.question(`Input the auth code:`, async (authCode: string) => {
      const certificates = await api.auth.exchangeCertificates({
        cpf: CPF,
        password: PASSWORD,
        deviceId: 'macos-test-1',
        authCode
      });
      console.log(certificates);
      // await api.auth.authenticateWithCertificate(CPF, PASSWORD);
      // console.log('You are authenticated!');
      // console.log(api.authState);
      // await writeFile('./auth-state-cert.json', JSON.stringify(api.authState));
      process.exit(0);
    });
  } catch (e) {
    console.error(e.stack);
  }
})();
