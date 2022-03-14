import {
  SERVER_URL,
  CURRENT_STOCK_PRICE_END_POINT,
  CURRENT_CRYPTO_PRICE_END_POINT,
  CURRENCY_CONVERSION_END_POINT,
} from "./end-points";

import {
  LOCAL_STORAGE_STOCK_PRICE_CACHE,
  LOCAL_STORAGE_CRYPTO_PRICE_CACHE,
  LOCAL_STORAGE_EXCHANGE_RATE_CACHE,
} from "./localStorage";

var fx = require("money"); // money-js (http://openexchangerates.github.io/money.js/)

const MINUTES_TO_MILLISECONDS = 60000;
const CACHE_TIMEOUT = 1 * MINUTES_TO_MILLISECONDS; // every 5 minutes?
const priceCacheStocks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STOCK_PRICE_CACHE)) || {};
const priceCacheCrypto = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CRYPTO_PRICE_CACHE)) || {};
const exchangeRateCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_EXCHANGE_RATE_CACHE)) || {};
let lastNomicsApiCall = Date.now(); // restricted to 1 API call per second

export default async function updatePricesValuesPercents(assets, userCurrency) {
  // for-of loop used instead of forEach to allow async calls inside a loop.
  for (const asset of assets) {
    if (asset.type === "Stock") {
      const { currency, latestPrice } = await getCurrentStockPrice(asset.symbol);
      asset.exchangeCurrency = currency;
      asset.exchangeCurrencyPrice = latestPrice;
    } else {
      asset.exchangeCurrency = "USD"; // Nomics API defaults to USD for all assets
      // need to wait 1 second between requests to nomics
      asset.exchangeCurrencyPrice = await getCurrentCryptoPrice(asset.symbol);
    }
    asset.userCurrencyPrice = await convertCurrency(asset, userCurrency);
    asset.userCurrencyValue = asset.amount * asset.userCurrencyPrice;
  }

  const sumOfAllAssetValues = assets.reduce((total, asset) => {
    return total + asset.userCurrencyValue;
  }, 0);

  assets.forEach((asset) => {
    asset.percent = (asset.userCurrencyValue / sumOfAllAssetValues) * 100;
  });

  return assets;
}

async function getCurrentStockPrice(symbol) {
  // TODO - try catch
  let currency;
  let latestPrice;

  if (!priceCacheStocks[symbol] || priceCacheStocks[symbol].currentTime + CACHE_TIMEOUT < Date.now()) {
    // console.log(`calling for new stock price data for ${symbol}`);
    const response = await fetch(`${SERVER_URL}${CURRENT_STOCK_PRICE_END_POINT}/${symbol}`);
    const json = await response.json();
    const data = json.chart.result[0];
    currency = data.meta.currency;
    latestPrice = data.meta.regularMarketPrice;
  } else {
    // console.log(`using cached stock price data for ${symbol}`);
    currency = priceCacheStocks[symbol].currency;
    latestPrice = priceCacheStocks[symbol].latestPrice;
  }

  const currentTime = Date.now();
  priceCacheStocks[symbol] = { currency, latestPrice, currentTime };
  // could filter priceCacheStocks here to only include symbols that are in assets.
  localStorage.setItem(LOCAL_STORAGE_STOCK_PRICE_CACHE, JSON.stringify(priceCacheStocks));

  return { currency, latestPrice };
}

async function getCurrentCryptoPrice(symbol) {
  let latestPrice;

  if (!priceCacheCrypto[symbol] || priceCacheCrypto[symbol].currentTime + CACHE_TIMEOUT < Date.now()) {
    // console.log(`calling for new crypto price data for ${symbol}`);
    const response = await fetch(`${SERVER_URL}${CURRENT_CRYPTO_PRICE_END_POINT}/${symbol}`);
    const json = await response.json();
    latestPrice = json[0].price;
  } else {
    // console.log(`using cached crypto price data for ${symbol}`);
    // do I need currency here?
    latestPrice = priceCacheCrypto[symbol].latestPrice;
  }

  const currentTime = Date.now();
  priceCacheCrypto[symbol] = { latestPrice, currentTime };
  localStorage.setItem(LOCAL_STORAGE_CRYPTO_PRICE_CACHE, JSON.stringify(priceCacheCrypto));

  return latestPrice;
}

export async function convertCurrency(asset, userCurrency) {
  // const userCurrency = JSON.parse(localStorage.getItem(`${CURRENCY_LOCAL_STORAGE_KEY}`));
  const exchangeRate = await getExchangeRate(asset.exchangeCurrency, userCurrency);

  fx.base = asset.exchangeCurrency;
  fx.rates = {
    [userCurrency]: exchangeRate,
    [asset.baseCurrency]: 1, // always include the base rate (1:1)
  };
  const converted = fx.convert(asset.exchangeCurrencyPrice, {
    from: `${asset.exchangeCurrency}`,
    to: `${userCurrency}`,
  });
  return converted;
}

async function getExchangeRate(fromCurrency, toCurrency) {
  // cache this
  let exchangeRate;
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    // console.log("no exchange rate needed");
    exchangeRate = 1;
  } else {
    if (
      !exchangeRateCache[`${fromCurrency}${toCurrency}`] ||
      exchangeRateCache[`${fromCurrency}${toCurrency}`].currentTime + CACHE_TIMEOUT < Date.now()
    ) {
      // call api
      // console.log(`calling api for ${fromCurrency}${toCurrency}`);
      const response = await fetch(`${SERVER_URL}${CURRENCY_CONVERSION_END_POINT}/${from}${to}`);
      const json = await response.json();
      const data = json.chart.result[0];
      exchangeRate = data.meta.regularMarketPrice;
    } else {
      //use cache
      // console.log(`using exch cache for ${fromCurrency}${toCurrency}`);
      exchangeRate = exchangeRateCache[`${fromCurrency}${toCurrency}`].exchangeRate;
    }
  }
  const currentTime = Date.now();
  exchangeRateCache[`${fromCurrency}${toCurrency}`] = { exchangeRate, currentTime };
  localStorage.setItem(LOCAL_STORAGE_EXCHANGE_RATE_CACHE, JSON.stringify(exchangeRateCache));
  return exchangeRate;
}
