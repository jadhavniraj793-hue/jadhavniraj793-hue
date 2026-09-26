/* ════════════════════════════════════════════════════════════════
   NIRAJ JADHAV — 3D PORTFOLIO · main.js
   Three.js starfield + wireframe shapes + scroll-flight camera,
   typing effect, 3D tilt cards, reveal-on-scroll, counters.
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     PRELOADER  → gates the entrance animations
     ────────────────────────────────────────────── */
  const preloader = document.getElementById("preloader");
  let booted = false;

  function boot() {
    if (booted) return;
    booted = true;
    if (preloader) preloader.classList.add("done");
    document.body.classList.add("loaded");
    initReveals();
    startTyping();
  }
  window.addEventListener("load", () => setTimeout(boot, 350));
  setTimeout(boot, 3200); // safety net if a CDN asset hangs

  /* ──────────────────────────────────────────────
     HERO NAME — letter-by-letter 3D flip-in
     ────────────────────────────────────────────── */
  (function heroName() {
    const el = document.getElementById("heroName");
    if (!el) return;
    const text = el.textContent.trim();
    el.textContent = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.setAttribute("aria-hidden", "true");
      s.innerHTML = ch === " " ? "&nbsp;" : ch;
      s.style.setProperty("--d", (0.2 + i * 0.05).toFixed(2) + "s");
      el.appendChild(s);
    });
  })();

  /* ──────────────────────────────────────────────
     TYPING EFFECT
     ────────────────────────────────────────────── */
  const typedEl = document.getElementById("typed");
  const phrases = [
    "Excel · SQL · Python",
    "Power BI · Tableau",
    "Pandas · NumPy · Seaborn",
    "turning data into decisions…"
  ];

  function startTyping() {
    if (!typedEl) return;
    let p = 0, c = 0, deleting = false;

    (function loop() {
      const phrase = phrases[p];
      typedEl.textContent = phrase.slice(0, c);

      if (!deleting && c < phrase.length) {
        c++;
        setTimeout(loop, 55);
      } else if (!deleting) {
        deleting = true;
        setTimeout(loop, 1700);
      } else if (c > 0) {
        c--;
        setTimeout(loop, 26);
      } else {
        deleting = false;
        p = (p + 1) % phrases.length;
        setTimeout(loop, 420);
      }
    })();
  }

  /* ──────────────────────────────────────────────
     NAVBAR — scrolled state, mobile menu, active link
     ────────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  function onScrollNav() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 640);
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      })
    );
  }

  // active link highlighting
  const sections = document.querySelectorAll("section[id]");
  const linkMap = new Map();
  document.querySelectorAll(".nav-link").forEach((l) => {
    linkMap.set(l.getAttribute("href").slice(1), l);
  });
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          linkMap.forEach((l) => l.classList.remove("active"));
          const link = linkMap.get(en.target.id);
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ──────────────────────────────────────────────
     REVEAL ON SCROLL — staggered 3D tilt-in
     ────────────────────────────────────────────── */
  function initReveals() {
    const els = document.querySelectorAll(".reveal");

    // stagger siblings inside the same parent
    els.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) =>
        c.classList.contains("reveal")
      );
      const i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
    });

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.classList.add("visible");
          obs.unobserve(el);
          // after the entrance, hand control back to hover/tilt transitions
          const delay = parseFloat(el.style.transitionDelay || 0) || 0;
          setTimeout(() => {
            el.classList.add("settled");
            el.style.transitionDelay = "";
          }, 1000 + delay);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));

    // counters fire with their stat cards
    const counters = document.querySelectorAll(".counter");
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          animateCounter(en.target);
          obs.unobserve(en.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || "0", 10);
    const dur = 1600;
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ──────────────────────────────────────────────
     3D TILT — perspective cards that follow the cursor
     ────────────────────────────────────────────── */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * 9).toFixed(2) +
          "deg) rotateY(" + (px * 11).toFixed(2) +
          "deg) translateY(-6px) scale(1.02)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ──────────────────────────────────────────────
     CURSOR GLOW
     ────────────────────────────────────────────── */
  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener("mousemove", (e) => {
      gx = e.clientX;
      gy = e.clientY;
      glow.classList.add("on");
    });
    (function glowLoop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + (cx - 210) + "px," + (cy - 210) + "px)";
      requestAnimationFrame(glowLoop);
    })();
  }

  /* ──────────────────────────────────────────────
     BACK TO TOP + FOOTER YEAR
     ────────────────────────────────────────────── */
  const toTop = document.getElementById("toTop");
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════════════
     THREE.JS — 3D BACKGROUND
     particle starfield + floating wireframe solids +
     neon grid floor; the camera flies forward as you scroll
     ══════════════════════════════════════════════ */
  function initThree() {
    const canvas = document.getElementById("bg3d");
    if (!canvas || typeof THREE === "undefined") return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050816);
    scene.fog = new THREE.Fog(0x050816, 25, 195);

    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 400);
    camera.position.set(0, 0, 4);

    const isSmall = window.innerWidth < 768;

    /* — soft round glow sprite for particles — */
    function makeSprite() {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    /* — particle starfield — */
    const N = isSmall ? 550 : 1100;
    const palette = [0x00e5ff, 0x8b5cf6, 0xec4899, 0xffffff, 0x34d399];
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = 25 - Math.random() * 285;

      tmpColor.set(palette[Math.floor(Math.random() * palette.length)]);
      tmpColor.multiplyScalar(0.55 + Math.random() * 0.45);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.55,
      map: makeSprite(),
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    const starfield = new THREE.Points(pGeo, pMat);
    scene.add(starfield);

    /* — floating wireframe solids — */
    const shapeGeos = [
      new THREE.IcosahedronGeometry(3, 0),
      new THREE.OctahedronGeometry(2.4, 0),
      new THREE.TorusKnotGeometry(1.6, 0.5, 90, 12),
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.TorusGeometry(2.4, 0.6, 10, 36),
      new THREE.DodecahedronGeometry(2.6, 0)
    ];
    const shapeCols = [0x00e5ff, 0x8b5cf6, 0xec4899, 0x34d399, 0xfbbf24];
    const shapes = [];
    const shapeCount = isSmall ? 9 : 16;

    for (let i = 0; i < shapeCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: shapeCols[i % shapeCols.length],
        wireframe: true,
        transparent: true,
        opacity: 0.26 + Math.random() * 0.24
      });
      const mesh = new THREE.Mesh(shapeGeos[i % shapeGeos.length], mat);
      mesh.position.set(
        (Math.random() - 0.5) * 72,
        (Math.random() - 0.5) * 40,
        -8 - Math.random() * 230
      );
      mesh.scale.setScalar(0.45 + Math.random() * 1.05);
      scene.add(mesh);
      shapes.push({
        mesh,
        rx: (Math.random() - 0.5) * 0.012,
        ry: (Math.random() - 0.5) * 0.015,
        rz: (Math.random() - 0.5) * 0.008,
        baseY: mesh.position.y,
        phase: Math.random() * Math.PI * 2,
        amp: 0.7 + Math.random() * 1.5
      });
    }

    /* — neon grid floor — */
    const grid = new THREE.GridHelper(600, 90, 0x00e5ff, 0x23235e);
    grid.material.transparent = true;
    grid.material.opacity = 0.16;
    grid.position.y = -22;
    scene.add(grid);

    /* — input: mouse parallax + scroll flight — */
    let tx = 0, ty = 0, mx = 0, my = 0, scrollP = 0;

    window.addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function onScroll3D() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollP = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
    }
    window.addEventListener("scroll", onScroll3D, { passive: true });
    onScroll3D();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* — render loop — */
    const clock = new THREE.Clock();
    (function tick() {
      requestAnimationFrame(tick);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;

      camera.position.z = 4 + scrollP * 96;
      camera.position.x = mx * 3.2;
      camera.position.y = -my * 2;
      camera.lookAt(camera.position.x * 0.35, camera.position.y * 0.35, camera.position.z - 42);

      starfield.rotation.y = t * 0.012;

      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        s.mesh.rotation.x += s.rx;
        s.mesh.rotation.y += s.ry;
        s.mesh.rotation.z += s.rz;
        s.mesh.position.y = s.baseY + Math.sin(t * 0.45 + s.phase) * s.amp;
      }

      renderer.render(scene, camera);
    })();
  }

  try {
    initThree();
  } catch (err) {
    // 3D is decorative — the page must work even if WebGL is unavailable
    console.warn("3D background disabled:", err);
  }
})();
