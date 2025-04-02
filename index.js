const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const ELEVENLABS_API_KEY = "sk_1b88e859b7a3a41a3d79c50b95b916dbb7b0d84904aab05b";
const ELEVENLABS_VOICE_ID = "RqsQjwl6phQuWw8d40AT";

// TTS Route
app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Missing text input" });
        }

        const ELEVENLABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

        const response = await axios.post(ELEVENLABS_API_URL, {
            text: text
        }, {
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json"
            }
        });

        res.json({ audio_url: response.data.audio_url });
    } catch (error) {
        console.error("❌ TTS Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "TTS generation failed" });
    }
});

// ✅ Use the Render-assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
