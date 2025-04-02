import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(cors());

// ElevenLabs API Config
const ELEVENLABS_API_KEY = process.env.sk_1b88e859b7a3a41a3d79c50b95b916dbb7b0d84904aab05b;
const ELEVENLABS_VOICE_ID = process.env.RqsQjwl6phQuWw8d40AT;
const ELEVENLABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

// Root Route (Health Check)
app.get("/", (req, res) => {
    res.send("✅ ElevenLabs TTS Proxy is running.");
});

// TTS Route
app.post("/tts", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Missing text parameter" });
    }

    try {
        const response = await fetch(ELEVENLABS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API Error: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        res.setHeader("Content-Type", "audio/mpeg");
        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        console.error("❌ TTS Proxy Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
