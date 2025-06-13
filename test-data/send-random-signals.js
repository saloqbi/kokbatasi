
const axios = require('axios');

// توليد بيانات توصية وهمية
function generateRandomSignal() {
  const types = ['Buy', 'Sell'];
  const symbols = ['TASI', 'AAPL', 'BTC', 'ETH', 'SP500'];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomPrice = (Math.random() * 300 + 50).toFixed(2);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const date = new Date().toISOString().split('T')[0];

  return {
    symbol: randomSymbol,
    price: randomPrice,
    type: randomType,
    date: date
  };
}

// إرسال عدد معين من التوصيات العشوائية
const TOTAL = 5;

for (let i = 0; i < TOTAL; i++) {
  const signal = generateRandomSignal();

  axios.post('http://localhost:5000/api/signals', signal)
    .then(res => {
      console.log(`✅ Sent random signal [${i + 1}]:`, res.data);
    })
    .catch(err => {
      console.error(`❌ Failed to send random signal [${i + 1}]:`, err.message);
    });
}
