const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.getElementById("siteHeader");
const hero = document.querySelector(".hero");
const revealEls = document.querySelectorAll(".reveal");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterNote = document.getElementById("newsletterNote");
const categoryLinks = document.querySelectorAll("[data-category-link]");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

revealEls.forEach((el) => observer.observe(el));

if (hero) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 20;
    hero.style.setProperty("--parallax-x", `${x}px`);
    hero.style.setProperty("--parallax-y", `${y}px`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--parallax-x", "0px");
    hero.style.setProperty("--parallax-y", "0px");
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email) return;

    newsletterNote.textContent = "You're in. Expect spark-worthy updates soon.";
    newsletterForm.reset();
    window.clearTimeout(newsletterForm._noteTimer);
    newsletterForm._noteTimer = window.setTimeout(() => {
      newsletterNote.textContent = "";
    }, 4200);
  });
}

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const category = link.dataset.category || "general-knowledge";
    localStorage.setItem("smartspark.pendingCategory", category);
  });
});

const canvas = document.getElementById("particle-canvas");

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let rafId = 0;
  const particles = [];
  const pointer = { x: width * 0.5, y: height * 0.3, active: false };
  const getParticleCount = () => (window.innerWidth < 768 ? 52 : 86);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  const buildParticles = () => {
    particles.length = 0;
    for (let i = 0; i < getParticleCount(); i += 1) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.08, 0.08),
        r: rand(0.7, 2.2),
        hue: Math.random() > 0.5 ? 325 : 265,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const influence = Math.max(0, 1 - dist / 260);
        p.vx += (dx / dist) * influence * 0.002;
        p.vy += (dy / dist) * influence * 0.002;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.995;
      p.vy *= 0.995;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 125) {
          const alpha = (1 - dist / 125) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      const glow = p.hue === 325 ? "255,77,148" : "139,92,246";
      ctx.beginPath();
      ctx.fillStyle = `rgba(${glow},0.82)`;
      ctx.shadowColor = `rgba(${glow},0.55)`;
      ctx.shadowBlur = 14;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(draw);
  };

  window.addEventListener("resize", () => {
    resize();
    buildParticles();
  });

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });

  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("blur", () => {
    pointer.active = false;
  });

  resize();
  buildParticles();
  draw();

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(rafId);
  });
} else if (canvas) {
  canvas.style.display = "none";
}
