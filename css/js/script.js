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

/* =====================================================
   MAR-WEL HERO VIDEO SLIDER
   AUTO PLAY + MANUAL NEXT / PREVIOUS
===================================================== */

const heroVideos = document.querySelectorAll(".hero-video");

const prevVideo = document.getElementById("prevVideo");
const nextVideo = document.getElementById("nextVideo");

let currentVideo = 0;


/* =====================================================
   SHOW VIDEO
===================================================== */

function showVideo(index) {

    /* Previous from first → last */

    if (index < 0) {
        index = heroVideos.length - 1;
    }


    /* Next from last → first */

    if (index >= heroVideos.length) {
        index = 0;
    }


    /* Stop all videos */

    heroVideos.forEach(function(video) {

        video.classList.remove("active");

        video.pause();

    });


    /* Current video */

    currentVideo = index;

    const video = heroVideos[currentVideo];


    /* Show video */

    video.classList.add("active");


    /* Start from beginning */

    video.currentTime = 0;

    video.muted = true;


    /* Play video */

    video.play().catch(function(error) {

        console.log("Autoplay blocked:", error);

    });

}


/* =====================================================
   AUTOMATICALLY GO TO NEXT VIDEO
===================================================== */

heroVideos.forEach(function(video, index) {

    video.addEventListener("ended", function() {

        /*
         * Only change if this is
         * the currently displayed video
         */

        if (index === currentVideo) {

            showVideo(currentVideo + 1);

        }

    });

});


/* =====================================================
   NEXT BUTTON
===================================================== */

nextVideo.addEventListener("click", function() {

    showVideo(currentVideo + 1);

});


/* =====================================================
   PREVIOUS BUTTON
===================================================== */

prevVideo.addEventListener("click", function() {

    showVideo(currentVideo - 1);

});


/* =====================================================
   START FIRST VIDEO
===================================================== */

showVideo(0);
