import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const CurrencySelector = (props) => {
  const { setIsWelcomeModalOpen, userCurrency, handleCurrencyChange, isLoadingForCurrency } = props;

  return (
    <>
      <section className="section is-flex is-justify-content-space-between is-align-items-center pt-3 pb-0">
        <div>
          <span className="icon-text custom-info-button" onClick={() => setIsWelcomeModalOpen(true)}>
            <span className="icon custom-navbar-icon is-medium">
              <FontAwesomeIcon className="fas fa-lg fa-solid" icon={faInfoCircle} />
            </span>
          </span>
        </div>
        <div className="field has-addons">
          <div className="control">
            <button className={`button is-static ${isLoadingForCurrency ? "is-loading" : ""}`}>Currency</button>
          </div>
          <div className="control">
            <div className="select">
              <select className="custom-currency-selector" value={userCurrency} onChange={handleCurrencyChange}>
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="CNY">CNY</option>
                <option value="EUR">EUR</option>
                <option value="NZD">NZD</option>
                <option value="RUB">RUB</option>
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
                <option value="KRW">KRW</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CurrencySelector;
