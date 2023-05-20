# Nubank API [![npm version](https://badge.fury.io/js/nubank-api.svg)](https://badge.fury.io/js/nubank-api)

A high level API to connect to Nubank service and download your purchase records.

This project was created because the API changed over time, and the JavaScript projects weren't updated to communicate to the new version. The [Python library](https://github.com/andreroggeri/pynubank/) is updated by the time of this writing, so I used that as reference to build this library.

## Installation Node.js/Browser

> npm i nubank-api uuid

## Installation React Native

> npm i nubank-api react-native-uuid

## Usage

```typescript
const { NubankApi } = require("nubank-api"); // CommonJS syntax
import { NubankApi } from "nubank-api"; // ES Modules syntax

import { v4 as uuidv4 } from "uuid"; // Browser/Node.js
import { v4 as uuidv4 } from "react-native-uuid"; // ReactNative

import { createInterface } from "readline";
import { writeFile } from "fs/promises";

const CPF: string = "your-cpf";
const PASSWORD: string = "your-password";
const AUTH_CODE: string = uuidv4();

const api = new NubankApi();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  `Generate a QRcode and read with the app: ${AUTH_CODE}`,
  async () => {
    try {
      await api.auth.authenticateWithQrCode(CPF, PASSWORD, AUTH_CODE);
      console.log("You are authenticated!");
      console.log(api.authState);
      await writeFile("./auth-state.json", JSON.stringify(api.authState)); // Saves the auth data to use later
      process.exit(0);
    } catch (e) {
      console.error(e.stack);
    }
  }
);
```

For more examples, check the [examples](./examples) folder.

## API

### new NubankApi(params?: NubankApiConstructor)

The constructor takes an object containing the authentication details, which are received after the login operation. This avoids extra requests for login to be executed because it can cause your account to be blocked from logging in for up to 72h in this IP.

| Key | Type | Description |
|-----|------|-------------|
| cert | Buffer | (Optional) the SSL certificate. Mandatory in case of authentication via p12 certificate. |
| clientName | string | (Optional) name of your client. Used to identify the origin of the requests in your account. |
| privateUrls | Routes | (Optional) private routes received after authentication. |
| publicUrls | Record<string, string> | (Optional) public routes received after authentication. |

### Class properties

All the operations available are methods nested within the object properties.

| Property | Description |
|----------|-------------|
| [auth](./src/auth.ts) | Authentication operations |
| [account](./src/account.ts) | Contains methods to access the user account details and the checking account transactions and bills |
| [card](./src/card.ts) | Contains methods to retrieve the feed of transactions from the credit card |
| [payment](./src/payment.ts) | Contains methods to create payment requests |
| [http](./src/http/client.ts) | Wrapper for the API access used by the other modules. Don't use it unless you need to make custom requests not supported by this lib |

## LICENSE

[GNU GPL v3](./LICENSE)
