const themeButton = document.getElementById('theme-toggle');
function readPreference(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}
function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch {  }
}
function setTheme(isNight) {
    document.body.classList.toggle('night', isNight);
    document.body.style.backgroundColor = ''; // Clear Assignment 4's background override.
    themeButton.textContent = isNight ? 'Day mode' : 'Night mode';
    themeButton.setAttribute('aria-pressed', String(isNight));
}
setTheme(readPreference('games-theme') === 'night');
themeButton.addEventListener('click', function () {
    const isNight = !document.body.classList.contains('night');
    setTheme(isNight);
    savePreference('games-theme', isNight ? 'night' : 'day');
});
const clickSound = new Audio('audio/notification.wav');
const soundButton = document.getElementById('sound-toggle');
const soundStatus = document.getElementById('sound-status');
let soundEnabled = false;
function playSound() {
    if (!soundEnabled) return;
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(function () {
        soundStatus.textContent = 'Sound unavailable. Try the Test sound button.';
    });
}
soundButton.addEventListener('click', function () {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? 'Sound: on' : 'Sound: off';
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundStatus.textContent = '';
    if (!soundEnabled) clickSound.pause();
});
document.getElementById('play-sound').addEventListener('click', function () {
    soundStatus.textContent = soundEnabled ? 'Playing notification.' : 'Turn sound on first.';
});
document.addEventListener('click', function (event) {
    if (event.target.closest('button')) playSound();
});

const menuLinks = Array.from(document.querySelectorAll('.nav-menu a'));
menuLinks.forEach(function (link, index) {
    link.addEventListener('keydown', function (event) {
        let nextIndex;
        switch (event.key) {
            case 'ArrowRight': case 'ArrowDown': nextIndex = (index + 1) % menuLinks.length; break;
            case 'ArrowLeft': case 'ArrowUp': nextIndex = (index - 1 + menuLinks.length) % menuLinks.length; break;
            case 'Home': nextIndex = 0; break;
            case 'End': nextIndex = menuLinks.length - 1; break;
            default: return;
        }
        event.preventDefault();
        menuLinks[nextIndex].focus();
    });
});

const stars = document.querySelectorAll('.star');
const ratingMessage = document.getElementById('rating-message');
const ratingKey = 'rating-' + document.title;
function displayRating(rating) {
    stars.forEach(function (star) {
        const value = Number(star.dataset.rating);
        star.classList.toggle('selected', value <= rating);
        star.setAttribute('aria-pressed', String(value === rating));
    });
    ratingMessage.textContent = rating ? 'Your rating for ' + document.title + ': ' + rating + '/5.' : 'Choose 1 to 5 stars.';
}
displayRating(Number(readPreference(ratingKey)) || 0);
stars.forEach(function (star) {
    star.addEventListener('click', function () {
        const rating = Number(star.dataset.rating);
        displayRating(rating);
        savePreference(ratingKey, String(rating));
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            star.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 300 });
        }
    });
});
const gameLibrary = {
    games: [
        { title: 'BeamNG.drive', genre: 'simulation', image: 'beamng.webp', page: 'index.html' },
        { title: 'Minecraft', genre: 'sandbox', image: 'minecraft.webp', page: 'minecraft.html' },
        { title: 'Cyberpunk 2077', genre: 'action', image: 'cyberpunk.webp', page: 'cyberpunk.html' },
        { title: 'GTA V', genre: 'action', image: 'gta5.webp', page: 'gta5.html' }
    ],
    getByGenre(genre) {
        return this.games.filter(function (game) {
            return genre === 'all' || game.genre === genre;
        });
    }
};
const genreFilter = document.getElementById('genre-filter');
if (genreFilter) {
    function renderGames() {
        const genre = genreFilter.value;
        let description;
        switch (genre) {
            case 'simulation': description = 'Realistic driving and physics'; break;
            case 'sandbox': description = 'Build and explore freely'; break;
            case 'action': description = 'Explore action-packed worlds'; break;
            default: description = 'Discover all our favorite games';
        }
        const games = gameLibrary.getByGenre(genre);
        document.getElementById('filter-message').textContent = description + ' - ' + games.length + ' game(s).';
        const results = document.getElementById('game-results');
        results.replaceChildren();
        for (const game of games) {
            const card = document.createElement('article');
            card.className = 'result-card';
            const image = document.createElement('img');
            image.src = 'images/' + game.image;
            image.alt = game.title;
            const heading = document.createElement('h3');
            heading.textContent = game.title;
            const link = document.createElement('a');
            link.href = game.page;
            link.textContent = 'Explore game';
            card.append(image, heading, link);
            results.append(card);
        }
    }
    genreFilter.addEventListener('change', renderGames);
    renderGames();
}

const quiz = document.getElementById('game-quiz');
if (quiz) {
    const steps = document.querySelectorAll('.quiz-step');
    const nextButton = document.getElementById('quiz-next');
    const backButton = document.getElementById('quiz-back');
    const submitButton = document.getElementById('quiz-submit');
    const nickname = document.getElementById('player-name');
    const genre = document.getElementById('player-genre');
    const error = document.getElementById('quiz-error');
    let currentStep = 0;

    function showStep(step) {
        steps.forEach(function (element, index) { element.hidden = index !== step; });
        document.getElementById('step-label').textContent = 'Step ' + (step + 1) + ' of 3';
        backButton.disabled = step === 0;
        nextButton.hidden = step === 2;
        submitButton.hidden = step !== 2;
        document.getElementById('quiz-summary').textContent = nickname.value.trim() + ', your preferred genre is ' + genre.value + '.';
        error.textContent = '';
        if (step === 0) nickname.focus();
        if (step === 1) genre.focus();
        if (step === 2) submitButton.focus();
    }
    function changeStep(direction, callback) {
        if (direction > 0 && currentStep === 0 && !nickname.value.trim()) {
            error.textContent = 'Please enter your nickname.';
            nickname.focus();
            return;
        }
        currentStep = Math.max(0, Math.min(2, currentStep + direction));
        document.getElementById('quiz-result').textContent = '';
        callback(currentStep);
    }
    nextButton.addEventListener('click', function () { changeStep(1, showStep); });
    backButton.addEventListener('click', function () { changeStep(-1, showStep); });
    quiz.addEventListener('submit', function (event) {
        event.preventDefault();
        if (currentStep < 2) { changeStep(1, showStep); return; }
        const matches = gameLibrary.getByGenre(genre.value);
        document.getElementById('quiz-result').textContent = nickname.value.trim() + ', try ' + matches.map(function (game) { return game.title; }).join(' or ') + '!';
        playSound();
    });
}
