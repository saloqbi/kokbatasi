
const fs = require('fs');
const axios = require('axios');

const files = ['./signal-buy.json', './signal-sell.json'];

files.forEach((file) => {
  const signalData = JSON.parse(fs.readFileSync(file, 'utf-8'));

  axios.post('http://localhost:5000/api/signals', signalData)
    .then(response => {
      console.log(`✅ Sent: ${file} ->`, response.data);
    })
    .catch(error => {
      console.error(`❌ Failed: ${file} ->`, error.message);
    });
});
