
const fs = require('fs');
const axios = require('axios');

// قراءة الملفات
const files = ['./signal-buy.json', './signal-sell.json'];

// تنسيق التاريخ: YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

files.forEach((file) => {
  const signalData = JSON.parse(fs.readFileSync(file, 'utf-8'));

  // تحديث التاريخ تلقائيًا
  signalData.date = getCurrentDate();

  axios.post('http://localhost:5000/api/signals', signalData)
    .then(response => {
      console.log(`✅ Sent: ${file} ->`, response.data);
    })
    .catch(error => {
      console.error(`❌ Failed: ${file} ->`, error.message);
    });
});
