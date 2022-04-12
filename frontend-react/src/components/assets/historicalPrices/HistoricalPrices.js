import { useState, useEffect, useRef } from "react";
import { format, sub } from "date-fns";

import HistoricalPriceGraph from "./HistoricalPriceGraph";
import TimeSelectorBreadCrumb from "../TimeSelectorBreadCrumb.js";

const priceTimeSelectionCrumbs = ["1W", "1M", "3M", "6M", "1Y", "2Y", "5Y", "10Y", "All"];

const HistoricalPrices = ({ asset }) => {
  const [minDate, setMinDate] = useState();
  const [selectedPriceCrumbIndex, setSelectedPriceCrumbIndex] = useState(priceTimeSelectionCrumbs.length - 1); // initialized to 'All' on mount

  const isMountedForSelectedCrumbIndex = useRef(true);

  const [isLoadingPriceGraph, setIsLoadingPriceGraph] = useState(true);

  useEffect(() => {
    if (!isMountedForSelectedCrumbIndex.current) {
      handleSetMinDate(priceTimeSelectionCrumbs[selectedPriceCrumbIndex]);
    } else {
      isMountedForSelectedCrumbIndex.current = false;
    }
  }, [selectedPriceCrumbIndex]);

  function handleSetMinDate(innerText) {
    // console.log(e.target.innerText);
    const today = Date.now();
    let selectedDate;
    switch (innerText) {
      case "1W":
        selectedDate = format(sub(today, { weeks: 1 }), "yyyy-MM-dd");
        break;
      case "1M":
        selectedDate = format(sub(today, { months: 1 }), "yyyy-MM-dd");
        break;
      case "3M":
        selectedDate = format(sub(today, { months: 3 }), "yyyy-MM-dd");
        break;
      case "6M":
        selectedDate = format(sub(today, { months: 6 }), "yyyy-MM-dd");
        break;
      case "1Y":
        selectedDate = format(sub(today, { years: 1 }), "yyyy-MM-dd");
        break;
      case "2Y":
        selectedDate = format(sub(today, { years: 2 }), "yyyy-MM-dd");
        break;
      case "5Y":
        selectedDate = format(sub(today, { years: 5 }), "yyyy-MM-dd");
        break;
      case "10Y":
        selectedDate = format(sub(today, { years: 10 }), "yyyy-MM-dd");
        break;
      case "All":
        // selectedDate = format(sub(today, { years: 1000 }), "yyyy-MM-dd");
        selectedDate = format(sub(today, { years: 1000 }), "yyyy-MM-dd");

        break;
    }
    // Instead... just call
    setMinDate(selectedDate);
  }

  return (
    <>
      <div className="box px-6 mb-0 is-flex is-flex-direction-column is-align-items-center custom-box">
        <button
          className={`button is-size-5 pb-0 custom-no-hover custom-no-active custom-chart-title ${
            isLoadingPriceGraph ? "is-loading" : ""
          }`}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span className="">Price History</span>
        </button>
        <span className="is-italic is-size-7">
          source data:{" "}
          <a href="https://www.alphavantage.co/" target="_blank" rel="noreferrer">
            Alpha Vantage
          </a>
        </span>
        <nav
          className="breadcrumb is-centered has-bullet-separator mt-2 mb-2 is-flex is-flex-wrap-wrap"
          aria-label="breadcrumbs"
        >
          <ul>
            <TimeSelectorBreadCrumb
              crumbs={priceTimeSelectionCrumbs}
              selectedCrumbIndex={selectedPriceCrumbIndex}
              setSelectedCrumbIndex={setSelectedPriceCrumbIndex}
            />
          </ul>
        </nav>

        <div className="dropdown">
          <div className="dropdown-trigger">
            <button
              className="button custom-chart-title custom-no-hover custom-no-active"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <span>Daily Price</span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu2" role="menu">
            <div className="dropdown-content"></div>
          </div>
        </div>
        <HistoricalPriceGraph asset={asset} minDate={minDate} setIsLoadingPriceGraph={setIsLoadingPriceGraph} />
        {/* change above to HistoricalPriceGraph */}
      </div>
    </>
  );
};

export default HistoricalPrices;
