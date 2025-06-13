
const fs = require('fs');
const axios = require('axios');

// تحميل بيانات التوصية من ملف
const signalData = JSON.parse(fs.readFileSync('./signal-buy.json', 'utf-8'));

axios.post('http://localhost:5000/api/signals', signalData)
  .then(response => {
    console.log('✅ Signal sent successfully:', response.data);
  })
  .catch(error => {
    console.error('❌ Error sending signal:', error.message);
  });
