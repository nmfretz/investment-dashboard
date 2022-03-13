import { useState, useEffect, useRef } from "react";
import { Bar, Line } from "react-chartjs-2";

import { DATA_COLORS, DATA_COLORS_TRANSPARENT } from "../../../lib/graphUtils";
import getCompanyFinancials from "../../../lib/getCompanyFinancials";

const CompanyFinancialsGraph = (props) => {
  const { asset, selectedChart, years, setChartDropdownItems, setIsLoadingFinancialsGraph, setChartTitle } = props;
  const [companyFinancials, setCompanyFinancials] = useState({});
  const [chartType, setChartType] = useState("");
  const [selectedChartConfig, setSelectedChartConfig] = useState({});
  const [dates, setDates] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const isMountedForCompanyFinancials = useRef(true); // object

  useEffect(async () => {
    const fetchedData = await getCompanyFinancials(asset.symbol);
    console.log(fetchedData);
    setCompanyFinancials(fetchedData);
    setIsLoadingFinancialsGraph(false);
  }, []);

  useEffect(() => {
    if (!isMountedForCompanyFinancials.current) {
      if (Object.keys(companyFinancials).length === 0) {
        return setChartTitle(`No financials available from HyperCharts`);
      }
      const tempSelectedChartConfig = companyFinancials.chartsConfig.find((element) => element.title === selectedChart);
      const datasetNames = tempSelectedChartConfig.metrics.map((element) => element.title);
      const tempDatasets = [];

      datasetNames.forEach((series) => {
        const seriesConfig = tempSelectedChartConfig.metrics.find((element) => element.title === series);
        tempDatasets.push({
          label: series,
          data: companyFinancials.financials.map((element) => element[series]),
          // checks if a opacity alpha value exists in hyperchange config object. Sets opacity accordingly.
          borderColor: seriesConfig.alpha
            ? DATA_COLORS_TRANSPARENT[seriesConfig.color]
            : DATA_COLORS[seriesConfig.color],
          backgroundColor: seriesConfig.alpha
            ? DATA_COLORS_TRANSPARENT[seriesConfig.color]
            : DATA_COLORS[seriesConfig.color],
          borderWidth: 1,
          stack: tempSelectedChartConfig.stacked ? "Stack 0" : undefined,
        });
      });

      setChartType(tempSelectedChartConfig.type);
      setSelectedChartConfig(tempSelectedChartConfig);
      setDates(companyFinancials.financials.map((element) => element.Quarter));
      setDatasets(tempDatasets);
      setChartDropdownItems(companyFinancials.chartsConfig.map((chart) => chart.title));
    } else {
      isMountedForCompanyFinancials.current = false;
    }
  }, [companyFinancials, selectedChart]);

  // data block
  const data = {
    labels: dates,
    datasets: datasets,
  };

  // options block
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        min: dates[dates.length - years * 4], // defaults to 2 years when a new company selected. TODO - use crumb state here
        max: dates[dates.length - 1],
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        stacked: selectedChartConfig.stacked,
        ticks: {
          callback: function (value, index, values) {
            let tickLabel;
            let formatter;
            if (selectedChartConfig.formatter && selectedChartConfig.formatter.includes("{v}")) {
              formatter = "{v}";
            } else {
              formatter = selectedChartConfig.formatter;
            }
            switch (formatter) {
              case "money":
                // add logic or regex here for B vs M vs Thousands
                tickLabel = `${selectedChartConfig.currency}${value}M`;
                break;
              case "percent":
                tickLabel = `${value}%`;
                break;
              case "number":
                tickLabel = value;
                break;
              case "number*1000":
                tickLabel = `${value}Th`;
                break;
              case "number*1000000":
                tickLabel = `${value}M`;
                break;
              case "number*1000000000":
                tickLabel = `${value}B`;
                break;
              case "{v}":
                const customFormatter = selectedChartConfig.formatter.replace(formatter, "");
                tickLabel = `${value}${customFormatter}`;
                break;
              default:
                tickLabel = value;
            }
            return tickLabel;
          },
        },
      },
    },
    plugins: {
      title: {
        display: false,
        // text: selectedChart,
      },
    },
  };

  return (
    <div className="custom-financial-chart-container">
      {chartType === "line" && <Line data={data} options={options} width={500} height={500 / 1.5} />}
      {chartType === "bar" && <Bar data={data} options={options} width={500} height={500 / 1.5} />}
    </div>
  );
};

export default CompanyFinancialsGraph;
