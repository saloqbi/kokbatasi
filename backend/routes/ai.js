const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ result: response.data.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

module.exports = router;