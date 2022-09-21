import financials from "../assets/img/financials.png";

const HyperChartsMessage = ({ isOpen, handleClose }) => {
  return (
    <>
      <div className={`modal ${isOpen ? "is-active" : ""}`}>
        <div className="modal-background" onClick={handleClose}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">HyperCharts API</p>
            <button className="delete" aria-label="close" onClick={handleClose}></button>
          </header>
          <section className="modal-card-body custom-modal-background">
            <p className="mb-3">
              HyperCharts was recently sold to public.com and the API has been discontinued. I am currently looking for
              a new API to query company financials.
            </p>
            <figure className="image custom-welcome-img">
              <img className="custom-img-border" src={financials} alt="example chart of company financials" />
            </figure>
          </section>
          <footer className="modal-card-foot"></footer>
        </div>
      </div>
    </>
  );
};

export default HyperChartsMessage;
