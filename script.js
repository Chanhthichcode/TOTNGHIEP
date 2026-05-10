// === Graduation Invitation - Script ===

(function () {
    'use strict';

    // --- Config ---
    const TARGET_DATE = new Date('2026-05-23T15:00:00+07:00');
    const MUSIC_SRC = 'assets/audio/graduation.mp3';
    const CONFETTI_COLORS = ['#8B1A2B', '#D4A853', '#FFF8F0', '#C9918A', '#5C1A28'];

    // --- Guest List ---
    var GUEST_MAP = {
        'canha': 'CẢ NHÀ',
        'nam': 'NAM'
        // Thêm khách mới ở đây, ví dụ:
        // 'linh': 'CHỊ LINH',
        // 'gia-dinh-anh-hung': 'GIA ĐÌNH ANH HÙNG',
    };

    // --- DOM Elements ---
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('openBtn');
    const mainContent = document.getElementById('mainContent');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const fireworkBtn = document.getElementById('fireworkBtn');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownMessage = document.getElementById('countdownMessage');
    const particlesCanvas = document.getElementById('particles');

    var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || window.innerWidth < 768;

    // --- Audio ---
    let audio = null;
    let isPlaying = false;

    // --- Countdown ---
    let countdownInterval = null;
    let countdownFinished = false;

    // =====================
    // Overlay / Open Invite
    // =====================
    openBtn.addEventListener('click', function () {
        overlay.classList.add('hidden');
        musicToggle.classList.add('show');

        // Init audio
        initAudio();

        // Confetti burst
        setTimeout(function () {
            fireConfetti('burst');
        }, 500);

        // Start scroll animations
        initScrollAnimations();
    });

    // =====================
    // Audio Player
    // =====================
    function initAudio() {
        audio = new Audio(MUSIC_SRC);
        audio.loop = true;
        audio.volume = 0.3;

        var savedPref = localStorage.getItem('musicMuted');
        if (savedPref === 'true') {
            audio.volume = 0;
            isPlaying = false;
            musicToggle.classList.add('muted');
            musicIcon.innerHTML = '&#128263;';
        } else {
            audio.play().then(function () {
                isPlaying = true;
            }).catch(function () {
                // Autoplay blocked - user needs to click music toggle
                isPlaying = false;
            });
        }
    }

    musicToggle.addEventListener('click', function () {
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            musicToggle.classList.add('muted');
            musicIcon.innerHTML = '&#128263;';
            localStorage.setItem('musicMuted', 'true');
        } else {
            audio.play().then(function () {
                isPlaying = true;
                musicToggle.classList.remove('muted');
                musicIcon.innerHTML = '&#128264;';
                localStorage.setItem('musicMuted', 'false');
            }).catch(function () { });
        }
    });

    // =====================
    // Countdown Timer
    // =====================
    function startCountdown() {
        console.log('Countdown started. Target:', TARGET_DATE.toString(), '| Now:', new Date().toString());
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        var now = new Date().getTime();
        var target = TARGET_DATE.getTime();
        var diff = target - now;
        console.log('Countdown diff:', diff, '| days:', Math.floor(diff / (1000 * 60 * 60 * 24)));

        if (diff <= 0) {
            clearInterval(countdownInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';

            if (!countdownFinished) {
                countdownFinished = true;
                countdownMessage.textContent = 'Chúc mừng tốt nghiệp!';
                countdownMessage.classList.add('show');
                fireConfetti('celebration');
            }
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((diff % (1000 * 60)) / 1000);

        updateDigit(daysEl, pad(days));
        updateDigit(hoursEl, pad(hours));
        updateDigit(minutesEl, pad(mins));
        updateDigit(secondsEl, pad(secs));
    }

    function pad(num) {
        return num < 10 ? '0' + num : '' + num;
    }

    function updateDigit(el, value) {
        if (el.textContent !== value) {
            el.textContent = value;
            el.classList.remove('flip');
            // Trigger reflow for animation restart
            void el.offsetWidth;
            el.classList.add('flip');
        }
    }

    // =====================
    // Confetti
    // =====================
    function fireConfetti(type) {
        if (typeof confetti === 'undefined') return;

        switch (type) {
            case 'burst':
                confetti({
                    particleCount: isMobile ? 80 : 150,
                    spread: 180,
                    origin: { y: 0.6 },
                    colors: CONFETTI_COLORS
                });
                break;

            case 'celebration':
                // Multi-burst celebration
                var end = Date.now() + 2000;
                var interval = setInterval(function () {
                    if (Date.now() > end) {
                        clearInterval(interval);
                        return;
                    }
                    confetti({
                        particleCount: isMobile ? 3 : 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: CONFETTI_COLORS
                    });
                    confetti({
                        particleCount: isMobile ? 3 : 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: CONFETTI_COLORS
                    });
                }, 50);
                break;

            case 'random':
                var patterns = ['center', 'sides', 'star'];
                var pattern = patterns[Math.floor(Math.random() * patterns.length)];

                if (pattern === 'center') {
                    confetti({
                        particleCount: isMobile ? 60 : 120,
                        spread: 360,
                        origin: { y: 0.5 },
                        colors: CONFETTI_COLORS
                    });
                } else if (pattern === 'sides') {
                    confetti({
                        particleCount: isMobile ? 40 : 80,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: CONFETTI_COLORS
                    });
                    confetti({
                        particleCount: isMobile ? 40 : 80,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: CONFETTI_COLORS
                    });
                } else {
                    confetti({
                        particleCount: isMobile ? 50 : 100,
                        spread: 120,
                        startVelocity: 45,
                        origin: { y: 0.9 },
                        colors: CONFETTI_COLORS
                    });
                }
                break;
        }
    }

    // =====================
    // Scroll Animations
    // =====================
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15
        });

        elements.forEach(function (el) {
            observer.observe(el);
        });

        // Make first hero content visible immediately
        var heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('visible');
        }
    }

    // =====================
    // Particle Background
    // =====================
    function initParticles() {
        var canvas = particlesCanvas;
        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = window.innerWidth < 480 ? 25 : (window.innerWidth < 768 ? 40 : 80);

        // Graduation emojis for floating icons
        var gradEmojis = ['🎓', '📜', '📖', '🏆', '✨', '🎉'];
        var logoImg = new Image();
        logoImg.src = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Logo_PTIT_University.png';
        var logoLoaded = false;
        logoImg.onload = function () { logoLoaded = true; };
        var emojiCount = window.innerWidth < 480 ? 18 : (window.innerWidth < 768 ? 28 : 40);

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        // Create dot particles
        var colors = ['rgba(139, 26, 43, 0.5)', 'rgba(212, 168, 83, 0.5)', 'rgba(255, 248, 240, 0.4)', 'rgba(201, 145, 138, 0.4)'];

        for (var i = 0; i < particleCount; i++) {
            particles.push({
                type: 'dot',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedY: -(Math.random() * 0.4 + 0.1),
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Create emoji particles
        for (var j = 0; j < emojiCount; j++) {
            particles.push({
                type: 'emoji',
                emoji: gradEmojis[Math.floor(Math.random() * gradEmojis.length)],
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 18 + 28,
                speedY: -(Math.random() * 0.3 + 0.15),
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.35 + 0.35,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 0.5
            });
        }

        // Create floating logo particles
        var logoCount = window.innerWidth < 480 ? 4 : (window.innerWidth < 768 ? 6 : 10);
        for (var k = 0; k < logoCount; k++) {
            particles.push({
                type: 'logo',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 35,
                speedY: -(Math.random() * 0.25 + 0.1),
                speedX: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.2 + 0.2,
                rotation: Math.random() * 30 - 15,
                rotSpeed: (Math.random() - 0.5) * 0.2
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.y < -30) {
                    p.y = canvas.height + 30;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -30) p.x = canvas.width + 30;
                if (p.x > canvas.width + 30) p.x = -30;

                if (p.type === 'logo') {
                    if (logoLoaded) {
                        p.rotation += p.rotSpeed;
                        ctx.save();
                        ctx.globalAlpha = p.opacity;
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation * Math.PI / 180);
                        ctx.drawImage(logoImg, -p.size / 2, -p.size / 2, p.size, p.size);
                        ctx.restore();
                    }
                } else if (p.type === 'emoji') {
                    p.rotation += p.rotSpeed;
                    ctx.save();
                    ctx.globalAlpha = p.opacity;
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.font = p.size + 'px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.emoji, 0, 0);
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // =====================
    // Guest Name
    // =====================
    function initGuestName() {
        var params = new URLSearchParams(window.location.search);
        var guestKey = params.get('to');
        if (!guestKey) return;

        var guestName = GUEST_MAP[guestKey];
        if (!guestName) return;

        var guestEl = document.getElementById('guestName');
        guestEl.textContent = guestName;
        guestEl.classList.add('show');

        document.title = 'Thiệp Mời Tốt Nghiệp - ' + guestName;
    }

    // =====================
    // Init
    // =====================
    try { initGuestName(); } catch (e) { console.error('initGuestName error:', e); }
    try { startCountdown(); } catch (e) { console.error('startCountdown error:', e); }
    try { initParticles(); } catch (e) { console.error('initParticles error:', e); }

})();
