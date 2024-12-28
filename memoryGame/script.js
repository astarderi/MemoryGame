const emojis = [
    "🐅", "🐅", "🐈‍⬛", "🐈‍⬛", "🐈", "🐈", "🐕", "🐕", "🐩", "🐩", "🐆", "🐆", "🐎", "🐎",
    "🦌", "🦌", "🦬", "🦬", "🦏", "🦏", "🦛", "🦛", "🐑", "🐑", "🐖", "🐖", "🐄", "🐄", "🐀", "🐀",
    "🦆", "🦆", "🦩", "🦩", "🦉", "🦉", "🦚", "🦚", "🦑", "🦑", "🦀", "🦀", "🐍", "🐍", "🪳", "🪳",
    "🦋", "🦋", "🐞", "🐞", "🦫", "🦫", "🐌", "🐌", "🦇", "🦇", "🕷", "🕷", "🐥", "🐥"
];

let startTime;  // משתנה שיתעד את זמן התחלת המשחק
let timerInterval;  // משתנה שיתעד את הפונקציה של הטיימר
let isProcessing = false; // משתנה גלובלי למניעת לחיצות בזמן עיבוד התאמות

document.getElementById('setup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const playerName = document.getElementById('player-name').value;
    const pairCount = parseInt(document.getElementById('pair-count').value, 10);

    if (!playerName || isNaN(pairCount) || pairCount < 1 || pairCount > 30) {
        alert('Please enter a valid name and a pair count between 1 and 30.');
        return;
    }

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

    document.getElementById('player-info').innerText = `Player: ${playerName}`;
    startGame(pairCount);
});

function startGame(pairCount) {
    startTime = Date.now(); // תעד את זמן התחלת המשחק

    const emojisSubset = emojis.slice(0, pairCount * 2); // בחר רק את מספר הזוגות המבוקש
    const shuffledEmojis = emojisSubset.sort(() => Math.random() - 0.5); // ערבוב אקראי של האימוג'ים

    const gameContainer = document.querySelector('.game');
    gameContainer.innerHTML = ''; // מחק את התצוגה הקודמת

    shuffledEmojis.forEach((emoji) => {
        const box = document.createElement('div');
        box.className = 'item';
        box.innerHTML = emoji;

        box.onclick = function () {
            if (isProcessing || this.classList.contains('boxOpen') || this.classList.contains('boxMatch')) return;
            this.classList.add('boxOpen'); // פתח את הקלף
            const openBoxes = document.querySelectorAll('.boxOpen');
        
            if (openBoxes.length === 2) {
                isProcessing = true; // מנע לחיצות נוספות
                setTimeout(() => {
                    if (openBoxes[0].innerHTML === openBoxes[1].innerHTML) {
                        // קלפים תואמים
                        openBoxes.forEach((box) => box.classList.add('boxMatch'));
                    }
                    // סגור את הקלפים אם אינם תואמים
                    openBoxes.forEach((box) => box.classList.remove('boxOpen'));
        
                    // בדוק אם כל הקלפים נמצאו
                    if (document.querySelectorAll('.boxMatch').length === pairCount * 2) {
                        clearInterval(timerInterval); // עצירת הטיימר
                        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                        const minutes = Math.floor(elapsedTime / 60);
                        const seconds = elapsedTime % 60;
                        showWinMessage(minutes, seconds); // הצגת הודעת ניצחון
                    }
        
                    isProcessing = false; // אפשר לחיצות נוספות
                }, 1000); // המתן לפני עיבוד התאמות
            }
        };

        gameContainer.appendChild(box);
    });

    startTimer();  // הפעלת טיימר
}

function startTimer() {
    const gameStartTime = Date.now(); // זמן התחלת המשחק
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        document.getElementById('timer').innerText = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function showWinMessage(minutes, seconds) {
    const winMessage = document.getElementById('win-message');
    const winTime = document.getElementById('win-time');
    winTime.innerText = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    winMessage.classList.remove('hidden'); // הסרת המחלקה 'hidden'
    winMessage.classList.add('show'); // הוספת המחלקה 'show' כדי להציג את ההודעה
}

function resetGame() {
    location.reload(); // טוען מחדש את הדף כדי לאתחל את המשחק
}
