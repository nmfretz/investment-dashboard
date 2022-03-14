import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import doughnut1 from "../img/doughnut-1.png";
import doughnut2 from "../img/doughnut-2.png";
import table from "../img/table.png";
import tableExpanded from "../img/table-expanded.png";
import financials from "../img/financials.png";
import priceHistory from "../img/price-history.png";

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
              <img className="custom-img-border" src={doughnut2} />
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
              <img className="custom-img-border" src={tableExpanded} />
            </figure>
            <p className="mb-3">
              Clicking on an asset in the table expands an info-view that includes charts of company financials and
              price history.
            </p>

            <figure className="image custom-welcome-img mb-5">
              <img className="custom-img-border" src={financials} />
            </figure>
            <p className="mb-3">
              You can select the time range over which to view the charts. Change between available financial charts by
              selecting the dropdown menu.
            </p>
            <figure className="image custom-welcome-img mb-5">
              <img className="custom-img-border" src={priceHistory} />
            </figure>
            <p className="mb-3">
              Data for this app is queried from{" "}
              <a href="https://hypercharts.co/" target="_blank">
                HyperCharts
              </a>
              ,{" "}
              <a href="https://www.alphavantage.co/" target="_blank">
                Alpha Vantage
              </a>
              ,{" "}
              <a href="https://www.yahoofinanceapi.com/" target="_blank">
                Yahoo Finance
              </a>
              ,{" "}
              <a href="https://docs.coincap.io/" target="_blank">
                Coin Cap
              </a>
              , and{" "}
              <a href="https://nomics.com/docs/" target="_blank">
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
