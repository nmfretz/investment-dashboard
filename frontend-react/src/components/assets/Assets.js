import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import AssetInfo from "./AssetInfo";
import RefreshLoadSpinner from "../RefreshLoadSpinner";
import DeleteAssetModal from "./DeleteAssetModal";
import numberFormatter from "../../lib/numberFormatter";

const Assets = (props) => {
  const { assets, userCurrency, deleteAsset, handleEditAsset, isGraphAndTableLoading } = props;

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteID] = useState("");

  function handleInfoClick(asset) {
    if (isInfoOpen && selectedAsset === asset.id) return setIsInfoOpen(false);
    setIsInfoOpen(false);
    setSelectedAsset(asset.id);
    setIsInfoOpen(true);
  }

  function handleDeleteClick(asset) {
    setIsDeleteOpen(true);
    setDeleteID(asset.id);
  }

  function handleDeleteCancel() {
    setIsDeleteOpen(false);
    setDeleteID("");
  }

  function handleDeleteConfirm() {
    setIsDeleteOpen(false);
    setDeleteID("");
    deleteAsset(deleteId);
  }

  return (
    <>
      {assets.map((asset, index) => (
        <div key={asset.id}>
          <div
            onClick={() => handleInfoClick(asset)}
            className="columns is-mobile is-centered is-vcentered is-gapless custom-info-selector"
          >
            <div className="column has-text-centered-mobile has-text-weight-bold has-text-black">{asset.symbol}</div>
            <div className="column has-text-centered-mobile is-hidden-mobile">{asset.type}</div>
            <div className="column has-text-centered-mobile is-hidden-mobile">
              {
                <RefreshLoadSpinner
                  className={`button custom-not-a-button custom-table-loadspinner ${
                    isGraphAndTableLoading ? "is-loading" : ""
                  }`}
                  text={`${Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: userCurrency,
                    currencyDisplay: "narrowSymbol",
                  }).format(asset.userCurrencyPrice)} ${userCurrency}`}
                />
              }
            </div>
            <div className="column has-text-centered-mobile">{numberFormatter(asset.amount)}</div>
            {/* <div className="column has-text-centered-mobile">{asset.amount}</div> */}

            <div className="column has-text-centered-mobile">
              {
                <RefreshLoadSpinner
                  className={`button custom-not-a-button custom-table-loadspinner ${
                    isGraphAndTableLoading ? "is-loading" : ""
                  }`}
                  text={`${Intl.NumberFormat("en-CA", {
                    notation: "compact",
                    maximumSignificantDigits: 4,
                    style: "currency",
                    currency: userCurrency,
                    currencyDisplay: "narrowSymbol",
                  }).format(asset.userCurrencyValue)} ${userCurrency}`}
                />
              }
            </div>
            <div
              className="
            column
            is-flex is-align-items-center is-justify-content-center
            has-text-centered-mobile
            is-hidden-touch
          "
            >
              <progress
                className={`progress mr-3 is-small custom-progress-${index}`}
                value={asset.percent}
                max="100"
              ></progress>
            </div>
            <div className="column has-text-centered-mobile">{`${asset.percent.toFixed(2)}%`}</div>

            <div className="column is-narrow has-text-centered-mobile">
              <div className="dropdown is-hoverable is-right">
                <div className="dropdown-trigger">
                  <button className="button custom-ellipse-btn" aria-haspopup="true" aria-controls="dropdown-menu4">
                    <span className="icon is-small">
                      <FontAwesomeIcon className="fas fa-solid" icon={faEllipsisV} />
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu custom-dropdown" id="dropdown-menu4" role="menu">
                  <div className="dropdown-content">
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAsset(asset);
                      }}
                    >
                      Edit
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(asset);
                      }}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isInfoOpen && selectedAsset === asset.id && <AssetInfo asset={asset} />}
          {isDeleteOpen && deleteId === asset.id && (
            <DeleteAssetModal
              asset={asset}
              handleDeleteConfirm={handleDeleteConfirm}
              handleDeleteCancel={handleDeleteCancel}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Assets;
