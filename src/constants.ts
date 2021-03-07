export const CLIENT_SECRET: string = "yQPeLzoHuJzlMMSAjC-LgNUJdUecx8XO";

export const DISCOVERY_URL: string =
  "https://prod-s0-webapp-proxy.nubank.com.br/api/discovery";

export const DISCOVERY_APP_URL: string =
  "https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery";

export const HEADERS: { [key: string]: string } = {
  "Content-Type": "application/json",
  "User-Agent": "nubank-api - https://github.com/fmsouza/nubank-api",
  "X-Correlation-Id": "WEB-APP.pewW9",
};

export const PAYMENT_EVENT_TYPES = [
  "TransferOutEvent",
  "TransferInEvent",
  "TransferOutReversalEvent",
  "BarcodePaymentEvent",
  "DebitPurchaseEvent",
  "DebitPurchaseReversalEvent",
];
