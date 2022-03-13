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

  function handleSymbolSearch(e) {
    setSymbolSearch(e.target.value);
  }

  useEffect(async () => {
    console.log("symbol search useEffect run");
    if (symbolSearch.length === 0) return setSearchResults([]);

    let tempSearchResults;
    if (type === "Stock") {
      tempSearchResults = await searchAvailableStocks(symbolSearch);
    } else {
      tempSearchResults = await searchAvailableCrypto(symbolSearch);
    }
    setSearchResults(tempSearchResults);
  }, [symbolSearch]);

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
      return console.log("form is not valid"); // do I still need to do anything here?
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
                    onClick={() => setIsSymbolSelectorOpen(!isSymbolSelectorOpen)}
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
                          type="text"
                          placeholder="search tickers..."
                          className="input is-transparent"
                          value={symbolSearch}
                          onChange={handleSymbolSearch}
                        />
                        <span className="icon is-left">
                          <FontAwesomeIcon className="fa" icon={faSearch} />
                        </span>
                      </div>
                    </div>
                    <div className="custom-search-results">
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
                        <a className="dropdown-item">{`No results found for "${symbolSearch}""`}</a>
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
