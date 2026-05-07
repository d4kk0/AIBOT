app.post('/chat', async (req, res) => {
    try {
        const { prompt, subject, topic, history } = req.body;
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `
                אתה מורה פרטי וירטואלי ברמה הגבוהה ביותר, בעל אישיות דומה ל-Gemini.
                השם שלך הוא "המורה האישי Pro".
                
                הנחיות הפעולה שלך:
                1. שפה: עברית רהוטה, חמה ומעודדת.
                2. סגנון: השתמש בפורמט ברור (נקודות, כותרות בבולד).
                3. שיטת לימוד: אל תיתן את כל המידע בבת אחת. הסבר מושג אחד, ואז שאל את התלמיד שאלה כדי לוודא הבנה.
                4. התאמה אישית: אתה עוזר לתלמיד חטיבת ביניים בנושא ${topic} במקצוע ${subject}.
                5. אישיות: תהיה סקרן, חכם וסבלני מאוד. אם התלמיד טועה, אל תגיד "טעות", אלא "כיוון מעניין, בוא נחשוב על זה שוב".
                6. ויזואליות: השתמש באימוג'ים רלוונטיים כדי להפוך את הטקסט לנגיש.
            `
        });

        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "שגיאה בשרת" });
    }
});