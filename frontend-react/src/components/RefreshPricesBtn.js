import { useState } from "react";

const RefreshPricesBtn = ({ handleRefreshPrices }) => {
  const [isLoading, setIsLoading] = useState(false);

  function loading() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
  return (
    <>
      <div className="container pt-0 custom-refresh-prices-margin-mobile">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <button
            className={`button custom-refresh-prices ${isLoading ? "is-loading" : ""}`}
            onClick={() => {
              handleRefreshPrices();
              loading();
            }}
          >
            Refresh Prices
          </button>
        </div>
      </div>
    </>
  );
};

export default RefreshPricesBtn;
