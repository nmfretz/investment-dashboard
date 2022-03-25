const NavbarItem = ({ href, innerText, handleClose }) => {
  return (
    <a className="navbar-item" href={href} target="_blank" rel="noreferrer" onClick={handleClose}>
      {innerText}
    </a>
  );
};

export default NavbarItem;
