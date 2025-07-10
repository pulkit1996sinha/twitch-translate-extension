const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const messages = [];

// ✅ Root route to confirm server is up
app.get('/', (req, res) => {
  res.send('🚀 Twitch Translate Extension API is running!');
});

// 🔁 Translation route
app.post('/translate', async (req, res) => {
  const { text } = req.body;

  try {
    const result = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: 'en',
        format: 'text'
      })
    }).then(r => r.json());

    messages.push({ original: text, translated: result.translatedText });
    res.json({ translated: result.translatedText });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// 🧾 Messages endpoint
app.get('/messages', (req, res) => {
  res.json(messages.slice(-20));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
