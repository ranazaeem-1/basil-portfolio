/**
 * Basil Shahzad — Portfolio Interactive Engine
 * Cinema Dark Luxury Aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTicker();
  initNavScroll();
  initVideoCards();
  initAudioSynthesis();
  initTheaterModal();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND CANVAS (Cinematic Particles / Floating Embers)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#ff2a5f' : (Math.random() > 0.5 ? '#00f0ff' : '#ffb703');
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. DYNAMIC TICKER ROTATION
   ========================================================================== */
function initTicker() {
  const ticker = document.getElementById('ticker-text');
  if (!ticker) return;

  const phrases = [
    'Viral Hook Psychology & Retention Cuts',
    'James Jani-Grade Documentary Storytelling',
    'Kinetic Typography & 2D Vector Animation',
    'Blender 3D GIS & Terrain Bathymetry',
    'Remotion & React Programmatic Data Motion',
    'Automated CapCut Pipelines via Python'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      ticker.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      ticker.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 1800; // pause at peak
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

/* ==========================================================================
   3. NAVIGATION SCROLL & ACTIVE TRACKING
   ========================================================================== */
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. SYNTHESIZED WEB AUDIO EFFECTS
   ========================================================================== */
let audioCtx = null;
let sfxEnabled = true;

function initAudioSynthesis() {
  const toggle = document.getElementById('sfx-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      toggle.querySelector('.sound-icon').textContent = sfxEnabled ? '🔊' : '🔇';
      toggle.querySelector('.sound-text').textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      toggle.style.borderColor = sfxEnabled ? 'rgba(255, 42, 95, 0.4)' : 'rgba(255, 255, 255, 0.1)';
      if (sfxEnabled) playBeep(650, 0.05);
    });
  }

  document.querySelectorAll('.btn, .tool-chip, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (sfxEnabled) playHoverSound();
    });
    el.addEventListener('click', () => {
      if (sfxEnabled) playClickSound();
    });
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playHoverSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.015, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(580, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

function playBeep(freq, dur) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

/* ==========================================================================
   5. VIDEO CARDS & HOVER PREVIEW CONTROLS
   ========================================================================== */
function initVideoCards() {
  const cards = document.querySelectorAll('.video-showcase-card');

  cards.forEach(card => {
    const wrapper = card.querySelector('.video-wrapper');
    const video = card.querySelector('.portfolio-video');
    const progressFill = card.querySelector('.progress-fill');

    if (!wrapper || !video) return;

    // Hover play / pause
    wrapper.addEventListener('mouseenter', () => {
      wrapper.classList.add('is-playing');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.classList.remove('is-playing');
      video.pause();
    });

    // Update progress bar
    video.addEventListener('timeupdate', () => {
      if (progressFill && video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${pct}%`;
      }
    });
  });

  // IntersectionObserver to pause videos when scrolled out
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const v = entry.target;
      if (!entry.isIntersecting && !v.paused) {
        v.pause();
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('video').forEach(v => observer.observe(v));
}

// Global audio toggle for hero video
function toggleHeroSound(btn) {
  const heroVideo = document.getElementById('hero-preview-video');
  if (!heroVideo) return;
  heroVideo.muted = !heroVideo.muted;
  btn.querySelector('.icon').textContent = heroVideo.muted ? '🔇' : '🔊';
  btn.style.background = heroVideo.muted ? 'rgba(0,0,0,0.7)' : '#ff2a5f';
}

// Card level audio toggle
function toggleCardAudio(btn, event) {
  if (event) event.stopPropagation();
  const card = btn.closest('.video-showcase-card');
  const video = card.querySelector('.portfolio-video');
  if (!video) return;

  video.muted = !video.muted;
  btn.textContent = video.muted ? '🔇' : '🔊';
  btn.style.background = video.muted ? 'rgba(0,0,0,0.6)' : '#ff2a5f';

  if (!video.muted) {
    video.play();
    card.querySelector('.video-wrapper').classList.add('is-playing');
  }
}

/* ==========================================================================
   6. CINEMA THEATER MODAL
   ========================================================================== */
function initTheaterModal() {
  const modal = document.getElementById('theater-modal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeTheater();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTheater();
    } else if (e.code === 'Space' && !modal.classList.contains('hidden')) {
      const vid = document.getElementById('theater-video');
      if (vid) {
        e.preventDefault();
        vid.paused ? vid.play() : vid.pause();
      }
    } else if (e.key.toLowerCase() === 'm' && !modal.classList.contains('hidden')) {
      const vid = document.getElementById('theater-video');
      if (vid) vid.muted = !vid.muted;
    }
  });
}

function openTheater(videoSrc, title, badge, notes) {
  const modal = document.getElementById('theater-modal');
  const vid = document.getElementById('theater-video');
  const titleEl = document.getElementById('theater-title');
  const badgeEl = document.getElementById('theater-badge');
  const notesEl = document.getElementById('theater-notes');

  if (!modal || !vid) return;

  vid.src = videoSrc;
  vid.muted = false;
  titleEl.textContent = title;
  badgeEl.textContent = badge;
  notesEl.textContent = notes;

  modal.classList.remove('hidden');
  vid.play().catch(() => {
    vid.muted = true;
    vid.play();
  });

  if (sfxEnabled) playClickSound();
}

function closeTheater() {
  const modal = document.getElementById('theater-modal');
  const vid = document.getElementById('theater-video');
  if (modal) modal.classList.add('hidden');
  if (vid) {
    vid.pause();
    vid.src = '';
  }
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('form-name').value;
  const type = document.getElementById('form-type').value;
  const msg = document.getElementById('form-message').value;
  const status = document.getElementById('form-status');

  status.classList.remove('hidden');
  status.textContent = 'Preparing email dispatch...';

  const subject = encodeURIComponent(`Video Inquiry: ${type} - from ${name}`);
  const body = encodeURIComponent(`Hi Basil,\n\nMy name: ${name}\nProject Type: ${type}\n\nProject Brief:\n${msg}\n\nLooking forward to hearing from you!`);

  setTimeout(() => {
    window.location.href = `mailto:zaeemrana168@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = '✓ Email client opened! Looking forward to collaborating.';
  }, 400);
}
