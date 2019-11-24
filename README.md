# Nubank API

A high level API to connect to Nubank service and download your purchase records.

This project was created because the API changed over time, and the JavaScript projects weren't updated to communicate to the new version. The [Python library](https://github.com/andreroggeri/pynubank/) is updated by the time of this writing, so I used that as reference to build this library.

## Installation

> npm i nubank-api

## Usage

```javascript
const NubankApi = require('nubank-api'); // CommonJS syntax
import NubankApi from 'nubank-api'; // ES Modules syntax

const CPF = '<your-cpf-number>';
const PASSWORD = 'your-awesome-password';

(async function main() {
  const api = new NubankApi();

  // or add the accessToken and the privateUrls in case you already have them
  const cache = readCache();
  const api = new NubankApi(cache.accessToken, cache.privateUrls);

  const { accessToken, urls } = await api.login(CPF, PASSWORD, async authCode => {
    // Yeah, it needs to return a Promise, so better using async function
    await renderQrCode(authCode);
    await waitForUserInput('Press any key to continue after reading the QR code');
  });
  saveToCache({ accessToken, urls }); // Better cache that, because making too many login requests results in a 429 error

  // Now you are ready to access your account :)
})();
```

## API

### new NubankApi(accessToken: string, routes: Routes)

The constructor takes an access token and an object containing some routes, which are received after the login operation. This avoids extra requests for login to be executed because it can cause your account to be blocked from logging in for up to 72h in this IP.

### login(cpf: string, password: string, secondStepFn: UUIDProcessingCallback): Promise<AuthState>

Executes the login procedure and generates an authentication code, which needs to be used to generate a QR code and be read by the user's phone, so the access token attached to the requests can be activated. This callback must return a `Promise`, so using an `async function` is a good call there. Use it to render the auth code as a QR code, and resolve only after the user read the QR code with the phone.

### getCardFeed(): Promise<Transaction[]>

Retrieves the list of credit card operations.

### getCardTransactions(): Promise<Transaction[]>

Retrieves the entire history of credit card transactions since the first use of the cards.

### getBills(): Promise<Bill[]>

Retrieves a list with all the bills created with the user's transactions since the first use, until the future charges.

### getAccountBalance(): Promise<number>

Retrieves the NuConta balance.

### getAccountFeed(): Promise<AccountTransaction[]>

Retrieves the list of debit card and account operations.

### getAccountTransactions(): Promise<AccountTransaction[]>

Retrieves the entire history of debit card and transfer transactions since the first use of the NuConta.
