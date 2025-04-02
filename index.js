const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// TTS Route
app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Missing text input" });
        }

        const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID";

        const response = await axios.post(ELEVENLABS_API_URL, {
            text: text
        }, {
            headers: {
                "xi-api-key": process.env.ELEVENLABS_API_KEY,
                "Content-Type": "application/json"
            }
        });

        res.json({ audio_url: response.data.audio_url });
    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: "TTS generation failed" });
    }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
