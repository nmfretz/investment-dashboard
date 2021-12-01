// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMoneyBillWaveAlt } from "@fortawesome/free-solid-svg-icons";

const RefreshPricesBtn = ({ handleRefreshPrices }) => {
  return (
    <>
      <div className="container pt-0 custom-refresh-prices-margin-mobile">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <button className="button" onClick={() => handleRefreshPrices()}>
            Refresh Prices
            {/* <span className="icon is-small">
          <FontAwesomeIcon className="fa" icon={faMoneyBillWaveAlt} />
        </span> */}
          </button>
        </div>
      </div>
    </>
  );
};

export default RefreshPricesBtn;
