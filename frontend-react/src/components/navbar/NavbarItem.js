const NavbarItem = ({ href, innerText }) => {
  return (
    <a className="navbar-item" href={href} target="_blank" rel="noreferrer">
      {innerText}
    </a>
  );
};

export default NavbarItem;
