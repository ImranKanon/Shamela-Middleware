const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ POST /translate (যেমন করে চলছিল)
app.post("/translate", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  try {
    const resp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
      }
    );
    const reply = resp.data.choices[0].message.content;
    res.json({ translation: reply });
  } catch (err) {
    console.error("Translation Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Translation failed.",
      details: err.response?.data || err.message
    });
  }
});

// ➕ নতুন GET /test রুট — Debug / Browser Test এর জন্য
app.get("/test", async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ error: "Missing ?text=..." });

  try {
    const resp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }]
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
      }
    );
    const reply = resp.data.choices[0].message.content;
    res.json({ translation: reply });
  } catch (err) {
    console.error("Translation Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Translation failed.",
      details: err.response?.data || err.message
    });
  }
});

app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
