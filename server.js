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
        
        // שימוש במודל הפרו - הכי מתקדם שיש
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro",
            systemInstruction: `
                שם המערכת: Gemini Tutor Elite v4.0
                תפקיד: מורה פרטי ברמה של 5 יחידות לימוד לחטיבת ביניים ותיכון.
                הנושא הנוכחי: ${topic} במקצוע ${subject}.

                חוקי התנהגות קשיחים:
                1. טונציה: תהיה כריזמטי, מעורר השראה ורהוט. דבר אל התלמיד בגובה העיניים אבל בסמכותיות של מומחה.
                2. שפה: עברית רהוטה. אם התלמיד כותב בשגיאות כתיב (למשל 'מטמתיקה' או 'היסטורייה'), תתעלם מהן לחלוטין ואל תתקן אותו - פשוט תענה על התוכן.
                3. מבנה תשובה: 
                   - פתח תמיד בברכה חמה או משפט מקשר.
                   - השתמש בסימני הדגשה (**) למושגים קריטיים.
                   - השתמש ברשימות עם תבליטים (bullet points) להסברים ארוכים.
                   - הוסף אנלוגיה אחת מעניינת לפחות בכל הסבר מורכב.
                4. אינטראקציה: לעולם אל תסיים תשובה בלי לשאול את התלמיד שאלת חשיבה קצרה או משימה קטנה.
                5. מגבלות: אם התלמיד מנסה להוציא אותך מהקשר לימודי, החזר אותו בעדינות לנושא ${topic}.
                6. עיצוב: השתמש באימוג'ים רלוונטיים (🎓, 💡, 🧬, 📐) כדי להפוך את הטקסט לנגיש.
            `
        });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                temperature: 0.8, // איזון מושלם בין יצירתיות לדיוק
                topP: 0.9,
                maxOutputTokens: 2000,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        res.json({ text: response.text() });

    } catch (error) {
        console.error("Critical Server Error:", error);
        res.status(500).json({ error: "השרת חווה עומס יתר בגלל אינטליגנציה גבוהה מדי. נסה שוב." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`--- Gemini Master Server Live on Port ${PORT} ---`));