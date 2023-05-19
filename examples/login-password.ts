import { v4 as uuidv4 } from "uuid";
import { createInterface } from 'readline';
import { writeFile } from 'fs/promises';

import { NubankApi } from '../src';

const CPF: string = 'your-cpf';
const PASSWORD: string = 'your-password';
const AUTH_CODE: string = uuidv4();

const api = new NubankApi();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Generate a QRcode and read with the app: ${AUTH_CODE}`, async () => {
  try {
    await api.auth.authenticateWithQrCode(CPF, PASSWORD, AUTH_CODE);
    console.log('You are authenticated!');
    console.log(api.authState);
    await writeFile('./auth-state.json', JSON.stringify(api.authState));
    process.exit(0);
  } catch (e) {
    const _err = e as Error;
    console.error(_err.stack);
  }
});
