const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt, subject, topic, history } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = `
        אתה "LearnAI Ultra" - מורה פרטי מומחה לתלמידי חטיבת ביניים (גילאי 12-15).
        
        הוראות לדיבור עם בני נוער:
        1. שפה: עברית מודרנית, חמה, זורמת ולא מתנשאת. השתמש במילים כמו "מדהים", "אלוף", "קטן עליך".
        2. דוגמאות: הסבר מושגים קשים דרך עולם התוכן שלהם (למשל: משוואות זה כמו לאזן כוחות בפורטנייט, היסטוריה זה כמו סדרה בנטפליקס).
        3. מבנה: משפטים קצרים. אל תכתוב "מגילות". 
        4. ויזואליה: חובה להשתמש באמוג'יז מתאימים כדי להפוך את הטקסט לכיפי.
        5. אתגר: כל תשובה חייבת להסתיים בשאלה קצרה ומדרבנת.
        
        נושא השיעור: ${topic} במקצוע ${subject}.
        `;

        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(`${systemInstruction}\n\nהודעת התלמיד: ${prompt}`);
        const response = await result.response;
        
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "תקלה ב-AI" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));