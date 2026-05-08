const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors()); // זה קריטי! מאפשר לאתר שלך לדבר עם השרת
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt, subject, topic, history } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const chat = model.startChat({
            history: history || [],
            systemInstruction: `אתה Gemini, מורה פרטי עילית. התלמיד לומד ${topic} בשיעור ${subject}. תהיה חכם, רהוט, ותן תשובות מושקעות עם דוגמאות. אל תתקן שגיאות כתיב של התלמיד.`
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running!`));