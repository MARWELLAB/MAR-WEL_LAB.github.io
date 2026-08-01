// ═══════════════════════════════════════════
//   MAR-WEL LAB — script.js
// ═══════════════════════════════════════════

// ---- 1. Active nav link ----
(function () {
  const p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === p) a.classList.add('active');
  });
})();

// ---- 2. Hamburger menu (mobile) ----
const h = document.querySelector('.hamburger');
const n = document.querySelector('.nav-links');
if (h) {
  h.addEventListener('click', () => {
    n.classList.toggle('open');
  });
}

// ---- 3. Scroll reveal animation ----
document.querySelectorAll(
  '.card, .team-card, .pub-item, .project-card, .research-area'
).forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }
  }, { threshold: 0.1 }).observe(el);
});

// ---- 4. Stats counter animation ----
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + (el.dataset.suffix || '');
    }, 40);
  });
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const so = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      so.disconnect();
    }
  }, { threshold: 0.3 });
  so.observe(statsBar);
}

// ---- 5. Contact Form → Formspree (sends real email) ----
const f = document.getElementById('contactForm');
if (f) {
  f.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = f.querySelector('.btn');

    // Show sending state
    btn.textContent       = 'Sending…';
    btn.disabled          = true;
    btn.style.background  = '#6b7c93';

    try {
      const response = await fetch(f.action, {
        method  : 'POST',
        body    : new FormData(f),
        headers : { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // ✅ SUCCESS — email sent to Gmail
        btn.textContent      = '✓ Message Sent!';
        btn.style.background = '#27ae60';
        f.reset();

      } else {
        // ❌ Server error
        btn.textContent      = '✗ Failed! Try again';
        btn.style.background = '#e74c3c';
        btn.disabled         = false;
      }

    } catch (error) {
      // ❌ No internet / network error
      btn.textContent      = '✗ No Internet!';
      btn.style.background = '#e74c3c';
      btn.disabled         = false;
    }

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.textContent      = 'Send Message';
      btn.style.background = '';
      btn.disabled         = false;
    }, 3000);

  });
}

/* =========================================================
   MAR-WEL LAB
   4 VIDEO HERO SLIDER
   AUTO PLAY + MANUAL NEXT/PREVIOUS
========================================================= */
document.addEventListener("DOMContentLoaded", function () {

    const videos = document.querySelectorAll(".hero-video");
    const prevButton = document.getElementById("prevVideo");
    const nextButton = document.getElementById("nextVideo");

    let currentVideo = 0;

    function showVideo(index) {

        // Stop and hide all videos
        videos.forEach(function (video) {
            video.pause();
            video.classList.remove("active");
        });

        // Go to previous video
        if (index < 0) {
            currentVideo = videos.length - 1;
        }

        // Go to first video after last
        else if (index >= videos.length) {
            currentVideo = 0;
        }

        else {
            currentVideo = index;
        }

        // Select video
        const video = videos[currentVideo];

        // Show video
        video.classList.add("active");

        // Start from beginning
        video.currentTime = 0;

        // Play
        video.play().catch(function (error) {
            console.log("Video play error:", error);
        });
    }

    // Next button
    nextButton.addEventListener("click", function () {
        showVideo(currentVideo + 1);
    });

    // Previous button
    prevButton.addEventListener("click", function () {
        showVideo(currentVideo - 1);
    });

    // Start with Breakwater
    showVideo(0);

});
