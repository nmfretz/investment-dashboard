const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:fromto", async (req, res) => {
  const fromto = req.params.fromto;
  const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${fromto}=X`);
  const { data } = await response;
  res.json(data);
});

module.exports = router;
