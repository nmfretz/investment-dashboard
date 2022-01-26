const express = require("express");
const axios = require("axios");

const router = express.Router();

// Nomics API is rate-limited to 1 request per second
const slowDown = require("express-slow-down");
const nomicsApiSlowDown = slowDown({
  windowMs: 60000, // keep records of requests in memory for 1 min
  delayAfter: 1, // allow 1 request per 1 second, then...
  delayMs: 1000, // add 1 second of delay
  maxDelayMs: 1000, // max value for delayMs
});

router.get("/stock/current/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?&range=max`);
    const { data } = await response;
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

const NOMICS_API_KEY = process.env.NOMICS_API_KEY;
router.get("/crypto/current/:symbol", nomicsApiSlowDown, async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const response = await axios.get(`https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_API_KEY}&ids=${symbol}`); //change back to symbol
    const { data } = await response;
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
router.get("/stock/historical/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;

    // DAILY ADJUSTED END-POINT IS NOW PREMIUM AND MUST BE PAID FOR
    // const response = await axios.get(
    //   `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`
    // );

    // USING WEEKLY ADJUSTED END-POINT
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const { data } = await response;

    // const dates = Object.keys(data["Time Series (Daily)"]).reverse();
    // const prices = Object.values(data["Time Series (Daily)"])
    //   .map((element) => element["5. adjusted close"])
    //   .reverse();

    const dates = Object.keys(data["Weekly Adjusted Time Series"]).reverse();
    const prices = Object.values(data["Weekly Adjusted Time Series"])
      .map((element) => element["5. adjusted close"])
      .reverse();

    const graphData = { dates, prices };
    res.json(graphData);
  } catch (error) {
    console.error(error);
  }
});

router.get("/crypto/historical/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const { data } = await response;

    const dates = Object.keys(data["Time Series (Digital Currency Daily)"]).reverse();
    const prices = Object.values(data["Time Series (Digital Currency Daily)"])
      .map((element) => element["4a. close (USD)"])
      .reverse();

    const graphData = { dates, prices };
    res.json(graphData);
  } catch (error) {
    console.error(error);
  }
});

router.use("/currentcryptoprice/", nomicsApiSlowDown);

module.exports = router;
