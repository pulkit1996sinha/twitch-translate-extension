const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const messages = [];

app.post('/translate', async (req, res) => {
  try {
    const { text } = req.body;

  const libreURL = 'https://translate.argosopentech.com/translate';

const response = await fetch(libreURL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    q: text,
    source: 'auto',
    target: 'en',
    format: 'text'
  })
});

console.log("Status:", response.status);
console.log("Headers:", [...response.headers.entries()]);

const result = await response.json();
console.log("Body:", result);


    console.log("LibreTranslate result:", result);

    if (!result.translatedText) throw new Error("Missing translatedText");

    messages.push({ original: text, translated: result.translatedText });
    res.json({ translated: result.translatedText });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.get('/messages', (req, res) => {
  res.json(messages.slice(-20));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
