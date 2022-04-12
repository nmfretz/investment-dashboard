import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import TimeSelectorBreadCrumb from "../TimeSelectorBreadCrumb.js";
import CompanyFinancialsGraph from "./CompanyFinancialsGraph.js";
import FinancialsDropdownItems from "./FinancialsDropdownItems.js";

const financialsTimeSelectionCrumbs = ["1Y", "2Y", "5Y", "10Y", "All"];
const crumbInteger = [1, 2, 3, 5, 10, undefined];

const CompanyFinancials = ({ asset }) => {
  const [selectedFinancialsCrumbIndex, setSelectedFinancialsCrumbIndex] = useState(
    financialsTimeSelectionCrumbs.length - 4
  ); // initialized to '2Y' on mount
  const [years, setYears] = useState(2);

  const [chartDropdownItems, setChartDropdownItems] = useState([]);
  const [selectedChart, setSelectedChart] = useState("Revenue & Operating Income"); // default on mount
  const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);

  const isMountedForSelectedFinancialsCrumbIndex = useRef(true);

  const [isLoadingFinancialsGraph, setIsLoadingFinancialsGraph] = useState(true);
  const [chartTitle, setChartTitle] = useState("Company Financials");

  useEffect(() => {
    if (!isMountedForSelectedFinancialsCrumbIndex.current) {
      setYears(crumbInteger[selectedFinancialsCrumbIndex]);
    } else {
      isMountedForSelectedFinancialsCrumbIndex.current = false;
    }
  }, [selectedFinancialsCrumbIndex]);

  function handleChartChange(selectedDropdownItem) {
    // console.log(selectedDropdownItem);
    setSelectedChart(selectedDropdownItem);
    setIsChartSelectorOpen(false);
  }

  return (
    <>
      <div className="box px-6 is-flex is-flex-direction-column is-align-items-center custom-box">
        <button
          className={`button is-size-5 pb-0 custom-no-hover custom-no-active custom-chart-title ${
            isLoadingFinancialsGraph ? "is-loading" : ""
          }`}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span className="">{chartTitle}</span>
        </button>
        <span className="is-italic is-size-7">
          source data:{" "}
          <a href="https://hypercharts.co/" target="_blank" rel="noreferrer">
            HyperCharts
          </a>
        </span>
        <nav className="breadcrumb is-centered has-bullet-separator mt-2 mb-2" aria-label="breadcrumbs">
          <ul>
            <TimeSelectorBreadCrumb
              crumbs={financialsTimeSelectionCrumbs}
              selectedCrumbIndex={selectedFinancialsCrumbIndex}
              setSelectedCrumbIndex={setSelectedFinancialsCrumbIndex}
            />
          </ul>
        </nav>
        <div className={`dropdown ${isChartSelectorOpen ? "is-active" : ""}`}>
          <div className="dropdown-trigger">
            <button
              className="button custom-chart-title"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={() => setIsChartSelectorOpen(!isChartSelectorOpen)}
            >
              <span>{selectedChart}</span>
              <span className="icon is-small">
                <FontAwesomeIcon className="fa" icon={faAngleDown} />
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu1" role="menu">
            <div className="dropdown-content">
              <FinancialsDropdownItems chartDropdownItems={chartDropdownItems} handleChartChange={handleChartChange} />
            </div>
          </div>
        </div>
        <CompanyFinancialsGraph
          asset={asset}
          selectedChart={selectedChart}
          years={years}
          setChartDropdownItems={setChartDropdownItems}
          setIsLoadingFinancialsGraph={setIsLoadingFinancialsGraph}
          setChartTitle={setChartTitle}
        />
      </div>
    </>
  );
};

export default CompanyFinancials;
