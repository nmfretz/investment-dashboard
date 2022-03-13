const FinancialsDropdownItems = ({ chartDropdownItems, handleChartChange }) => {
  return (
    <>
      {chartDropdownItems.map((item, index) => {
        return (
          <a key={index} className="dropdown-item" onClick={() => handleChartChange(item)}>
            {item}
          </a>
        );
      })}
    </>
  );
};

export default FinancialsDropdownItems;
