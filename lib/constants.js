"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_SECRET = "yQPeLzoHuJzlMMSAjC-LgNUJdUecx8XO";
exports.DISCOVERY_URL = "https://prod-s0-webapp-proxy.nubank.com.br/api/discovery";
exports.DISCOVERY_APP_URL = "https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery";
exports.HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
    "X-Correlation-Id": "WEB-APP.pewW9"
};
exports.GRAPHQL_QUERY_ACCOUNT_BALANCE = "\n  {\n    viewer {\n        savingsAccount {\n            currentSavingsBalance {\n                netAmount\n            }\n        }\n    }\n  }\n";
exports.GRAPHQL_QUERY_ACCOUNT_FEED = "\n  {\n    viewer {\n        savingsAccount {\n            feed {\n                id\n                __typename\n                title\n                detail\n                postDate\n                ... on TransferInEvent {\n                    amount\n                    originAccount {\n                        name\n                    }\n                }\n                ... on TransferOutEvent {\n                    amount\n                    destinationAccount {\n                        name\n                    }\n                }\n                ... on DebitPurchaseEvent {\n                    amount\n                }\n                ... on BarcodePaymentEvent {\n                    amount\n                }\n            }\n        }\n    }\n  }\n";
exports.PAYMENT_EVENT_TYPES = [
    "TransferOutEvent",
    "TransferInEvent",
    "TransferOutReversalEvent",
    "BarcodePaymentEvent",
    "DebitPurchaseEvent",
    "DebitPurchaseReversalEvent"
];
