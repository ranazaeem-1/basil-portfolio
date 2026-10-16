/**
 * BASIL SHAHZAD — VIDEO & MOTION PORTFOLIO ENGINE
 * Pure JavaScript • Zero External Dependencies • 100% Touch & Mobile Compatible
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initMasterCinemaTheater();
  initReelCards();
  initMobileNav();
  initTheaterModal();
});

/* ==========================================================================
   1. MASTER HERO CINEMA THEATER
   ========================================================================== */
const heroVideosData = [
  {
    title: 'Talking-Head Viral Hook & Retention Cut',
    caption: 'Kinetic keyword subtitles, rotoscoped depth layering, pattern interrupt zooms & dynamic grading.',
    src: 'assets/videos/short-form-retention.mp4',
    poster: 'assets/posters/poster-short-form.jpg',
    tag: 'SHORT-FORM VIRAL • 60 FPS',
    stat: '88% RETENTION'
  },
  {
    title: 'Expressive Kinetic Typography & Motion',
    caption: 'Bold crimson/white vector character animation, custom bezier curves, and hard audio sync.',
    src: 'assets/videos/kinetic-typography.mp4',
    poster: 'assets/posters/poster-kinetic.jpg',
    tag: '2D CHARACTER • MOTION DESIGN',
    stat: '60 FPS MASTER'
  },
  {
    title: 'The Blitz & Pearl Harbor Documentary',
    caption: 'James Jani-grade 2.5D archival photo parallax, 3D camera projection, smoke & ember VFX.',
    src: 'assets/videos/cinematic-documentary.mp4',
    poster: 'assets/posters/poster-documentary.jpg',
    tag: 'HISTORICAL DOCUMENTARY',
    stat: '4K PRORES MASTER'
  }
];

let activeHeroIndex = 0;

function initMasterCinemaTheater() {
  const video = document.getElementById('master-video');
  const screenWrapper = document.getElementById('master-screen');
  const bigPlayBtn = document.getElementById('master-big-play');
  const playBtn = document.getElementById('master-play-btn');
  const audioBtn = document.getElementById('master-audio-btn');
  const hudAudioBtn = document.getElementById('master-hud-audio');
  const fullBtn = document.getElementById('master-full-btn');
  const scrubTrack = document.getElementById('master-scrub-track');
  const scrubProgress = document.getElementById('master-scrub-progress');
  const timeCounter = document.getElementById('master-time');
  const hudTitle = document.getElementById('master-hud-title');
  const hudCaption = document.getElementById('master-hud-caption');
  const hudPill = document.getElementById('master-hud-pill');
  const tabs = document.querySelectorAll('.tab-btn');

  if (!video || !screenWrapper) return;

  function loadHeroVideo(index, autoPlay = false) {
    activeHeroIndex = index;
    const data = heroVideosData[index];

    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    video.src = data.src;
    video.poster = data.poster;
    hudTitle.textContent = data.title;
    hudCaption.textContent = data.caption;
    hudPill.textContent = data.tag;

    // Reset progress
    scrubProgress.style.width = '0%';
    timeCounter.textContent = '00:00 / 00:00';

    if (autoPlay) {
      pauseAllVideos(video);
      video.play().then(() => {
        screenWrapper.classList.add('playing');
        playBtn.textContent = '⏸';
      }).catch(() => {
        // Fallback to muted if browser blocks audio autoplay
        video.muted = true;
        updateAudioIcons(true);
        video.play().catch(() => {});
      });
    } else {
      video.pause();
      screenWrapper.classList.remove('playing');
      playBtn.textContent = '▶';
    }
  }

  // Tab click handlers
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      loadHeroVideo(index, true);
    });
  });

  // Play / Pause Toggle
  function togglePlay() {
    if (video.paused) {
      pauseAllVideos(video);
      video.play().then(() => {
        screenWrapper.classList.add('playing');
        playBtn.textContent = '⏸';
      }).catch(err => console.log('Playback error:', err));
    } else {
      video.pause();
      screenWrapper.classList.remove('playing');
      playBtn.textContent = '▶';
    }
  }

  screenWrapper.addEventListener('click', (e) => {
    // Avoid double trigger if clicking controls
    if (e.target.closest('.hud-audio-btn') || e.target.closest('.theater-controls-bar')) return;
    togglePlay();
  });

  if (bigPlayBtn) {
    bigPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  // Audio Toggle
  function updateAudioIcons(isMuted) {
    const icon = isMuted ? '🔇' : '🔊';
    if (audioBtn) audioBtn.textContent = icon;
    if (hudAudioBtn) hudAudioBtn.textContent = icon;
  }

  function toggleAudio(e) {
    if (e) e.stopPropagation();
    video.muted = !video.muted;
    updateAudioIcons(video.muted);
    // If user interacts with sound, ensure playback continues
    if (!video.muted && video.paused) {
      video.play().then(() => {
        screenWrapper.classList.add('playing');
        playBtn.textContent = '⏸';
      }).catch(() => {});
    }
  }

  if (audioBtn) audioBtn.addEventListener('click', toggleAudio);
  if (hudAudioBtn) hudAudioBtn.addEventListener('click', toggleAudio);

  // Time & Progress Update
  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      scrubProgress.style.width = `${pct}%`;
      timeCounter.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  });

  video.addEventListener('ended', () => {
    screenWrapper.classList.remove('playing');
    playBtn.textContent = '▶';
  });

  // Scrubbing on click
  if (scrubTrack) {
    scrubTrack.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = scrubTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (video.duration) {
        video.currentTime = pos * video.duration;
      }
    });
  }

  // Fullscreen Toggle
  if (fullBtn) {
    fullBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari
      }
    });
  }
}

/* ==========================================================================
   2. REEL SHOWCASE CARDS (PHONE MOCKUP PLAYERS)
   ========================================================================== */
function initReelCards() {
  const cards = document.querySelectorAll('.phone-mockup-card');

  cards.forEach(card => {
    const screen = card.querySelector('.phone-screen');
    const video = card.querySelector('.reel-video');
    const playTrigger = card.querySelector('.reel-play-trigger');
    const soundToggle = card.querySelector('.reel-sound-toggle');

    if (!screen || !video) return;

    function toggleReelPlay(e) {
      if (e) e.stopPropagation();
      if (video.paused) {
        pauseAllVideos(video);
        video.play().then(() => {
          screen.classList.add('playing');
        }).catch(err => {
          // If unmuted playback fails, fallback to muted
          video.muted = true;
          if (soundToggle) soundToggle.textContent = '🔇';
          video.play().then(() => screen.classList.add('playing')).catch(() => {});
        });
      } else {
        video.pause();
        screen.classList.remove('playing');
      }
    }

    screen.addEventListener('click', (e) => {
      if (e.target.closest('.reel-sound-toggle')) return;
      toggleReelPlay(e);
    });

    if (playTrigger) {
      playTrigger.addEventListener('click', toggleReelPlay);
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        soundToggle.textContent = video.muted ? '🔇' : '🔊';
        if (!video.muted && video.paused) {
          pauseAllVideos(video);
          video.play().then(() => screen.classList.add('playing')).catch(() => {});
        }
      });
    }

    video.addEventListener('ended', () => {
      screen.classList.remove('playing');
    });
  });
}

/* Pause all other videos when one plays */
function pauseAllVideos(currentVideo) {
  document.querySelectorAll('video').forEach(v => {
    if (v !== currentVideo && !v.paused) {
      v.pause();
      const parentScreen = v.closest('.screen-wrapper, .phone-screen');
      if (parentScreen) parentScreen.classList.remove('playing');
      const masterPlayBtn = document.getElementById('master-play-btn');
      if (masterPlayBtn && v.id === 'master-video') masterPlayBtn.textContent = '▶';
    }
  });
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* ==========================================================================
   3. CINEMA THEATER MODAL (EXPANDED INSPECT VIEW)
   ========================================================================== */
function initTheaterModal() {
  const modal = document.getElementById('theater-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalVideo = document.getElementById('modal-video');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('open');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

window.openModalTheater = function(src, title, desc) {
  const modal = document.getElementById('theater-modal');
  const modalVideo = document.getElementById('modal-video');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  if (!modal || !modalVideo) return;

  pauseAllVideos(null);
  modalVideo.src = src;
  modalVideo.muted = false;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;

  modal.classList.add('open');
  modalVideo.play().catch(() => {
    modalVideo.muted = true;
    modalVideo.play().catch(() => {});
  });
};

/* ==========================================================================
   4. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-drawer');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });

  // Header scroll appearance
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  });
}

/* ==========================================================================
   5. CONTACT FORM HANDLER
   ========================================================================== */
window.handleContactSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value;
  const type = document.getElementById('c-type').value;
  const msg = document.getElementById('c-msg').value;
  const status = document.getElementById('form-feedback');

  const subject = encodeURIComponent(`Video Editing Inquiry [${type}] from ${name}`);
  const body = encodeURIComponent(`Hi Basil,\n\nName / Channel: ${name}\nProject Type: ${type}\n\nProject Scope & Brief:\n${msg}\n\nLooking forward to your reply!`);

  if (status) {
    status.textContent = 'Opening your email client...';
    status.style.color = '#10b981';
  }

  setTimeout(() => {
    window.location.href = `mailto:zaeemrana168@gmail.com?subject=${subject}&body=${body}`;
  }, 400);
};

/* ==========================================================================
   6. AMBIENT BACKGROUND CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 20 : 45;

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
      this.speedY = -(Math.random() * 0.35 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#ff1e56' : '#00f0ff';
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
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
}
