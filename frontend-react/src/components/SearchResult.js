const SearchResult = ({ searchResult, handleSymbolChange }) => {
  return (
    <>
      <a
        className="dropdown-item"
        onClick={() => handleSymbolChange(searchResult.symbol, searchResult.id ? searchResult.id : null)}
      >{`${searchResult.symbol} | ${searchResult.name} ${searchResult.exchDisp ? searchResult.exchDisp : ""}`}</a>
    </>
  );
};
// crypto search results do not have searchResult.exchDisp info, hence the above ternary expression
export default SearchResult;
