const RefreshPricesBtn = ({ handleRefreshPrices }) => {
  return (
    <>
      <div className="container pt-0 custom-refresh-prices-margin-mobile">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <button className="button" onClick={() => handleRefreshPrices()}>
            Refresh Prices
          </button>
        </div>
      </div>
    </>
  );
};

export default RefreshPricesBtn;
