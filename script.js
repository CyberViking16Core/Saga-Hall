document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. ПЛАВНАЯ ПРОКРУТКА =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== 2. АККОРДЕОН =====
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.classList.toggle('active');
            accordionHeaders.forEach(other => {
                if (other !== header) {
                    other.nextElementSibling.classList.remove('active');
                }
            });
        });
    });

    // ===== 3. ПОИСК ПО СТРАНИЦЕ =====
    const searchInput = document.querySelector('.search-box input[type="text"]');
    const searchForm = document.querySelector('.search-box form');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.toLowerCase().trim();
            if (query === '') return;
            
            document.querySelectorAll('.search-highlight').forEach(el => {
                el.classList.remove('search-highlight');
                el.style.backgroundColor = '';
            });
            
            const elements = document.querySelectorAll('main p, main li, main h2, main h3, main td');
            let found = false;
            
            elements.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes(query)) {
                    found = true;
                    el.classList.add('search-highlight');
                    el.style.backgroundColor = 'rgba(212, 175, 55, 0.4)';
                }
            });
            
            if (!found) {
                alert(`❌ Ничего не найдено по запросу "${query}".`);
            } else {
                const first = document.querySelector('.search-highlight');
                if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    document.querySelectorAll('.search-highlight').forEach(el => {
                        el.classList.remove('search-highlight');
                        el.style.backgroundColor = '';
                    });
                }, 3000);
            }
        });
    }

    // ===== 4. МОДАЛЬНОЕ ОКНО ГАЛЕРЕИ =====
    const galleryImages = document.querySelectorAll('.gallery-item img');
    if (galleryImages.length > 0) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = '<span class="modal-close">&times;</span><img src="" alt="Full Image">';
        document.body.appendChild(modal);

        galleryImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                modal.querySelector('img').src = img.src;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ===== 5. ВАЛИДАЦИЯ ФОРМЫ =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            if (name.length < 2) {
                alert('❌ Имя должно содержать минимум 2 символа!');
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('❌ Введите корректный Email!');
                return;
            }
            if (message.length < 10) {
                alert('❌ Сообщение должно быть длиннее 10 символов!');
                return;
            }
            alert(`✅ Спасибо, ${name}! Сообщение отправлено.`);
            contactForm.reset();
        });
    }

    // ===== 6. СЧЁТЧИК ПРОСМОТРОВ =====
    let views = parseInt(localStorage.getItem('siteViews')) || 0;
    views++;
    localStorage.setItem('siteViews', views);
    const footer = document.querySelector('footer');
    if (footer && !document.querySelector('.view-counter')) {
        const counter = document.createElement('p');
        counter.className = 'view-counter';
        counter.style.cssText = 'margin-top: 10px; font-size: 14px; opacity: 0.7;';
        counter.innerHTML = `👁️ Вы посетили сайт ${views} раз(а)`;
        footer.appendChild(counter);
    }

    // ===== 7. РУНА ДНЯ =====
    const runes = [
        { char: 'ᚠ', name: 'Феху', meaning: 'Богатство, изобилие, энергия' },
        { char: 'ᚢ', name: 'Уруз', meaning: 'Сила воли, здоровье, мощь' },
        { char: 'ᚦ', name: 'Турисаз', meaning: 'Врата, защита, испытание' },
        { char: 'ᚨ', name: 'Ансуз', meaning: 'Знание, мудрость, Один' },
        { char: 'ᚱ', name: 'Райдо', meaning: 'Путешествие, движение, ритм' },
        { char: 'ᚲ', name: 'Кеназ', meaning: 'Огонь, факел, творчество' },
        { char: 'ᛉ', name: 'Альгиз', meaning: 'Защита, связь с богами' },
        { char: 'ᛏ', name: 'Тейваз', meaning: 'Воин, победа, честь, Тюр' },
        { char: 'ᛗ', name: 'Манназ', meaning: 'Человек, разум, Я' },
        { char: 'ᛟ', name: 'Отала', meaning: 'Наследие, дом, родина' }
    ];

    const runeContainer = document.getElementById('rune-widget-container');
    if (runeContainer) {
        const today = new Date().toDateString();
        let savedDate = localStorage.getItem('runeDate');
        let runeIndex = localStorage.getItem('runeIndex');
        
        if (savedDate !== today || runeIndex === null) {
            runeIndex = Math.floor(Math.random() * runes.length);
            localStorage.setItem('runeDate', today);
            localStorage.setItem('runeIndex', runeIndex);
        }
        
        const r = runes[runeIndex];
        runeContainer.innerHTML = `
            <div class="section-card" style="max-width: 400px; margin: 0 auto; text-align: center;">
                <div style="font-size: 64px; color: #ffcc00; text-shadow: 0 0 15px #ffaa00;">${r.char}</div>
                <h3 style="margin: 10px 0 5px;">${r.name}</h3>
                <p>${r.meaning}</p>
                <p style="font-size: 14px; margin-top: 10px; color: #d4af37;">✨ Руна дня ✨</p>
            </div>
        `;
    }

    // ===== 8. СИМВОЛ ДНЯ =====
    const symbols = [
        { name: "Мьёльнир", symbol: "⚡", meaning: "Молот Тора, защита и разрушение" },
        { name: "Фенрир", symbol: "🐺", meaning: "Чудовищный волк, сын Локи" },
        { name: "Ёрмунганд", symbol: "🐍", meaning: "Мировой змей, обвивающий Мидгард" },
        { name: "Иггдрасиль", symbol: "🌳", meaning: "Мировое древо, связь девяти миров" },
        { name: "Валькнута", symbol: "💀", meaning: "Символ павших воинов, Один" },
        { name: "Хугин и Мунин", symbol: "🐦‍⬛", meaning: "Вороны Одина — мысль и память" },
        { name: "Вальхалла", symbol: "🏰", meaning: "Чертог павших воинов" },
        { name: "Драккар", symbol: "🚤", meaning: "Корабль викингов" }
    ];

    const symbolContainer = document.getElementById('symbol-widget-container');
    if (symbolContainer) {
        const today = new Date().toDateString();
        let savedDate = localStorage.getItem('symbolDate');
        let symbolIndex = localStorage.getItem('symbolIndex');
        
        if (savedDate !== today || symbolIndex === null) {
            symbolIndex = Math.floor(Math.random() * symbols.length);
            localStorage.setItem('symbolDate', today);
            localStorage.setItem('symbolIndex', symbolIndex);
        }
        
        const s = symbols[symbolIndex];
        symbolContainer.innerHTML = `
            <div class="section-card" style="max-width: 400px; margin: 0 auto; text-align: center;">
                <div style="font-size: 64px;">${s.symbol}</div>
                <h3 style="margin: 10px 0 5px;">${s.name}</h3>
                <p>${s.meaning}</p>
                <p style="font-size: 14px; margin-top: 10px; color: #d4af37;">✨ Символ дня ✨</p>
            </div>
        `;
    }

    // ===== 9. ЦИТАТА ДНЯ ИЗ ЭДДЫ =====
    const quotes = [
        { text: "Познай свой дом, прежде чем в него войти. В недружелюбный дом не входи никогда — там тебе причинят зло.", source: "Старшая Эдда, Речи Высокого" },
        { text: "Умрёшь от болезни — доброе имя останется. Умрёшь от меча — слава не умрёт никогда.", source: "Старшая Эдда, Речи Высокого" },
        { text: "Не хвались умом до отъезда, лучше хвались по приезде.", source: "Старшая Эдда, Речи Высокого" },
        { text: "Даже волк не обидит того, кто с ним в мире живёт.", source: "Сага о Гисли" },
        { text: "Лучше живым быть, чем мёртвым лежать. Живой всегда надежду имеет.", source: "Старшая Эдда" },
        { text: "Один — бог виселиц, бог повешенных. Он отдал свой глаз за мудрость.", source: "Младшая Эдда" },
        { text: "Тор сразил великанов, но не смог победить старость.", source: "Сага о Торе" },
        { text: "Фенрир будет разорван, но успеет проглотить Одина.", source: "Прорицание вёльвы" }
    ];

    const quoteContainer = document.getElementById('quote-of-the-day');
    if (quoteContainer) {
        const today = new Date().toDateString();
        let savedDate = localStorage.getItem('quoteDate');
        let quoteIndex = localStorage.getItem('quoteIndex');
        
        if (savedDate !== today || quoteIndex === null) {
            quoteIndex = Math.floor(Math.random() * quotes.length);
            localStorage.setItem('quoteDate', today);
            localStorage.setItem('quoteIndex', quoteIndex);
        }
        
        const q = quotes[quoteIndex];
        quoteContainer.innerHTML = `
            <p style="font-style: italic; font-size: 18px;">«${q.text}»</p>
            <p style="margin-top: 10px; color: #d4af37;">— ${q.source}</p>
            <p style="font-size: 12px; margin-top: 8px;">✨ Цитата дня ✨</p>
        `;
    }

    // ===== 10. ПОГОДА В ОСЛО =====
    const weatherContainer = document.getElementById('oslo-weather');
    if (weatherContainer) {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=59.9139&longitude=10.7522&current_weather=true&timezone=Europe/Berlin')
            .then(response => response.json())
            .then(data => {
                const temp = data.current_weather.temperature;
                const wind = data.current_weather.windspeed;
                const code = data.current_weather.weathercode;
                
                let weatherText = '';
                if (code === 0) weatherText = '☀️ Ясно';
                else if (code === 1 || code === 2) weatherText = '⛅ Облачно';
                else if (code === 3) weatherText = '☁️ Пасмурно';
                else if (code >= 51 && code <= 67) weatherText = '🌧️ Дождь';
                else if (code >= 71 && code <= 77) weatherText = '❄️ Снег';
                else weatherText = '🌫️ Туман';
                
                weatherContainer.innerHTML = `
                    <div style="font-size: 24px;">🌡️ ${temp}°C</div>
                    <div>${weatherText}</div>
                    <div>💨 Ветер: ${wind} м/с</div>
                    <div style="font-size: 12px; margin-top: 10px;">📅 Данные: open-meteo.com</div>
                `;
            })
            .catch(() => {
                weatherContainer.innerHTML = '❌ Не удалось загрузить погоду. Попробуйте позже.';
            });
    }

    // ===== 11. КАРТА СКАНДИНАВИИ С МАРКЕРАМИ =====
    if (typeof L !== 'undefined' && document.getElementById('scandinavia-map')) {
        const map = L.map('scandinavia-map').setView([62.0, 12.0], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        }).addTo(map);
        
        const locations = [
            { coords: [59.9139, 10.7522], name: "Осло", desc: "Столица Норвегии" },
            { coords: [59.3293, 18.0686], name: "Стокгольм", desc: "Столица Швеции" },
            { coords: [55.6761, 12.5683], name: "Копенгаген", desc: "Столица Дании" },
            { coords: [60.3913, 5.3221], name: "Берген", desc: "Город викингов, Хордаланд" },
            { coords: [59.8581, 17.6386], name: "Уппсала", desc: "Древний языческий центр, капище" },
            { coords: [58.9699, 5.7331], name: "Ставангер", desc: "Нефтяная столица + викинг-деревня" }
        ];
        
        locations.forEach(loc => {
            L.marker(loc.coords).addTo(map)
                .bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
        });
    }

    // ===== 12. ПРЕОБРАЗОВАТЕЛЬ ТЕКСТА В РУНЫ =====
    const runeMap = {
        'а': 'ᚨ', 'б': 'ᛒ', 'в': 'ᚹ', 'г': 'ᚷ', 'д': 'ᛞ', 'е': 'ᛖ', 'ё': 'ᛖ', 'ж': 'ᛃ', 'з': 'ᛉ',
        'и': 'ᛁ', 'й': 'ᛁ', 'к': 'ᚲ', 'л': 'ᛚ', 'м': 'ᛗ', 'н': 'ᚾ', 'о': 'ᛟ', 'п': 'ᛈ', 'р': 'ᚱ',
        'с': 'ᛊ', 'т': 'ᛏ', 'у': 'ᚢ', 'ф': 'ᚠ', 'х': 'ᚺ', 'ц': 'ᛏ', 'ч': 'ᚲ', 'ш': 'ᛊ', 'щ': 'ᛊ',
        'ъ': '', 'ы': 'ᛁ', 'ь': '', 'э': 'ᛖ', 'ю': 'ᚢ', 'я': 'ᛃ',
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ',
        'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ',
        's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲ', 'y': 'ᛁ', 'z': 'ᛉ'
    };
    
    const convertToRunes = (text) => {
        return text.toLowerCase().split('').map(char => runeMap[char] || char).join('');
    };
    
    const runeInput = document.getElementById('rune-input');
    const runeOutput = document.getElementById('rune-output');
    const runeConvertBtn = document.getElementById('rune-convert-btn');
    
    if (runeInput && runeOutput && runeConvertBtn) {
        runeConvertBtn.addEventListener('click', () => {
            const inputText = runeInput.value.trim();
            if (inputText === '') {
                runeOutput.innerHTML = 'Введите слово или фразу...';
                return;
            }
            const runes = convertToRunes(inputText);
            runeOutput.innerHTML = runes;
        });
    }

    // ===== 13. AOS =====
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }

    // ===== 14. TIPPY.JS =====
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content], .tippy-tip', { 
            theme: 'light', 
            arrow: true,
            allowHTML: true,
            placement: 'top',
            interactive: true
        });
    }

    // ===== 15. CHART.JS =====
    const chartCanvas = document.getElementById('pantheonChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        new Chart(chartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Асы (Война)', 'Ваны (Природа)', 'Великаны (Хаос)', 'Другие'],
                datasets: [{ data: [12, 5, 8, 5], backgroundColor: ['#d4af37', '#4a8d91', '#914a4a', '#666666'] }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#e0e0e0' } } } }
        });
    }

    // ===== 16. CLIPBOARD.JS =====
    const copyBtn = document.getElementById('copyQuoteBtn');
    if (copyBtn && typeof ClipboardJS !== 'undefined') {
        new ClipboardJS(copyBtn, {
            text: () => {
                const quote = document.querySelector('.quote-text')?.innerText || '';
                const author = document.querySelector('.quote-author')?.innerText || '';
                return `${quote}\n\n${author}`;
            }
        }).on('success', () => alert('📋 Цитата скопирована!'));
    } else if (copyBtn) {
        copyBtn.onclick = () => {
            const quote = document.querySelector('.quote-text')?.innerText || '';
            const author = document.querySelector('.quote-author')?.innerText || '';
            navigator.clipboard.writeText(`${quote}\n\n${author}`).then(() => alert('📋 Цитата скопирована!'));
        };
    }

    // ===== 17. COUNTUP.JS =====
    if (typeof CountUp !== 'undefined') {
        if (document.getElementById('countAesir')) new CountUp('countAesir', 12).start();
        if (document.getElementById('CountVanir')) new CountUp('CountVanir', 4).start();
        if (document.getElementById('countWorlds')) new CountUp('countWorlds', 9).start();
    }

    // ===== 18. ТАЙМЕР ДО РАГНАРЁКА =====
    const timerEl = document.getElementById('ragnarokTimer');
    if (timerEl) {
        const ragnarokDate = new Date();
        ragnarokDate.setFullYear(ragnarokDate.getFullYear() + 2, 6, 1);
        const updateTimer = () => {
            const diff = ragnarokDate - new Date();
            if (diff <= 0) { timerEl.innerHTML = "🔥 РАГНАРЁК НАСТУПИЛ! 🔥"; return; }
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            timerEl.innerHTML = `${days} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`;
        };
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ===== 19. ПРОГРЕСС-БАР УРОВНЯ ЗНАНИЙ (ProgressBar.js) =====
    if (typeof ProgressBar !== 'undefined' && document.getElementById('mythology-progress')) {
        let progressValue = parseInt(localStorage.getItem('mythologyProgress')) || 35;
        const bar = new ProgressBar.Line('#mythology-progress', {
            color: '#d4af37',
            trailColor: 'rgba(255,255,255,0.2)',
            strokeWidth: 10,
            trailWidth: 10,
            duration: 1000
        });
        bar.animate(progressValue / 100);
        
        const increaseBtn = document.getElementById('increase-knowledge');
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                progressValue = Math.min(100, progressValue + 10);
                bar.animate(progressValue / 100);
                localStorage.setItem('mythologyProgress', progressValue);
                if (progressValue === 100) {
                    alert('🔥 Ты истинный скальд! Ты познал все саги!');
                }
            });
        }
    }

    // ===== 20. ТАЙМЕР ДО СКАНДИНАВСКОГО ПРАЗДНИКА =====
    const norseHolidays = [
        { month: 0, day: 1, name: "Йоль (Yule)", desc: "Праздник зимнего солнцестояния, рождение солнца" },
        { month: 1, day: 14, name: "Вальпургиева ночь", desc: "Встреча весны, пробуждение природы" },
        { month: 2, day: 21, name: "Остара (Ostara)", desc: "День весеннего равноденствия, пробуждение земли" },
        { month: 5, day: 21, name: "Лито (Litha)", desc: "День летнего солнцестояния, праздник света" },
        { month: 8, day: 21, name: "Модранич (Mabon)", desc: "День осеннего равноденствия, сбор урожая" },
        { month: 9, day: 31, name: "Ветреная ночь", desc: "Грань между мирами, поминовение предков" },
        { month: 11, day: 25, name: "Йоль (Yule)", desc: "Зимнее солнцестояние" }
    ];

    function getNextHoliday() {
        const now = new Date();
        let nextHoliday = null;
        let minDiff = Infinity;
        
        for (let h of norseHolidays) {
            let holidayDate = new Date(now.getFullYear(), h.month, h.day);
            if (holidayDate < now) {
                holidayDate = new Date(now.getFullYear() + 1, h.month, h.day);
            }
            const diff = holidayDate - now;
            if (diff < minDiff) {
                minDiff = diff;
                nextHoliday = { ...h, date: holidayDate };
            }
        }
        return nextHoliday;
    }

    function updateHolidayTimer() {
        const next = getNextHoliday();
        if (!next) return;
        
        const now = new Date();
        const diff = next.date - now;
        
        const holidayNameEl = document.getElementById('holiday-name');
        const holidayDescEl = document.getElementById('holiday-desc');
        const holidayCountdownEl = document.getElementById('holiday-countdown');
        
        if (!holidayNameEl) return;
        
        if (diff <= 0) {
            holidayNameEl.innerHTML = `🎉 СЕГОДНЯ ${next.name}! 🎉`;
            holidayDescEl.innerHTML = next.desc;
            holidayCountdownEl.innerHTML = "Празднуем!";
            return;
        }
        
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        holidayNameEl.innerHTML = `${next.name}`;
        holidayDescEl.innerHTML = `${next.desc}`;
        holidayCountdownEl.innerHTML = `${days} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`;
    }

    // Запускаем таймер праздника
    if (document.getElementById('holiday-name')) {
        updateHolidayTimer();
        setInterval(updateHolidayTimer, 1000);
    }

    // ===== 21. GLIDE.JS (СЛАЙДЕР ОТЗЫВОВ) =====
    if (typeof Glide !== 'undefined' && document.querySelector('.glide')) {
        new Glide('.glide', {
            type: 'carousel',
            perView: 1,
            autoplay: 4000,
            hoverpause: true
        }).mount();
    }

    // ===== 22. TSPARTICLES =====
    if (typeof tsParticles !== 'undefined' && document.getElementById('tsparticles')) {
        tsParticles.load("tsparticles", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#d4af37" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                move: { enable: true, speed: 1.5, direction: "bottom", out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "repulse" } }
            },
            retina_detect: true
        });
    }

});