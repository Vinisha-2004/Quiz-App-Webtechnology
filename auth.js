const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const page = document.body.dataset.page || "";
const form = document.querySelector("[data-auth-form]");
const card = document.getElementById("authCard");
const statusNode = document.getElementById("authStatus");
const toggles = document.querySelectorAll("[data-toggle-password]");
const socialButtons = document.querySelectorAll("[data-social]");
const emailField = document.getElementById("logemail") || document.getElementById("email");
const passwordField = document.getElementById("logpass") || document.getElementById("pass");
const rememberField = document.getElementById("rememberMe");

const eyeOpen = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5c5.5 0 9.7 4 11 7-1.3 3-5.5 7-11 7S2.3 15 1 12c1.3-3 5.5-7 11-7Zm0 2C7.7 7 4.1 9.8 2.6 12 4.1 14.2 7.7 17 12 17s7.9-2.8 9.4-5C19.9 9.8 16.3 7 12 7Zm0 2.25A2.75 2.75 0 1 1 12 14.5a2.75 2.75 0 0 1 0-5.25Z"></path>
  </svg>`;

const eyeClosed = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.6 5.6 18.4 20.4l-1.4 1.4-2.2-2.2A11.5 11.5 0 0 1 12 20c-5.5 0-9.7-4-11-8 1.1-2.8 4.2-6 8.5-7.4L1.7 3.4l1.4-1.4 2.9 2.9A19.3 19.3 0 0 1 12 4c5.5 0 9.7 4 11 8-.8 2.1-2.4 4.3-5 5.9l-2.2-2.2c1.8-1 3.2-2.5 4.2-3.7C18.9 9.8 15.2 7 12 7c-.7 0-1.5.1-2.2.3l-1.5-1.5c1.1-.3 2.4-.5 3.7-.5 4.4 0 8 2.8 9.4 5-1.1 1.7-2.8 3.5-5 4.9l-2-2c.8-.5 1.4-1.1 1.9-1.8-.8-1.1-2.4-2.4-4.7-2.4-.5 0-1 .1-1.4.2l-1.4-1.4C10.4 7.5 11.2 7.4 12 7.4c3.8 0 6.9 2.1 8.2 4.5-1.4 1.7-4.1 4.6-8.2 4.6-.7 0-1.4-.1-2.1-.3l-1.5-1.5c1 .3 2 .4 3.1.4 1.6 0 3-.4 4.1-1.1L7.2 8.3a5.8 5.8 0 0 0-2.9 3.7C5.4 13.7 8.3 16 12 16c.5 0 1 0 1.4-.1l-1.8-1.8a2.8 2.8 0 0 1-1.6.5A2.75 2.75 0 1 1 12 10.7L8.4 7.1A9.6 9.6 0 0 0 3.6 5.6Z"></path>
  </svg>`;

let toastTimer = 0;

const setStatus = (message, state = "info") => {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.dataset.state = state;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    if (statusNode.dataset.state === state) {
      statusNode.textContent = "";
      delete statusNode.dataset.state;
    }
  }, 4200);
};

const setReady = () => document.body.classList.add("is-ready");
window.requestAnimationFrame(setReady);

if (card) {
  const resetSpot = () => {
    card.style.setProperty("--tilt-x", "0px");
    card.style.setProperty("--tilt-y", "0px");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "22%");
  };

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (x - 0.5) * 14;
    const tiltY = (y - 0.5) * 10;
    card.style.setProperty("--tilt-x", `${tiltX}px`);
    card.style.setProperty("--tilt-y", `${tiltY}px`);
    card.style.setProperty("--mx", `${Math.max(0, Math.min(100, x * 100))}%`);
    card.style.setProperty("--my", `${Math.max(0, Math.min(100, y * 100))}%`);
  });

  card.addEventListener("pointerleave", resetSpot);
  window.addEventListener("blur", resetSpot);
}

toggles.forEach((button) => {
  button.innerHTML = eyeOpen;

  button.addEventListener("click", () => {
    if (!passwordField) return;

    const isHidden = passwordField.type === "password";
    passwordField.type = isHidden ? "text" : "password";
    button.setAttribute("aria-pressed", String(isHidden));
    button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    button.innerHTML = isHidden ? eyeClosed : eyeOpen;
  });
});

socialButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const provider = button.dataset.social === "google" ? "Google" : "GitHub";
    setStatus(`${provider} sign-in is styled here and ready for integration.`, "info");
  });
});

if (page === "login" && emailField && rememberField) {
  const rememberedEmail = localStorage.getItem("smartspark.rememberedEmail");
  if (rememberedEmail) {
    emailField.value = rememberedEmail;
    rememberField.checked = true;
  }
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (page === "login") {
      const email = document.getElementById("logemail")?.value.trim() || "";
      const password = document.getElementById("logpass")?.value || "";
      const storedEmail = localStorage.getItem("semail") || "";
      const storedPassword = localStorage.getItem("spass") || "";
      const remember = Boolean(rememberField?.checked);

      if (email && password && email === storedEmail && password === storedPassword) {
        if (remember) {
          localStorage.setItem("smartspark.rememberedEmail", email);
        } else {
          localStorage.removeItem("smartspark.rememberedEmail");
        }

        const selectedCategory = localStorage.getItem("smartspark.pendingCategory") || "general-knowledge";
        localStorage.setItem("smartspark.activeCategory", selectedCategory);
        setStatus("Welcome back. Redirecting to your quiz dashboard...", "success");
        window.setTimeout(() => {
          window.location.href = `./main.html?category=${encodeURIComponent(selectedCategory)}`;
        }, 850);
        return;
      }

      setStatus("Invalid email or password. Please try again.", "error");
      return;
    }

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("pass")?.value || "";

    if (!name || !email || password.length < 8) {
      setStatus("Please complete all fields and use at least 8 characters.", "error");
      return;
    }

    localStorage.setItem("sname", name);
    localStorage.setItem("semail", email);
    localStorage.setItem("spass", password);

    setStatus("Account created. Taking you to login...", "success");
    window.setTimeout(() => {
      window.location.href = "./login.html";
    }, 900);
  });
}

const canvas = document.getElementById("auth-canvas");

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let raf = 0;
  const particles = [];
  const pointer = { x: 0, y: 0, active: false };

  const rand = (min, max) => Math.random() * (max - min) + min;
  const count = () => (window.innerWidth < 720 ? 42 : 72);

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

  const build = () => {
    particles.length = 0;
    for (let i = 0; i < count(); i += 1) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.09, 0.09),
        r: rand(0.7, 2.1),
        tint: Math.random() > 0.54 ? "255,77,141" : "255,255,255",
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
        p.vx += (dx / dist) * influence * 0.0018;
        p.vy += (dy / dist) * influence * 0.0018;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.995;
      p.vy *= 0.995;

      if (p.x < -24) p.x = width + 24;
      if (p.x > width + 24) p.x = -24;
      if (p.y < -24) p.y = height + 24;
      if (p.y > height + 24) p.y = -24;
    }

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 77, 141, ${(1 - dist / 120) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.shadowColor = `rgba(${p.tint},0.55)`;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(${p.tint},0.82)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = window.requestAnimationFrame(draw);
  };

  const pointerMove = (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };

  resize();
  build();
  draw();

  window.addEventListener("resize", () => {
    resize();
    build();
  });

  window.addEventListener("pointermove", pointerMove, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  window.addEventListener("blur", () => {
    pointer.active = false;
  });
  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(raf);
  });
} else if (canvas) {
  canvas.style.display = "none";
}
