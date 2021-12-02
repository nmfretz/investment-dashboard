const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/wake-up", (_, res) => res.json({ status: "Awake" }));

const searchRouter = require("./routes/search");
app.use("/search", searchRouter); // mount router to /search

const priceRouter = require("./routes/price");
app.use("/price", priceRouter);

const currencyRouter = require("./routes/currency");
app.use("/currency", currencyRouter);

const financialsRouter = require("./routes/financials");
app.use("/financials", financialsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening at port:${PORT}`);
});
