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

const API_KEY = "a926e4628f60909aefa2e27ec8fc7c6b";

app.get('/rates', async (req, res) => {
  const results = {};

  for (let [base, quote] of pairs) {
    try {
      const url = `https://api.exchangerate.host/convert?from=${base}&to=${quote}&access_key=${API_KEY}`;
      const response = await axios.get(url);

      if (response.data && typeof response.data.result === 'number') {
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
