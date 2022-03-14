const SearchResult = ({ searchResult, handleSymbolChange }) => {
  function handleNavigateSearchList(e) {
    if (e.keyCode !== 38 && e.keyCode !== 40) return;
    if (e.keyCode === 40) {
      const currentSearchEl = e.target;
      const nextSearchEl = currentSearchEl.nextElementSibling;
      if (!nextSearchEl) return;
      console.log("scrolling down");
      nextSearchEl.focus();
    }
    if (e.keyCode === 38) {
      const currentSearchEl = e.target;
      const nextSearchEl = currentSearchEl.previousElementSibling;
      if (!nextSearchEl) {
        const inputField = document.querySelector("[data-search-input]");
        inputField.focus();
        // inputField.select(); // TODO: check if I need this?
        return;
      }
      nextSearchEl.focus();
    }
  }
  return (
    <>
      <button
        className="dropdown-item custom-search-suggestion-item-button"
        onClick={() => handleSymbolChange(searchResult.symbol, searchResult.id ? searchResult.id : null)}
        onKeyDown={handleNavigateSearchList}
      >{`${searchResult.symbol} | ${searchResult.name} ${searchResult.exchDisp ? searchResult.exchDisp : ""}`}</button>
    </>
  );
};
// crypto search results do not have searchResult.exchDisp info, hence the above ternary expression
export default SearchResult;
