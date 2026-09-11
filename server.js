const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB डेटाबेस कनेक्शन
const MONGO_URI = process.env.MONGO_URI || "";
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("MongoDB Database Connected"))
        .catch(err => console.error("Database connection error:", err));
}

// Gemini AI Setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// 1. सर्वर स्टेटस रूट
app.get('/', (req, res) => {
    res.json({ status: "Online", message: "TapChat Server 100% एक्टिव है!" });
});

// 2. AI Chat Route
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt zaroori hai" });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ success: true, reply: response.text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
