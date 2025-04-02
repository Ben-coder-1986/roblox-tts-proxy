import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY"; // Replace with your actual API key

app.post("/tts", async (req, res) => {
    try {
        const { text, voice_id } = req.body;
        if (!text || !voice_id) {
            return res.status(400).json({ error: "Missing text or voice_id" });
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
            method: "POST",
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.6, similarity_boost: 0.8 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Proxy running on port ${PORT}`);
});
