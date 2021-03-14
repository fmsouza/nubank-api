# Nubank API

A high level API to connect to Nubank service and download your purchase records.

This project was created because the API changed over time, and the JavaScript projects weren't updated to communicate to the new version. The [Python library](https://github.com/andreroggeri/pynubank/) is updated by the time of this writing, so I used that as reference to build this library.

## Installation Node.js/Browser

> npm i nubank-api uuid

## Installation React Native

> npm i nubank-api react-native-uuid

## Usage

```javascript
const NubankApi = require("nubank-api"); // CommonJS syntax
import NubankApi from "nubank-api"; // ES Modules syntax

const CPF = "<your-cpf-number>";
const PASSWORD = "your-password";

(async function main() {
  const api = new NubankApi();

  const authCode = await api.login(CPF, PASSWORD);
  await renderQrCode(authCode);
  await waitForUserInput("Press any key to continue after reading the QR code");
  const { accessToken, privateUrls, publicUrls } = await api.validateLogin(authCode);

  saveToCache({ accessToken, privateUrls, publicUrls }); // Better cache that, because making too many login requests results in a 429 error
  
  // ------------------ OR ------------------------

  // or add the accessToken and the privateUrls in case you already have them
  const { accessToken, privateUrls, publicUrls } = readCache();
  const api = new NubankApi({ accessToken, privateUrls, publicUrls });

  // Now you are ready to access your account :)
})();
```

Or if you are using React Native, you need to configure the UUID generator function as well

```javascript
  import uuid from 'react-native-uuid';

  // ...

  const api = new NubankApi();

  // or add the accessToken and the privateUrls in case you already have them
  const { accessToken, privateUrls } = readCache();
  const options = {
    uuidAdapter: uuid.v4
  };
  const api = new NubankApi({ accessToken, privateUrls, options });
})();
```

## API

### new NubankApi(accessToken: string, routes: Routes)

The constructor takes an access token and an object containing some routes, which are received after the login operation. This avoids extra requests for login to be executed because it can cause your account to be blocked from logging in for up to 72h in this IP.

### login(cpf: string, password: string): Promise<string>

Executes the login procedure and generates an authentication code, which needs to be used to generate a QR code and be read by the user's phone, so the access token attached to the requests can be activated.

### validateLogin(authCode: string): Promise<AuthState>

You'll only need to call this method if you omit `validateCallback` on the `login` method. This method takes the authentication code used in the QR code scan to complete the login procedure asynchronously.

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
