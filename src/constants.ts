export const CLIENT_SECRET: string = 'yQPeLzoHuJzlMMSAjC-LgNUJdUecx8XO';

export const DISCOVERY_URL: string = 'https://prod-s0-webapp-proxy.nubank.com.br/api/discovery';

export const DISCOVERY_APP_URL: string = 'https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery';

export const HEADERS: { [key: string]: string } = {
  'Content-Type': 'application/json',
  'X-Correlation-Id': 'WEB-APP.pewW9',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
};

export const GRAPHQL_QUERY_ACCOUNT_BALANCE: string = `
  {
    viewer {
        savingsAccount {
            currentSavingsBalance {
                netAmount
            }
        }
    }
  }
`;

export const GRAPHQL_QUERY_ACCOUNT_FEED: string = `
  {
    viewer {
        savingsAccount {
            feed {
                id
                __typename
                title
                detail
                postDate
                ... on TransferInEvent {
                    amount
                    originAccount {
                        name
                    }
                }
                ... on TransferOutEvent {
                    amount
                    destinationAccount {
                        name
                    }
                }
                ... on DebitPurchaseEvent {
                    amount
                }
                ... on BarcodePaymentEvent {
                    amount
                }
            }
        }
    }
  }
`;

export const PAYMENT_EVENT_TYPES = [
    'TransferOutEvent',
    'TransferInEvent',
    'TransferOutReversalEvent',
    'BarcodePaymentEvent',
    'DebitPurchaseEvent',
    'DebitPurchaseReversalEvent',
];