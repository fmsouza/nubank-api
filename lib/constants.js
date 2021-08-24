"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_EVENT_TYPES = exports.HEADERS = exports.DISCOVERY_APP_URL = exports.DISCOVERY_URL = exports.CLIENT_SECRET = void 0;
exports.CLIENT_SECRET = "yQPeLzoHuJzlMMSAjC-LgNUJdUecx8XO";
exports.DISCOVERY_URL = "https://prod-s0-webapp-proxy.nubank.com.br/api/discovery";
exports.DISCOVERY_APP_URL = "https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery";
exports.HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "nubank-api - https://github.com/fmsouza/nubank-api",
    "X-Correlation-Id": "WEB-APP.pewW9",
};
exports.PAYMENT_EVENT_TYPES = [
    "TransferOutEvent",
    "TransferInEvent",
    "TransferOutReversalEvent",
    "BarcodePaymentEvent",
    "DebitPurchaseEvent",
    "DebitPurchaseReversalEvent",
    "BillPaymentEvent",
    "DebitWithdrawalFeeEvent",
    "DebitWithdrawalEvent",
];
