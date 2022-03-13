import { SERVER_URL, COMPANY_FINANCIALS_END_POINT } from "./end-points";
import { LS_COMPANY_FINANCIALS_CACHE } from "./localStorage";

const MINUTES_TO_MILLISECONDS = 60000; // consider placing these constants in their own js file
const CACHE_TIMEOUT = 60 * MINUTES_TO_MILLISECONDS; // every 60 minutes. Could do longer since we are just looking daily?
const companyFinancialsCache = JSON.parse(localStorage.getItem(LS_COMPANY_FINANCIALS_CACHE)) || {};

export default async function getCompanyFinancials(symbol) {
  let graphData;

  if (!companyFinancialsCache[symbol] || companyFinancialsCache[symbol].currentTime + CACHE_TIMEOUT < Date.now()) {
    //call api
    try {
      console.log("hypercharts api called");
      const response = await fetch(`${SERVER_URL}${COMPANY_FINANCIALS_END_POINT}/${symbol}`);
      graphData = await response.json();
    } catch (error) {
      console.error(error);
    }
  } else {
    // use cache
    console.log("cache used for company financials");
    graphData = companyFinancialsCache[symbol].graphData;
  }

  console.log(graphData);
  const currentTime = Date.now();
  companyFinancialsCache[symbol] = { graphData, currentTime };
  // could filter cache here to only include symbols that are in assets.
  localStorage.setItem(LS_COMPANY_FINANCIALS_CACHE, JSON.stringify(companyFinancialsCache));

  return graphData;
}
