    /* ==========================================
       1. PAGE LOADER INITIALIZATION
       ========================================== */
    window.addEventListener('load', () => {
      let progress = 0;
      const loaderText = document.getElementById('loader-text');
      const loader = document.getElementById('page-loader');

      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            loader.classList.add('hidden');
            initTypingEffect();
          }, 300);
        }
        loaderText.innerText = `Loading Magic... ${progress}%`;
      }, 80);
    });

    /* ==========================================
       2. CANVAS ANIMATION ENGINE (BG & FX)
       ========================================== */
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    const fxCanvas = document.getElementById('fx-canvas');
    const fxCtx = fxCanvas.getContext('2d');

    let width, height;
    function resizeCanvas() {
      width = bgCanvas.width = fxCanvas.width = window.innerWidth;
      height = bgCanvas.height = fxCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Floating Background Elements
    const bgParticles = [];
    class BgParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 15 + 8;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.type = Math.random() > 0.4 ? 'heart' : 'petal';
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 1;
      }
      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.5;
        this.rotation += this.rotSpeed;
        if (this.y < -30) this.reset();
      }
      draw() {
        bgCtx.save();
        bgCtx.translate(this.x, this.y);
        bgCtx.rotate((this.rotation * Math.PI) / 180);
        bgCtx.globalAlpha = this.opacity;

        if (this.type === 'heart') {
          bgCtx.fillStyle = '#ff6b95';
          bgCtx.beginPath();
          bgCtx.moveTo(0, 0);
          bgCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
          bgCtx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
          bgCtx.fill();
        } else {
          bgCtx.fillStyle = '#ffd6e7';
          bgCtx.beginPath();
          bgCtx.ellipse(0, 0, this.size / 2, this.size, Math.PI / 4, 0, 2 * Math.PI);
          bgCtx.fill();
        }
        bgCtx.restore();
      }
    }

    for (let i = 0; i < 40; i++) bgParticles.push(new BgParticle());

    // Interactive Particle Bursts on Click
    const fxParticles = [];
    class FxParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.color = `hsl(${Math.random() * 40 + 330}, 100%, 75%)`;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.015;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
      }
      draw() {
        fxCtx.save();
        fxCtx.globalAlpha = Math.max(0, this.life);
        fxCtx.fillStyle = this.color;
        fxCtx.beginPath();
        fxCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fxCtx.fill();
        fxCtx.restore();
      }
    }

    function renderLoop() {
      bgCtx.clearRect(0, 0, width, height);
      fxCtx.clearRect(0, 0, width, height);

      bgParticles.forEach(p => { p.update(); p.draw(); });

      for (let i = fxParticles.length - 1; i >= 0; i--) {
        fxParticles[i].update();
        fxParticles[i].draw();
        if (fxParticles[i].life <= 0) fxParticles.splice(i, 1);
      }

      requestAnimationFrame(renderLoop);
    }
    renderLoop();

    window.addEventListener('click', (e) => {
      for (let i = 0; i < 15; i++) {
        fxParticles.push(new FxParticle(e.clientX, e.clientY));
      }
    });

    /* ==========================================
       3. CUSTOM CURSOR & TRAIL
       ========================================== */
    const cursor = document.getElementById('cursor');
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      if (Math.random() > 0.6) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 800);
      }
    });

    /* ==========================================
       4. HERO TYPING EFFECT
       ========================================== */
    const phrases = ["Welcome to Our Magic World", "Where Every Moment is Eternal", "I Love You Forever ♥"];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function initTypingEffect() {
      const target = document.getElementById('typing-text');
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        target.textContent = currentPhrase.substring(0, charIdx--);
      } else {
        target.textContent = currentPhrase.substring(0, charIdx++);
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentPhrase.length + 1) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(initTypingEffect, speed);
    }

    /* ==========================================
       5. SCROLL OBSERVER & PROGRESS STEM
       ========================================== */
    const stem = document.getElementById('scroll-stem');
    const meterFills = document.querySelectorAll('.meter-bar-fill');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      stem.style.height = `${scrollPercent}%`;
      if (scrollPercent >= 98) stem.classList.add('bloomed');
      else stem.classList.remove('bloomed');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Animate meters if inside
          if (entry.target.id === 'love-meter') {
            meterFills.forEach(fill => fill.style.width = fill.getAttribute('data-progress'));
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal, #love-meter').forEach(el => observer.observe(el));

    /* ==========================================
       6. INTERACTIVE ENVELOPE, GALLERY & BOOK
       ========================================== */
    // Envelope
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('open');
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('.polaroid-img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    // Book Flip
    const book = document.getElementById('book');
    book.addEventListener('click', () => {
      document.getElementById('page1').classList.toggle('flipped');
    });

    /* ==========================================
       7. AUDIO ENGINE (SYNTHESIZED AMBIENCE)
       ========================================== */
    let audioCtx, isPlaying = false, isRain = false;

    // Soft Romantic Melody Synthesizer via Web Audio API
    function playMelody() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const musicWidget = document.getElementById('music-widget');
      const playBtn = document.getElementById('play-btn');

      if (isPlaying) {
        audioCtx.suspend();
        isPlaying = false;
        musicWidget.classList.remove('playing');
        playBtn.innerText = '▶';
      } else {
        isPlaying = true;
        musicWidget.classList.add('playing');
        playBtn.innerText = '❚❚';
        triggerMelodyLoop();
      }
    }

    function triggerMelodyLoop() {
      if (!isPlaying) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 440.00]; // C, E, G, C5, A4
      const note = notes[Math.floor(Math.random() * notes.length)];

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.5);

      setTimeout(triggerMelodyLoop, 1200);
    }

    document.getElementById('play-btn').addEventListener('click', playMelody);

    // Theme Switcher (Day/Night)
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
      const isNight = document.body.getAttribute('data-theme') === 'night';
      if (isNight) {
        document.body.removeAttribute('data-theme');
        themeBtn.innerText = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'night');
        themeBtn.innerText = '☀️';
      }
    });

    // Easter Egg Trigger
    document.querySelector('.secret-heart').addEventListener('click', (e) => {
      e.stopPropagation();
      alert('♥ Easter Egg Unlocked: You are my whole universe! ♥');
    });

    // CTA Scroll
    document.getElementById('hero-cta').addEventListener('click', () => {
      document.getElementById('envelope-section').scrollIntoView({ behavior: 'smooth' });
    });
