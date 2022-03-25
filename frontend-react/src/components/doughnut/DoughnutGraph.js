import { Doughnut } from "react-chartjs-2";
import { DATA_COLORS } from "../../lib/graphUtils";
import RefreshLoadSpinner from "../RefreshLoadSpinner";

const DoughnutGraph = ({ assets, userCurrency, isGraphTableLoading }) => {
  const sumOfAllAssetValues = assets.reduce((total, asset) => {
    return total + asset.userCurrencyValue;
  }, 0);

  const chartPaddingPixels = 15; // Note...

  // data block
  const data = {
    datasets: [
      {
        label: "Dataset 1",
        data: assets.length > 0 ? assets.map((asset) => asset.userCurrencyValue) : [0.01],
        backgroundColor: assets.length > 0 ? Object.values(DATA_COLORS) : ["rgb(225, 225, 225)"],
        // consider smaller border thickness
        hoverOffset: 20,
      },
    ],
    labels: assets.length > 0 ? assets.map((asset) => asset.symbol) : ["No Assets"],
  };

  // portfolio value plugin block for centre of doughnut
  const centreChartValue = {
    id: "centreChartValue",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { top, right, bottom, left, width, height },
      } = chart;
      ctx.save();
      ctx.font = options.fontSize + "px " + options.fontFamily;
      ctx.textAlign = "center";
      ctx.fillStyle = options.fontColor;
      ctx.fillText(
        Intl.NumberFormat("en-CA", {
          style: "currency",
          notation: "compact",
          maximumSignificantDigits: 4,
          currency: options.currency,
          currencyDisplay: "narrowSymbol",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(options.value),
        width / 2 + options.paddingOffset,
        height / 2 + options.offset + options.paddingOffset + options.fontSize * 0.34
      );
    },
  };

  // currency plugin block for centre of doughnut
  const centreChartCurrency = {
    id: "centreChartCurrency",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { top, right, bottom, left, width, height },
      } = chart;
      ctx.save();
      ctx.font = options.fontSize + "px " + options.fontFamily;
      ctx.textAlign = "center";
      ctx.fillStyle = options.fontColor;
      ctx.fillText(
        options.currency,
        width / 2 + options.paddingOffset,
        height / 2 + options.offset + options.paddingOffset + options.fontSize * 0.34
      );
    },
  };

  // options block
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: "50%",
    centerText: {
      display: true,
      text: "TRIAL",
    },
    layout: {
      padding: chartPaddingPixels,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        yAlign: "bottom",
        displayColors: false,
        titleMarginBottom: 0,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            if (context.label === "No Assets") return;

            return `${Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: userCurrency,
              currencyDisplay: "narrowSymbol",
            }).format(context.dataset.data[context.dataIndex])}`;
          },
          afterLabel: function (context) {
            if (context.label === "No Assets") return;

            return `${((context.dataset.data[context.dataIndex] / sumOfAllAssetValues) * 100).toFixed(2)}%` || "";
          },
        },
      },
      centreChartValue: {
        fontColor: "rgb(74, 74, 74)",
        fontSize: 30,
        fontFamily: "Segoe UI",
        offset: 0,
        paddingOffset: chartPaddingPixels,
        currency: userCurrency,
        value: sumOfAllAssetValues,
      },
      centreChartCurrency: {
        fontColor: "rgb(74, 74, 74)",
        fontSize: 20,
        fontFamily: "Segoe UI",
        offset: 30,
        paddingOffset: chartPaddingPixels,
        currency: userCurrency,
      },
    },
  };

  const plugins = [centreChartValue, centreChartCurrency];

  return (
    <div className="custom-doughnut-div">
      <Doughnut data={data} options={options} plugins={plugins} width={500} height={500} />
      {isGraphTableLoading && (
        <RefreshLoadSpinner className={"button is-loading custom-refresh-loadspinner"} text={""} />
      )}
    </div>
  );
};

export default DoughnutGraph;
