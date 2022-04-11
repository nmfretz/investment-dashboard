const PRODUCTION = false;

export let SERVER_URL;

if (PRODUCTION) {
  SERVER_URL = "https://financial-investment-dashboard.herokuapp.com"; // Deployment
} else {
  SERVER_URL = "http://localhost:3000"; // Development
}

export const STOCK_SEARCH_END_POINT = "/search/stocks";
export const CRYPTO_SEARCH_END_POINT = "/search/crypto";
export const CURRENT_STOCK_PRICE_END_POINT = "/price/stock/current";
export const CURRENT_CRYPTO_PRICE_END_POINT = "/price/crypto/current";
export const CURRENCY_CONVERSION_END_POINT = "/currency";
export const HISTORICAL_STOCK_PRICE_END_POINT = "/price/stock/historical";
export const HISTORICAL_CRYPTO_PRICE_END_POINT = "/price/crypto/historical";
export const COMPANY_FINANCIALS_END_POINT = "/financials";
