const CurrencySelector = (props) => {
  const { userCurrency, handleCurrencyChange, isLoadingForCurrency } = props;

  return (
    <>
      <section className="section pt-3 pr-5">
        <div className="field has-addons is-pulled-right">
          <div className="control">
            <a className={`button is-static ${isLoadingForCurrency ? "is-loading" : ""}`}>Currency</a>
          </div>
          <div className="control">
            <div className="select">
              <select value={userCurrency} onChange={handleCurrencyChange}>
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
