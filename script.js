/* ============================================================
   NIRAJ LAXMAN JADHAV — 3D PORTFOLIO
   Scene: "Data Nebula" — animated 3D bar-chart city, particle
   field, floating wireframe polyhedra, neon grid floor.
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     1. THREE.JS SCENE
     ========================================================== */
  const canvas = document.getElementById("bg3d");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.028);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 6.5, 17);

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0x334466, 0.9));

  const cyanLight = new THREE.PointLight(0x00f0ff, 1.6, 60);
  cyanLight.position.set(-14, 12, 6);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0xa855f7, 1.6, 60);
  violetLight.position.set(14, 12, -4);
  scene.add(violetLight);

  const pinkLight = new THREE.PointLight(0xff2e88, 0.9, 50);
  pinkLight.position.set(0, 6, 12);
  scene.add(pinkLight);

  /* ---------- 3D bar-chart "data city" ---------- */
  const dataCity = new THREE.Group();
  scene.add(dataCity);

  const COLS = 15, ROWS = 9, GAP = 1.45;
  const barGeo = new THREE.BoxGeometry(0.62, 1, 0.62);
  barGeo.translate(0, 0.5, 0); // grow upward
  const bars = [];

  const cyan = new THREE.Color(0x00f0ff);
  const violet = new THREE.Color(0xa855f7);
  const pink = new THREE.Color(0xff2e88);

  for (let ix = 0; ix < COLS; ix++) {
    for (let iz = 0; iz < ROWS; iz++) {
      const t = ix / (COLS - 1);
      const color = cyan.clone().lerp(violet, t);
      if ((ix + iz) % 7 === 0) color.lerp(pink, 0.55);

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.88,
        metalness: 0.35,
        roughness: 0.35,
      });

      const bar = new THREE.Mesh(barGeo, mat);
      const x = (ix - (COLS - 1) / 2) * GAP;
      const z = (iz - (ROWS - 1) / 2) * GAP - 4;
      bar.position.set(x, 0, z);
      bar.scale.y = 0.4;
      bar.userData = {
        base: x * 0.06 + z * 0.04,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.9,
        amp: 0.9 + Math.random() * 2.1,
      };
      dataCity.add(bar);
      bars.push(bar);
    }
  }

  /* ---------- neon grid floor ---------- */
  const grid = new THREE.GridHelper(90, 60, 0x00f0ff, 0x1a2540);
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  grid.position.y = -0.02;
  scene.add(grid);

  /* ---------- particle starfield ---------- */
  const P_COUNT = 1600;
  const positions = new Float32Array(P_COUNT * 3);
  const colors = new Float32Array(P_COUNT * 3);
  const cCyan = new THREE.Color(0x9ef8ff);
  const cViolet = new THREE.Color(0xc9a2ff);
  const cWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < P_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = Math.random() * 46 - 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

    const roll = Math.random();
    const c = roll < 0.45 ? cCyan : roll < 0.8 ? cViolet : cWhite;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  scene.add(particles);

  /* ---------- floating wireframe polyhedra ---------- */
  const shapes = [];
  const shapeDefs = [
    { geo: new THREE.IcosahedronGeometry(1.6, 0), color: 0x00f0ff, pos: [-9, 7.5, -6], scale: 1 },
    { geo: new THREE.TorusKnotGeometry(1.1, 0.32, 90, 12), color: 0xa855f7, pos: [10, 8.5, -8], scale: 1 },
    { geo: new THREE.OctahedronGeometry(1.3, 0), color: 0xff2e88, pos: [6.5, 4.2, -2], scale: 0.8 },
    { geo: new THREE.DodecahedronGeometry(1.2, 0), color: 0x00f0ff, pos: [-7, 3.6, 1], scale: 0.7 },
  ];

  shapeDefs.forEach((def, idx) => {
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(def.geo),
      new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.6 })
    );
    edges.position.set(def.pos[0], def.pos[1], def.pos[2]);
    edges.scale.setScalar(def.scale);
    edges.userData = { phase: idx * 1.7, rotSpeed: 0.15 + idx * 0.08, floatAmp: 0.5 + idx * 0.15 };
    scene.add(edges);
    shapes.push(edges);
  });

  /* ---------- interaction state ---------- */
  let mouseX = 0, mouseY = 0;      // normalized -1..1
  let scrollY = 0;
  const clock = new THREE.Clock();
  let running = true;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) clock.getDelta(); // avoid time jump
  });

  /* ---------- animation loop ---------- */
  function animate() {
    requestAnimationFrame(animate);
    if (!running) return;

    const t = clock.getElapsedTime();

    // bars dance like a live data feed
    for (let i = 0; i < bars.length; i++) {
      const b = bars[i];
      const u = b.userData;
      const wave =
        Math.sin(t * u.speed + u.phase) * 0.5 +
        Math.sin(t * u.speed * 0.6 + u.base + u.phase * 0.5) * 0.5;
      const target = 0.6 + (wave * 0.5 + 0.5) * u.amp;
      b.scale.y += (target - b.scale.y) * 0.06;
    }

    dataCity.rotation.y = Math.sin(t * 0.08) * 0.12 + mouseX * 0.1 + scrollY * 0.00045;
    dataCity.position.y = -scrollY * 0.0035;

    // particles drift + gentle rise
    particles.rotation.y = t * 0.014 + mouseX * 0.03;
    particles.position.y = ((t * 0.12) % 8) - 4 - scrollY * 0.0012;

    // wireframe shapes float & spin
    shapes.forEach((s) => {
      const u = s.userData;
      s.rotation.x = t * u.rotSpeed;
      s.rotation.y = t * u.rotSpeed * 1.3;
      s.position.y = u.baseY !== undefined ? u.baseY : (u.baseY = s.position.y);
      s.position.y += Math.sin(t * 0.6 + u.phase) * 0.0035 * u.floatAmp;
      s.position.y -= scrollY * 0.0006;
    });

    // camera: mouse parallax + scroll dolly
    const targetCamX = mouseX * 1.6;
    const targetCamY = 6.5 - mouseY * 0.8 + scrollY * 0.0028;
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0, 3 - scrollY * 0.001, -2);

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    // render one static frame
    bars.forEach((b) => (b.scale.y = 0.6 + Math.random() * b.userData.amp));
    renderer.render(scene, camera);
  } else {
    animate();
  }

  /* ==========================================================
     2. PRELOADER
     ========================================================== */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("hide"), 500);
  });
  // safety net: hide anyway after 4s
  setTimeout(() => preloader.classList.add("hide"), 4000);

  /* ==========================================================
     3. TYPING EFFECT
     ========================================================== */
  const phrases = [
    "actionable insights.",
    "interactive dashboards.",
    "clear visual stories.",
    "data-driven decisions.",
    "clean, trusted datasets.",
  ];
  const typedEl = document.getElementById("typed");
  let pIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const word = phrases[pIdx];

    if (!deleting) {
      typedEl.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        return setTimeout(typeLoop, 1900); // pause at full word
      }
      setTimeout(typeLoop, 65);
    } else {
      typedEl.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        return setTimeout(typeLoop, 350);
      }
      setTimeout(typeLoop, 32);
    }
  }
  setTimeout(typeLoop, 1200);

  /* ==========================================================
     4. SCROLL REVEAL
     ========================================================== */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ==========================================================
     5. ANIMATED COUNTERS
     ========================================================== */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        const target = +el.dataset.target;
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

  /* ==========================================================
     6. 3D TILT CARDS
     ========================================================== */
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.style.transformStyle = "preserve-3d";

      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const MAX = 8;
        card.style.transform = `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.5s cubic-bezier(0.2,0.65,0.25,1)";
        card.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
        setTimeout(() => (card.style.transition = ""), 500);
      });
    });
  }

  /* ==========================================================
     7. NAVBAR — scroll state, scrollspy, mobile menu
     ========================================================== */
  const navbar = document.getElementById("navbar");
  const navLinksBox = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = [...document.querySelectorAll("section[id]")];

  // hamburger toggle
  hamburger.addEventListener("click", () => {
    const open = navLinksBox.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navLinksBox.classList.remove("open");
      hamburger.classList.remove("open");
      document.body.style.overflow = "";
    })
  );

  // scroll state + scrollspy
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);

    const pos = window.scrollY + 120;
    let current = sections[0]?.id;
    sections.forEach((sec) => {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === `#${current}`)
    );
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
