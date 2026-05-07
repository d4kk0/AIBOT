const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// הגדרת המודל - משתמשים ב-1.5 PRO לביצועים מקסימליים
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt, subject, topic, history } = req.body;
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro", // שינוי לגרסת ה-PRO החזקה
        });

        // הגדרות מתקדמות - הופכות אותו לחכם וממוקד יותר
        const generationConfig = {
            temperature: 0.7, // איזון מושלם בין יצירתיות לדיוק
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 2048,
        };

        const chat = model.startChat({
            generationConfig,
            history: history || [],
            systemInstruction: `אתה Gemini, מורה פרטי עילית לתלמידי חטיבת ביניים.
            התפקיד שלך הוא ללמד את הנושא ${topic} במקצוע ${subject}.
            
            חוקים נוקשים:
            1. השתמש בעברית גבוהה אך ברורה.
            2. הסבר מושגים בעזרת אנלוגיות מעולם היום-יום.
            3. בסוף כל הסבר, שאל שאלת הבנה קטנה כדי לוודא שהתלמיד איתך.
            4. אם התלמיד כותב שטויות, החזר אותו בעדינות ובחיוך לנושא הלימוד.
            5. תמיד תהיה מעודד ותשתמש באימוג'ים רלוונטיים.`,
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        
        res.json({ text: response.text() });
    } catch (error) {
        console.error("Critical AI Error:", error);
        res.status(500).json({ error: "המוח של ה-AI חווה עומס, נסה שוב בעוד רגע." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Super AI Server is running on port ${PORT}`));