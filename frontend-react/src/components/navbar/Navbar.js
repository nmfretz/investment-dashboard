import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";

import NavbarItem from "./NavbarItem";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <nav className="navbar is-white" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="pl-3">
            <span className="icon-text">
              <span className="icon is-large">
                <FontAwesomeIcon className="fas fa-2x fa-solid" icon={faChartPie} />
              </span>
              <span className="pt-3">InvestmentDashboard</span>
            </span>
          </div>
          <button
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div id="" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-end">
            <div className="navbar-item">
              <NavbarItem
                href="https://nathanfretz.me"
                innerText="Nathan Fretz"
                handleClose={() => setIsActive(false)}
              />
              <NavbarItem href="https://github.com/nmfretz" innerText="Github" handleClose={() => setIsActive(false)} />
              <NavbarItem
                href="https://twitter.com/nmfretz"
                innerText="Twitter"
                handleClose={() => setIsActive(false)}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
