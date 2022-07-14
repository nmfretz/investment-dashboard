import { useState, useEffect } from "react";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

import { DATA_COLORS } from "../../../utils/graphColors";
import { getHistoricalStockPrices, findNearestStartDate } from "../../../lib/getHistoricalStockPrices";
import getHistoricalCryptoPrices from "../../../lib/getHistoricalCryptoPrices";

const HistoricalPriceGraph = ({ asset, minDate, setIsLoadingPriceGraph }) => {
  const [historicalPrices, setHistoricalPrices] = useState({ dates: [], prices: [] });
  const [minX, setMinX] = useState(null);
  const [lineColor, setLineColor] = useState();

  useEffect(() => {
    // on initial graph load
    async function fetchData() {
      let fetchedData;
      if (asset.type === "Stock") {
        // console.log("fetching historical stock price data");
        fetchedData = await getHistoricalStockPrices(asset.symbol);
        setIsLoadingPriceGraph(false);
      } else {
        // console.log("fetching historical crypto price data");
        // fetchedData = { dates: ["2019-01-01", "2020-01-01"], prices: [5, 10] };
        fetchedData = await getHistoricalCryptoPrices(asset.symbol);
        // console.log(fetchedData);
        setIsLoadingPriceGraph(false);
      }
      setHistoricalPrices(fetchedData);
    }
    fetchData();
  }, [asset.type, asset.symbol, setIsLoadingPriceGraph]);

  // calc minX
  useEffect(() => {
    if (!minDate) return;
    setMinX(findNearestStartDate(minDate, historicalPrices.dates));
  }, [minDate, historicalPrices]);

  // TODO - can all this be placed below in data block instead of a useEffect?
  // calc lineColor
  useEffect(() => {
    if (!minX) return;
    const indexOfMinDate = historicalPrices.dates.indexOf(minX);
    const startPrice = Number(historicalPrices.prices[indexOfMinDate]);
    const endPrice = Number(historicalPrices.prices[historicalPrices.prices.length - 1]);
    if (startPrice > endPrice) {
      setLineColor(DATA_COLORS.red);
      // console.log("set line to red");
    } else {
      setLineColor(DATA_COLORS.green);
      // console.log("set line to green");
    }
  }, [minX, historicalPrices]);

  // data block
  const data = {
    datasets: [
      {
        label: "Daily Price at Close",
        data: historicalPrices.prices,
        borderColor: lineColor
          ? lineColor
          : parseInt(historicalPrices.prices[historicalPrices.prices.length - 1]) > parseInt(historicalPrices.prices[0])
          ? DATA_COLORS.green
          : DATA_COLORS.red,
        backgroundColor: lineColor
          ? lineColor
          : parseInt(historicalPrices.prices[historicalPrices.prices.length - 1]) > parseInt(historicalPrices.prices[0])
          ? DATA_COLORS.green
          : DATA_COLORS.red,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
    labels: historicalPrices.dates,
  };

  // options block
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animations: {
      y: {
        easing: "easeInOutElastic",
        from: (ctx) => {
          if (ctx.type === "data") {
            if (ctx.mode === "default" && !ctx.dropped) {
              ctx.dropped = true;
              return 0;
            }
          }
        },
      },
    },
    datasets: {
      line: {},
    },
    scales: {
      x: {
        type: "time",
        min: minX, // may need logic here for crypto earliest time
        grid: {
          // color: CHART_COLORS.axes,
        },
        ticks: {
          // maxTicksLimit: 2,
          // display: false,
          minRotation: 0,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: false,
        // suggestedMin: minY,
        grid: {
          // color: CHART_COLORS.axes,
        },
        ticks: {
          callback: function (value, index, values) {
            value = value.toString();
            value = value.split(/(?=(?:...)*$)/);
            value = value.join(",");
            return "$" + value;
          },
        },
      },
    },
    plugins: {
      title: {
        display: false,
        text: "Daily Price",
      },
      tooltip: {
        intersect: false,
        position: "nearest",
        yAlign: "bottom",
      },
    },
  };

  return (
    <div className="custom-price-chart-container">
      <Line data={data} options={options} width={500} height={500 / 1.5} />
    </div>
  );
};

export default HistoricalPriceGraph;
