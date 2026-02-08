// ===== PERSONALIZATION =====
const GUESTS = {
    // form: 'ты' — для друзей/одного человека, 'вы' — для пар/взрослых
    'artem228pivin':   { greeting: 'Дорогие Артём и Полина!', form: 'вы' },
    // -- Добавляй гостей сюда --
    'tixon':      { greeting: 'Дорогие Саша и Даша!', form: 'вы' },
    'polya':   { greeting: 'Дорогая Полина!', form: 'ты' },
    'stoyan':     { greeting: 'Дорогие Аня, Женя, Лада, Даша и Слава!', form: 'вы' },
    // 'natasha':   { greeting: 'Дорогая Наташа!', form: 'ты' },
};

const TEXTS = {
    'вы': {
        body: 'И\u00a0будем безмерно счастливы разделить это радостное событие именно с\u00a0вами — людьми, которые нам так дороги.',
        call: 'Приглашаем вас стать свидетелями нашей любви<br>и\u00a0разделить с нами этот незабываемый день.',
    },
    'ты': {
        body: 'И\u00a0будем безмерно счастливы разделить это радостное событие именно с\u00a0тобой.',
        call: 'Приглашаем тебя стать свидетелем нашей любви<br>и\u00a0разделить с нами этот незабываемый день.',
    },
};

(function applyPersonalization() {
    const guestId = new URLSearchParams(window.location.search).get('guest');
    if (!guestId || !GUESTS[guestId]) return;

    const guest = GUESTS[guestId];
    const texts = TEXTS[guest.form] || TEXTS['вы'];

    document.getElementById('greeting').textContent = guest.greeting;
    document.getElementById('inviteBody').innerHTML = texts.body;
    document.getElementById('inviteCall').innerHTML = texts.call;
})();

// ===== COUNTDOWN =====
function updateCountdown() {
    const wedding = new Date('2026-08-01T16:00:00');
    const now = new Date();
    const diff = wedding - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

// ===== NAV DOTS =====
const sections = ['hero', 'invitation', 'countdown', 'details', 'schedule', 'gifts', 'rsvp'];
const dots = document.querySelectorAll('.nav-dot');

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionId = dot.getAttribute('data-section');
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            dots.forEach(d => d.classList.remove('active'));
            const activeDot = document.querySelector(`.nav-dot[data-section="${entry.target.id}"]`);
            if (activeDot) activeDot.classList.add('active');
        }
    });
}, { threshold: 0.3 });

sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
});

// ===== RSVP FORM =====
// !! ВСТАВЬ СЮДА СВОЙ URL ИЗ GOOGLE APPS SCRIPT !!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbww5L_IcvMoPeAellYn5qeIYzo0D-6UnjVDalPc0QsXhvF_3wVQ-rcuoTBUN6aZ-aZM7w/exec';

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = this.querySelector('.submit-btn');
    btn.innerHTML = '<span>Отправляем...</span>';
    btn.disabled = true;

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        this.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
    })
    .catch(() => {
        this.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
    });
});

// ===== FLOATING PETALS =====
function createPetal() {
    const container = document.getElementById('petals');
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 8 + 6;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 8;
    const delay = Math.random() * 5;
    const hue = Math.random() > 0.5 ? 'var(--rose)' : 'var(--gold-light)';

    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = left + '%';
    petal.style.background = hue;
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';

    container.appendChild(petal);

    setTimeout(() => petal.remove(), (duration + delay) * 1000);
}

// Create petals periodically
setInterval(createPetal, 2000);
// Initial batch
for (let i = 0; i < 5; i++) {
    setTimeout(createPetal, i * 400);
}
