const TimeSelectorBreadCrumb = ({ crumbs, selectedCrumbIndex, setSelectedCrumbIndex }) => {
  return (
    <>
      {crumbs.map((crumb, index) => {
        return (
          <li key={index} className={selectedCrumbIndex === index ? "is-active" : ""}>
            <a onClick={() => setSelectedCrumbIndex(index)}>{crumb}</a>
          </li>
        );
      })}
    </>
  );
};

export default TimeSelectorBreadCrumb;
