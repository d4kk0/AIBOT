// רשימת נושאים כללית כדי לעזור למערכת להבין מה "הגיוני"
const validCategories = ["מתמטיקה", "מדעים", "היסטוריה", "אנגלית", "תנך", "לשון", "ספרות", "גיאוגרפיה", "פיזיקה", "כימיה", "ביולוגיה"];

async function startLearning() {
    const subjInput = document.getElementById('subject');
    const topInput = document.getElementById('topic');
    const errorMsg = document.getElementById('error-message'); // תוסיף אלמנט כזה ב-HTML

    const subj = subjInput.value.trim();
    const top = topInput.value.trim();

    // בדיקה: האם השדות ריקים?
    if (subj.length < 2 || top.length < 2) {
        showError("אופס! נראה ששכחת למלא מקצוע או נושא.");
        return;
    }

    // בדיקה: האם זה נראה כמו ג'יבריש (מספרים בלבד או תווים מוזרים)?
    const isGibberish = (str) => /^[0-9!@#$%^&*()_+=-]+$/.test(str);
    if (isGibberish(subj) || isGibberish(top)) {
        showError("הממ... זה לא נראה כמו מקצוע לימודי. נסה לכתוב משהו כמו 'מתמטיקה'.");
        return;
    }

    // אם הכל תקין - עוברים למסך הלימוד
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'grid';
    document.getElementById('topicTitle').innerText = top;

    await talkToAI(`היי! אני רוצה להתחיל ללמוד על ${top} במסגרת שיעור ${subj}. תסביר לי את זה בצורה מעמיקה אבל פשוטה, כמו Gemini.`, subj, top);
}

function showError(text) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.innerText = text;
        errorDiv.style.display = 'block';
        setTimeout(() => { errorDiv.style.display = 'none'; }, 4000);
    } else {
        alert(text); // גיבוי אם אין אלמנט HTML
    }
}