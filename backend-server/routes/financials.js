const express = require("express");
const axios = require("axios");

const router = express.Router();

const BASE_URL = "https://api.hypercharts.co/v1/";
const FINANCIALS_ENDPOINT = "financials?";

router.get("/:symbol", async (req, res) => {
  const getFinancialsParams = new URLSearchParams({
    symbol: req.params.symbol.toLowerCase(),
    apiKey: process.env.HYPERCHARTS_API_KEY,
  });
  console.log(getFinancialsParams);

  try {
    const response = await axios.get(`${BASE_URL}${FINANCIALS_ENDPOINT}${getFinancialsParams}`);
    const { data } = await response;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json({});
  }
});

module.exports = router;
