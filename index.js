const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const pairs = [
  ["EUR", "USD"], ["GBP", "USD"], ["USD", "JPY"], ["USD", "CHF"],
  ["AUD", "USD"], ["NZD", "USD"], ["USD", "CAD"], ["EUR", "GBP"],
  ["EUR", "JPY"], ["EUR", "CHF"], ["GBP", "JPY"], ["GBP", "CHF"],
  ["AUD", "JPY"], ["EUR", "AUD"], ["NZD", "JPY"], ["CAD", "JPY"]
];

app.get('/rates', async (req, res) => {
  const results = {};

  for (let [base, quote] of pairs) {
    try {
      const url = `https://api.exchangerate.host/convert?from=${base}&to=${quote}`;
      const response = await axios.get(url);

      if (response.data && response.data.result) {
        results[`${base}/${quote}`] = parseFloat(response.data.result).toFixed(4);
      } else {
        results[`${base}/${quote}`] = "-";
      }

    } catch (err) {
      results[`${base}/${quote}`] = "-";
    }
  }

  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Forex proxy running on port ${PORT}`);
});
