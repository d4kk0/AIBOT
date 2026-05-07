const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt, subject, topic, history } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const chat = model.startChat({
            history: history || [],
            systemInstruction: `
                אתה Gemini, מורה פרטי עילית. 
                התלמיד לומד ${topic} במקצוע ${subject}.
                
                הנחיות קשיחות:
                1. אישיות: תהיה חכם, סקרן, וסבלני. אל תענה תשובות קצרות - תן תשובות עם עומק.
                2. שפה: עברית מושלמת. אם התלמיד כותב עם שגיאות כתיב (כמו 'מטמתיקה'), תתעלם מהן ותענה לעניין.
                3. שיטה: אל תיתן את כל הפתרון מיד. הסבר חלק אחד ושאל את התלמיד שאלה כדי לראות שהוא הבין.
                4. מבנה: השתמש בבולד (**) להדגשת מושגים חשובים ובאימוג'ים כדי להפוך את זה לידידותי.
            `
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "השרת נתקע, נסה שוב." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is LIVE on port ${PORT}`));