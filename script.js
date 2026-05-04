// --- בנק נושאים של חטיבת ביניים ---
const juniorHighIdeas = [
    { subj: "מתמטיקה", top: "יחס ופרופורציה" },
    { subj: "מתמטיקה", top: "משוואות עם נעלם אחד" },
    { subj: "מדעים", top: "מערכת ההובלה באדם" },
    { subj: "מדעים", top: "מבנה האטום" },
    { subj: "היסטוריה", top: "המהפכה הצרפתית" },
    { subj: "היסטוריה", top: "הלאומיות בישראל" },
    { subj: "אנגלית", top: "Present Simple vs Progressive" },
    { subj: "תנ״ך", top: "סיפורי אברהם ולוט" },
    { subj: "לשון", top: "חלקי דיבור (שם עצם, פועל, תואר)" }
];

function setRandomPlaceholder() {
    const random = juniorHighIdeas[Math.floor(Math.random() * juniorHighIdeas.length)];
    const sInput = document.getElementById('subject');
    const tInput = document.getElementById('topic');
    if (sInput && tInput) {
        sInput.placeholder = `למשל: ${random.subj}`;
        tInput.placeholder = `למשל: ${random.top}`;
    }
}

setInterval(setRandomPlaceholder, 3000);
window.onload = setRandomPlaceholder;

let conversationHistory = [];

async function startLearning() {
    const subjInput = document.getElementById('subject');
    const topInput = document.getElementById('topic');
    
    // אם המשתמש לא הקליד, קח את מה שיש ב-placeholder
    const subj = subjInput.value || subjInput.placeholder.replace('למשל: ', '');
    const top = topInput.value || topInput.placeholder.replace('למשל: ', '');

    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'grid';
    document.getElementById('topicTitle').innerText = top;

    await talkToAI(`היי! אני רוצה להתחיל ללמוד על ${top}. תוכל להסביר לי את זה הכי פשוט שאפשר?`, subj, top);
}

async function talkToAI(userInput, subj, top) {
    if (userInput.length > 0 && !userInput.includes("רוצה להתחיל ללמוד")) {
        appendMessage('user', userInput);
    }

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userInput, subject: subj, topic: top, history: conversationHistory })
        });

        const data = await response.json();
        
        conversationHistory.push({ role: "user", parts: [{ text: userInput }] });
        conversationHistory.push({ role: "model", parts: [{ text: data.text }] });

        appendMessage('bot', data.text);
        updateSidebarSummary(data.text);
    } catch (err) {
        appendMessage('bot', "🔴 שגיאת חיבור. וודא שכתבת node server.js בטרמינל!");
    }
}

function appendMessage(role, text) {
    const area = document.getElementById('messagesArea');
    const msg = document.createElement('div');
    msg.className = `message ${role}`;
    
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    msg.innerHTML = `<strong>${role === 'bot' ? '⭐ המורה האישי' : '🚀 אתה'}</strong><br>${formattedText}`;
    
    area.appendChild(msg);
    area.scrollTop = area.scrollHeight;
}

function updateSidebarSummary(text) {
    const summary = document.getElementById('summaryContent');
    // לוקח את המשפט הראשון כסיכום "חם"
    const firstSentence = text.split(/[.!?]/)[0];
    summary.innerHTML = `<p style="color: #a78bfa; font-weight: bold;">מה למדנו עכשיו:</p><p>${firstSentence}.</p>`;
}

// שליחה עם אנטר
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('userMsg');
        if (input && input.value) {
            const s = document.getElementById('subject').value || document.getElementById('subject').placeholder.replace('למשל: ', '');
            const t = document.getElementById('topic').value || document.getElementById('topic').placeholder.replace('למשל: ', '');
            talkToAI(input.value, s, t);
            input.value = '';
        }
    }
});