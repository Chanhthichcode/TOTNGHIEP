// === Graduation Invitation - Script ===

(function () {
    'use strict';

    // --- Config ---
    const TARGET_DATE = new Date('2026-05-23T15:00:00+07:00');
    const MUSIC_SRC = 'assets/audio/graduation.mp3';
    const CONFETTI_COLORS = ['#6C63FF', '#00D2FF', '#FFD700', '#FF6B9D', '#FFFFFF'];

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
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        var now = new Date().getTime();
        var target = TARGET_DATE.getTime();
        var diff = target - now;

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
                    particleCount: 150,
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
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: CONFETTI_COLORS
                    });
                    confetti({
                        particleCount: 5,
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
                        particleCount: 120,
                        spread: 360,
                        origin: { y: 0.5 },
                        colors: CONFETTI_COLORS
                    });
                } else if (pattern === 'sides') {
                    confetti({
                        particleCount: 80,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: CONFETTI_COLORS
                    });
                    confetti({
                        particleCount: 80,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: CONFETTI_COLORS
                    });
                } else {
                    // Star pattern - shoot upward
                    confetti({
                        particleCount: 100,
                        spread: 120,
                        startVelocity: 45,
                        origin: { y: 0.9 },
                        colors: CONFETTI_COLORS
                    });
                }
                break;
        }
    }

    fireworkBtn.addEventListener('click', function () {
        fireConfetti('random');
    });

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
        var particleCount = window.innerWidth < 768 ? 40 : 80;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        // Create particles
        var colors = ['rgba(108, 99, 255, 0.6)', 'rgba(0, 210, 255, 0.5)', 'rgba(255, 255, 255, 0.4)'];

        for (var i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedY: -(Math.random() * 0.4 + 0.1),
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // =====================
    // Init
    // =====================
    startCountdown();
    initParticles();

})();
