const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 1. सर्वर स्टेटस
app.get('/', (req, res) => {
    res.json({ status: "Online", message: "TapChat Server एकदम बढ़िया काम कर रहा है!" });
});

// 2. AI Chat Route
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt देना ज़रूरी है" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, reply: text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// ==================== REELS & POSTS API ====================
app.get('/api/reels', async (req, res) => {
    try {
        // Pexels Public API से फ्री ट्रेंडिंग रील्स
        const response = await fetch('https://api.pexels.com/videos/popular?per_page=15', {
            headers: {
                'Authorization': '563492ad6f91700001000001234567890abcdef1234567890' // टेस्टिंग की चाबी
            }
        });
        const data = await response.json();
        
        if (data.videos) {
            const reels = data.videos.map(video => ({
                id: video.id,
                video_url: video.video_files[0]?.link,
                user: video.user.name,
                likes: Math.floor(Math.random() * 5000) + 100
            }));
            return res.json({ success: true, reels });
        }
        res.json({ success: false, reels: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

