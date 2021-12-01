import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";

const Instructions = () => {
  return (
    <>
      <div className="container pt-3">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <span className="has-text-centered">click on row to view company financials and price history</span>
          <span className="icon is-medium">
            <FontAwesomeIcon className="fas fa-lg fa-solid" icon={faAngleDoubleDown} />
          </span>
        </div>
      </div>
    </>
  );
};

export default Instructions;
