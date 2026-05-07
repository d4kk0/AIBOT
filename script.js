let conversationHistory = [];
const SERVER_URL = 'https://aibot-kh51.onrender.com/chat';

async function startLearning() {
    const subjInput = document.getElementById('subject');
    const topInput = document.getElementById('topic');
    const errorDiv = document.getElementById('error-message');

    const subj = subjInput.value.trim();
    const top = topInput.value.trim();

    // בדיקת ג'יבריש: אם אין לפחות 2 אותיות (בעברית או אנגלית), או שזה רק מספרים
    const isGibberish = (str) => !/[א-תa-zA-Z]/.test(str) || str.length < 2;

    if (isGibberish(subj) || isGibberish(top)) {
        errorDiv.innerText = "שגיאה: נא להזין מקצוע ונושא אמיתיים (למשל: היסטוריה)";
        errorDiv.style.display = "block";
        return;
    }

    errorDiv.style.display = "none";
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'grid';
    document.getElementById('topicTitle').innerText = top;

    await talkToAI(`היי, בוא נתחיל ללמוד על ${top}`, subj, top);
}

async function talkToAI(userInput, subj, top) {
    if (!userInput) return;
    if (!userInput.includes("בוא נתחיל ללמוד")) appendMessage('user', userInput);

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userInput, subject: subj, topic: top, history: conversationHistory })
        });

        const data = await response.json();
        
        conversationHistory.push({ role: "user", parts: [{ text: userInput }] });
        conversationHistory.push({ role: "model", parts: [{ text: data.text }] });

        appendMessage('bot', data.text);
    } catch (err) {
        appendMessage('bot', "🔴 שגיאה בחיבור לשרת. וודא ש-Render מופעל.");
    }
}

function appendMessage(role, text) {
    const area = document.getElementById('messagesArea');
    const msg = document.createElement('div');
    msg.className = `message ${role}`;
    
    // פורמט של בולד ואימג'ים
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    msg.innerHTML = `<strong>${role === 'bot' ? '⭐ Gemini Tutor' : '🚀 אתה'}</strong><br>${formattedText}`;
    
    area.appendChild(msg);
    area.scrollTop = area.scrollHeight;
}