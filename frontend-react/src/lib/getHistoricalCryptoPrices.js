// TODO - add try catch for error handling
import { SERVER_URL, HISTORICAL_CRYPTO_PRICE_END_POINT } from "./end-points";
import { LS_HISTORICAL_CRYPTO_PRICE_CACHE } from "./localStorage";

const MINUTES_TO_MILLISECONDS = 60000; // consider placing these constants in their own js file
const CACHE_TIMEOUT = 60 * MINUTES_TO_MILLISECONDS; // every 60 minutes. Could do longer since we are just looking daily?
const historicalPriceCacheCrypto = JSON.parse(localStorage.getItem(LS_HISTORICAL_CRYPTO_PRICE_CACHE)) || {};

export default async function getHistoricalCryptoPrices(symbol) {
  let graphData;

  if (
    !historicalPriceCacheCrypto[symbol] ||
    historicalPriceCacheCrypto[symbol].currentTime + CACHE_TIMEOUT < Date.now()
  ) {
    // call api
    console.log(`historical crypto price api called for ${symbol}`);
    const response = await fetch(`${SERVER_URL}${HISTORICAL_CRYPTO_PRICE_END_POINT}/${symbol}`);
    const data = await response.json();
    // console.log(data);
    graphData = { dates: data.dates, prices: data.prices };
  } else {
    // use cache
    console.log(`historical price cache used for for ${symbol}`);
    graphData = historicalPriceCacheCrypto[symbol].graphData;
  }

  const currentTime = Date.now();
  historicalPriceCacheCrypto[symbol] = { graphData, currentTime };
  // could filter priceCacheStocks here to only include symbols that are in assets.
  localStorage.setItem(LS_HISTORICAL_CRYPTO_PRICE_CACHE, JSON.stringify(historicalPriceCacheCrypto));

  return graphData;
}
