// TODO - remove exports that I no longer export
const LOCAL_STORAGE_PREFIX = "INVESTMENT_DASHBOARD";
export const LOCAL_STORAGE_ASSETS = `${LOCAL_STORAGE_PREFIX}.assets`;
export const LOCAL_STORAGE_CURRENCY = `${LOCAL_STORAGE_PREFIX}.currency`;
export const LOCAL_STORAGE_STOCK_PRICE_CACHE = `${LOCAL_STORAGE_PREFIX}.stock-price-cache`;
export const LOCAL_STORAGE_CRYPTO_PRICE_CACHE = `${LOCAL_STORAGE_PREFIX}.crypto-price-cache`;
export const LOCAL_STORAGE_EXCHANGE_RATE_CACHE = `${LOCAL_STORAGE_PREFIX}.exchange-rate-cache`;
export const LS_HISTORICAL_STOCK_PRICE_CACHE = `${LOCAL_STORAGE_PREFIX}.historical-stock-price-cache`;
export const LS_HISTORICAL_CRYPTO_PRICE_CACHE = `${LOCAL_STORAGE_PREFIX}.historical-crypto-price-cache`;
export const LS_COMPANY_FINANCIALS_CACHE = `${LOCAL_STORAGE_PREFIX}.company-financials-cache`;

export function loadUserCurrencyFromLocalStorage() {
  const currency = localStorage.getItem(LOCAL_STORAGE_CURRENCY);
  return currency ? JSON.parse(currency) : null;
}

export function saveUserCurrencyToLocalStorage(userCurrency) {
  localStorage.setItem(LOCAL_STORAGE_CURRENCY, JSON.stringify(userCurrency));
}

export function loadAssetsFromLocalStorage() {
  const assets = localStorage.getItem(LOCAL_STORAGE_ASSETS);
  return assets ? JSON.parse(assets) : null;
}

export function saveAssetsToLocalStorage(assets) {
  localStorage.setItem(LOCAL_STORAGE_ASSETS, JSON.stringify(assets));
}
