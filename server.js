// TapChat Custom Backend Server
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. सर्वर चेक करने का बेसिक रूट
app.get('/', (req, res) => {
    res.json({ status: "Online", message: "TapChat Server 100% काम कर रहा है!" });
});

// 2. AI Chat Endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    res.json({ 
        success: true, 
        reply: `TapChat Server: आपका मैसेज "${message}" सर्वर तक पहुँच गया है!` 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

