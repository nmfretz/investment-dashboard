import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";

import { AssetContext } from "../../App";
import { searchAvailableStocks, searchAvailableCrypto } from "../../lib/symbol-search";
import SearchResult from "./SearchResult";

const AddAssetModal = (props) => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen, handleAddAsset, setIsEdit, setAssetToEditId } = props;
  const { type, setType, symbol, setSymbol, amount, setAmount } = useContext(AssetContext);

  const [symbolSearch, setSymbolSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSymbolSelectorOpen, setIsSymbolSelectorOpen] = useState(false);

  // form validation state
  const [amountError, setAmountError] = useState("");
  const [symbolError, setSymbolError] = useState("");

  const [isLoadingForAddButton, setIsLoadingForAddButton] = useState(false);

  function handleTypeChange(e) {
    setType(e.target.value);

    // resets symbol and searchResults to avoid complex form validation in cases where the user selects a symbol and then changes the type
    setSymbol("Search for a Symbol");
    setSymbolSearch("");
    setSearchResults([]);
  }

  function handleOpenSymbolSearch() {
    setIsSymbolSelectorOpen(!isSymbolSelectorOpen);
  }

  useEffect(() => {
    if (!isSymbolSelectorOpen) return;

    const searchInputEl = document.querySelector("[data-search-input]");
    // console.log(searchInputEl);
    searchInputEl.focus();
  }, [isSymbolSelectorOpen]);

  function handleSearchListFocus(e) {
    if (e.target.value === "") return;
    if (e.keyCode !== 40) return;
    const searchListEl = document.querySelector("[data-search-list]").firstElementChild;
    searchListEl.focus();
  }

  async function handleSymbolSearch(e) {
    const symbol = e.target.value;
    setSymbolSearch(symbol);

    if (symbol.length === 0) return setSearchResults([]);
    let tempSearchResults;
    if (type === "Stock") {
      tempSearchResults = await searchAvailableStocks(symbol);
    } else {
      tempSearchResults = await searchAvailableCrypto(symbol);
    }
    setSearchResults(tempSearchResults);
  }

  function handleSymbolChange(symbol) {
    setSymbol(symbol);
  }

  useEffect(() => {
    setIsSymbolSelectorOpen(false);
  }, [symbol]);

  function handleAmountChange(e) {
    setAmount(e.target.value);
  }

  function handleFormCancel() {
    setIsAddAssetModalOpen(!isAddAssetModalOpen);
    clearForm();
    setIsEdit(false);
    setAssetToEditId(false);
  }

  async function handleFormSubmit() {
    const isValid = validateForm();
    if (isValid) {
      setIsLoadingForAddButton(true);
      await handleAddAsset(symbol, type, amount);
      setIsLoadingForAddButton(false);
      setIsEdit(false);
      setAssetToEditId(false);
      clearForm();
    } else {
      // return console.log("form is not valid");
    }
  }

  function validateForm() {
    clearErrors();
    let isFormValid = true;

    // validation of type matching symbol is handled by handleTypeChange()

    if (amount.trim() === "" || isFinite(amount.trim()) === false) {
      setAmountError("Enter a valid number");
      isFormValid = false;
    }

    if (symbol === "Search for a Symbol") {
      setSymbolError("Enter a valid asset symbol");
      isFormValid = false;
    }

    return isFormValid;
  }

  function clearErrors() {
    setAmountError("");
    setSymbolError("");
  }

  function clearForm() {
    setType("Stock");
    setSymbol("Search for a Symbol");
    setSymbolSearch("");
    setSearchResults([]);
    setAmount("");
    clearErrors();
  }

  return (
    <>
      <div className={`modal ${isAddAssetModalOpen ? "is-active" : ""} custom-modal`}>
        <div className="modal-background"></div>
        <div className="modal-card custom-modal-card-height">
          <header className="modal-card-head">
            <p className="modal-card-title is-pulled-right">Add Asset</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Asset Type</label>
              <div className="control">
                <div className="select">
                  <select value={type} onChange={handleTypeChange}>
                    <option value="Stock">Stock</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Asset Symbol</label>
              <div className={`dropdown ${isSymbolSelectorOpen ? "is-active" : ""}`}>
                <div className="dropdown-trigger">
                  <button
                    className="button"
                    onClick={() => handleOpenSymbolSearch()}
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                  >
                    <span>{symbol}</span>
                    <span className="icon is-small">
                      <FontAwesomeIcon className="fa" icon={faAngleDown} />
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu custom-search-container" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <div className="field dropdown-item">
                      <div className="control has-icons-left">
                        <input
                          className="input is-transparent"
                          type="text"
                          placeholder="search tickers..."
                          value={symbolSearch}
                          onChange={async (e) => await handleSymbolSearch(e)}
                          onKeyDown={handleSearchListFocus}
                          data-search-input
                        />
                        <span className="icon is-left">
                          <FontAwesomeIcon className="fa" icon={faSearch} />
                        </span>
                      </div>
                    </div>
                    <div className="custom-search-results" data-search-list>
                      {searchResults.length > 0 ? (
                        searchResults.map((searchResult) => {
                          return (
                            <SearchResult
                              key={uuidv4()}
                              searchResult={searchResult}
                              handleSymbolChange={handleSymbolChange}
                            />
                          );
                        })
                      ) : symbolSearch === "" ? (
                        ""
                      ) : (
                        <button className="dropdown-item custom-search-suggestion-item-button">{`No results found for "${symbolSearch}""`}</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="help is-danger">{symbolError}</p>
            </div>

            <div className="field">
              <label className="label">Number of Shares</label>
              <div className="control">
                <input className="input" type="text" placeholder="" value={amount} onChange={handleAmountChange} />
              </div>
              <p className="help is-danger">{amountError}</p>
            </div>
          </section>
          <footer className="modal-card-foot">
            <div>
              <button
                className={`button is-success ${isLoadingForAddButton ? "is-loading" : ""}`}
                onClick={async () => handleFormSubmit()}
              >
                Add to Portfolio
              </button>
              <button className="button" onClick={() => handleFormCancel()}>
                Cancel
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AddAssetModal;
