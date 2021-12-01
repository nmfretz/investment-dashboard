const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/stocks/:input", async (req, res) => {
  try {
    const input = req.params.input;
    const response = await axios.get(`https://query1.finance.yahoo.com/v6/finance/autocomplete?lang=en&query=${input}`);
    const { data } = await response;

    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

const COIN_CAP_API_KEY = process.env.COIN_CAP_API_KEY;

router.get("/crypto/:input", async (req, res) => {
  try {
    const input = req.params.input;
    const response = await axios.get(`https://api.coincap.io/v2/assets`, {
      params: {
        search: input,
      },
      headers: {
        Authorization: `Bearer ${COIN_CAP_API_KEY}`,
      },
    });

    const { data } = await response;
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
