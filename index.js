const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const ELEVENLABS_API_KEY = "YOUR_NEW_SECURE_KEY";
const ELEVENLABS_VOICE_ID = "RqsQjwl6phQuWw8d40AT";

app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
            {
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.6, similarity_boost: 0.8 }
            },
            {
                headers: { 
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            }
        );

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(response.data);
    } catch (error) {
        console.error("❌ ElevenLabs API request failed:", error.message);
        res.status(500).send("Error processing TTS request.");
    }
});

// 🔹 Fix: Use process.env.PORT so Render detects it correctly
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
