import Assets from "./Assets";

const TableOfAssets = (props) => {
  const { assets, userCurrency, deleteAsset, handleEditAsset, isGraphAndTableLoading } = props;
  return (
    <>
      <section className="section is-small pb-0">
        <div>
          <div className="columns is-centered is-vcentered is-mobile is-gapless custom-table-header">
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile">Asset</div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile is-hidden-mobile">
              Type
            </div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile is-hidden-mobile">
              Price
            </div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile">Amount</div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile">Value</div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile is-hidden-touch">
              Portfolio %
            </div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile is-invisible-desktop">
              %
            </div>
            <div className="column has-text-weight-bold has-text-black has-text-centered-mobile is-narrow">
              <div className="dropdown is-hoverable is-invisible">
                <div className="dropdown-trigger">
                  <button className="button custom-ellipse-btn" aria-haspopup="true" aria-controls="dropdown-menu4">
                    <span className="icon is-small">
                      <i className="fas fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu custom-dropdown" id="dropdown-menu4" role="menu">
                  <div className="dropdown-content">
                    <a className="dropdown-item"> Edit </a>
                    <a className="dropdown-item"> Delete </a>
                  </div>
                </div>
              </div>
              <div className="custom-header-spacer-edit"></div>
            </div>
          </div>
          <div>
            <Assets
              assets={assets}
              userCurrency={userCurrency}
              isGraphAndTableLoading={isGraphAndTableLoading}
              handleEditAsset={handleEditAsset}
              deleteAsset={deleteAsset}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default TableOfAssets;
