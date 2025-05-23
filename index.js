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
  try {
    const responses = {}; // نرخ‌ها

    // گرفتن نرخ‌ها برای ارزهای پایه مختلف
    const baseSet = new Set(pairs.map(p => p[0]));

    for (let base of baseSet) {
      const url = `https://open.er-api.com/v6/latest/${base}`;
      const response = await axios.get(url);
      responses[base] = response.data.rates;
    }

    // ساخت خروجی نهایی
    const result = {};
    for (let [base, quote] of pairs) {
      if (responses[base] && responses[base][quote]) {
        result[`${base}/${quote}`] = responses[base][quote].toFixed(4);
      } else {
        result[`${base}/${quote}`] = "-";
      }
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching rates:", err.message);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Forex proxy running on port ${PORT}`);
});
