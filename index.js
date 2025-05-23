const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/rates', async (req, res) => {
  const pairs = [
    ["EUR", "USD"], ["GBP", "USD"], ["USD", "JPY"], ["USD", "CHF"],
    ["AUD", "USD"], ["NZD", "USD"], ["USD", "CAD"], ["EUR", "GBP"],
    ["EUR", "JPY"], ["EUR", "CHF"], ["GBP", "JPY"], ["GBP", "CHF"],
    ["AUD", "JPY"], ["EUR", "AUD"], ["NZD", "JPY"], ["CAD", "JPY"]
  ];

  const results = {};

  for (let [from, to] of pairs) {
    try {
      const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}`;
      const response = await axios.get(url);
      results[`${from}/${to}`] = parseFloat(response.data.result).toFixed(4);
    } catch (error) {
      results[`${from}/${to}`] = "-";
    }
  }

  res.json(results);
});

app.listen(port, () => {
  console.log(`Forex proxy running at http://localhost:${port}`);
});
