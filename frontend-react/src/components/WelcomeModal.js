import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import doughnut from "../assets/img/doughnut-2.png";
import table from "../assets/img/table-expanded.png";
import financials from "../assets/img/financials.png";
import priceHistory from "../assets/img/price-history.png";

const WelcomeModal = ({ isOpen, handleClose }) => {
  return (
    <>
      <div className={`modal ${isOpen ? "is-active" : ""}`}>
        <div className="modal-background" onClick={handleClose}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Welcome!</p>
            <button className="delete" aria-label="close" onClick={handleClose}></button>
          </header>
          <section className="modal-card-body custom-modal-background">
            <p className="mb-3">
              This is a personal app I developed to track a portfolio of public company stocks and crypto assets. It was
              born out of my general philosophy that too many investors focus only on an asset's price action and
              rarely, if ever, focus on underlying financials and fundamentals.
            </p>

            <p className="mb-3">
              Your portfolio is displayed as a doughnut chart, and is viewable in different currencies.
            </p>
            <figure className="image custom-welcome-img mb-5">
              <img className="custom-img-border" src={doughnut} alt="example doughnut chart" />
            </figure>
            <p className="mb-3">
              <span>
                Individual assets are displayed in a table. Assets can be added using the button at the bottom of the
                table, and can be edited and deleted by selecting
              </span>
              <span className="icon is-small">
                <FontAwesomeIcon className="fas fa-solid" icon={faEllipsisV} />
              </span>
              <span>.</span>
            </p>

            {/* <figure className="image custom-welcome-img">
              <img src={table} />
            </figure> */}
            <figure className="image custom-welcome-img mb-5">
              <img className="custom-img-border" src={table} alt="example table of assets" />
            </figure>
            <p className="mb-3">
              Clicking on an asset in the table expands an info-view that includes charts of company financials and
              price history.
            </p>

            <p className="mb-3 has-text-danger">
              NOTE: HyperCharts was recently sold to public.com and the API has been discontinued. I am currently
              looking for a new API to query company financials.
            </p>
            <figure className="image custom-welcome-img mb-5">
              <img className="custom-img-border" src={financials} alt="example chart of company financials" />
            </figure>
            <p className="mb-3">
              You can select the time range over which to view the charts. Change between available financial charts by
              selecting the dropdown menu.
            </p>
            <figure className="image custom-welcome-img mb-5">
              <img className="custom-img-border" src={priceHistory} alt="example chart of company price-history" />
            </figure>
            <p className="mb-3">
              Data for this app is queried from{" "}
              <a href="https://hypercharts.co/" target="_blank" rel="noreferrer">
                HyperCharts
              </a>
              ,{" "}
              <a href="https://www.alphavantage.co/" target="_blank" rel="noreferrer">
                Alpha Vantage
              </a>
              ,{" "}
              <a href="https://www.yahoofinanceapi.com/" target="_blank" rel="noreferrer">
                Yahoo Finance
              </a>
              ,{" "}
              <a href="https://docs.coincap.io/" target="_blank" rel="noreferrer">
                Coin Cap
              </a>
              , and{" "}
              <a href="https://nomics.com/docs/" target="_blank" rel="noreferrer">
                Nomics
              </a>{" "}
              APIs.
            </p>
            <button className="button is-danger custom-start-portfolio-btn mt-2" onClick={handleClose}>
              Start Adding to Your Portfolio!
            </button>
          </section>
          <footer className="modal-card-foot"></footer>
        </div>
      </div>
    </>
  );
};

export default WelcomeModal;
