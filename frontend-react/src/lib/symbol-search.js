import { SERVER_URL, STOCK_SEARCH_END_POINT, CRYPTO_SEARCH_END_POINT } from "../data/end-points";

export async function searchAvailableStocks(searchInput) {
  const response = await fetch(`${SERVER_URL}${STOCK_SEARCH_END_POINT}/${searchInput}`);
  const json = await response.json();
  const searchResults = json.ResultSet.Result;
  return searchResults;
}

export async function searchAvailableCrypto(searchInput) {
  const response = await fetch(`${SERVER_URL}${CRYPTO_SEARCH_END_POINT}/${searchInput}`);
  const json = await response.json();
  const searchResults = json.data;
  return searchResults;
}
