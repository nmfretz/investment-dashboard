//do this without cache at first
import { SERVER_URL, HISTORICAL_STOCK_PRICE_END_POINT } from "./end-points";
import { format, sub, parseISO } from "date-fns";
import { LS_HISTORICAL_STOCK_PRICE_CACHE } from "./localStorage";

const MINUTES_TO_MILLISECONDS = 60000; // consider placing these constants in their own js file
const CACHE_TIMEOUT = 60 * MINUTES_TO_MILLISECONDS; // every 60 minutes. Could do longer since we are just looking daily?
const historicalPriceCacheStocks = JSON.parse(localStorage.getItem(LS_HISTORICAL_STOCK_PRICE_CACHE)) || {};

export async function getHistoricalStockPrices(symbol) {
  let graphData;

  if (
    !historicalPriceCacheStocks[symbol] ||
    historicalPriceCacheStocks[symbol].currentTime + CACHE_TIMEOUT < Date.now()
  ) {
    // call api
    // console.log(`historical price api called for ${symbol}`);
    const response = await fetch(`${SERVER_URL}${HISTORICAL_STOCK_PRICE_END_POINT}/${symbol}`);
    const data = await response.json();
    // console.log(data);
    graphData = { dates: data.dates, prices: data.prices };
  } else {
    // use cache
    // console.log(`historical price cache used for for ${symbol}`);
    graphData = historicalPriceCacheStocks[symbol].graphData;
  }

  const currentTime = Date.now();
  historicalPriceCacheStocks[symbol] = { graphData, currentTime };
  // could filter priceCacheStocks here to only include symbols that are in assets.
  localStorage.setItem(LS_HISTORICAL_STOCK_PRICE_CACHE, JSON.stringify(historicalPriceCacheStocks));

  return graphData;
}

export function findNearestStartDate(startDate, dates) {
  // console.log(startDate);
  let minDate;
  if (parseISO(startDate) < parseISO(dates[0])) {
    // console.log("startDate too early, using first datapoint");
    minDate = dates[0];
  } else if (!dates.includes(startDate)) {
    // while loop to find most recent market day in dates
    let i = 1;
    minDate = startDate;
    while (!dates.includes(minDate)) {
      // console.log("startDate is not a market Day, plotting 1 market day earlier");
      minDate = format(sub(parseISO(startDate), { days: i }), "yyyy-MM-dd");
      i++;
    }
    minDate = minDate;
    // console.log(`found market day ${i - 1} days earlier on ${minDate}`);
  } else {
    minDate = startDate;
    // console.log("startDay okay as-is");
  }
  return minDate;
}
