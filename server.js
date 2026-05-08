const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors()); // מאפשר חיבור חלק מהאתר לשרת
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt, subject, topic, history } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro",
            systemInstruction: `אתה Gemini, מורה פרטי עילית. 
            התלמיד לומד ${topic} בשיעור ${subject}.
            1. תהיה חכם, רהוט, ומעמיק - בדיוק כמוני (ה-AI שאתה מדבר איתו עכשיו).
            2. אל תתקן שגיאות כתיב של התלמיד, פשוט תענה לעניין.
            3. תן תשובות מושקעות עם דוגמאות מהחיים.
            4. תמיד תשאל שאלה בסוף כדי להמשיך את הלמידה.`
        });

        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Smart Server Ready!`));