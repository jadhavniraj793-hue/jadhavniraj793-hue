/* ============================================================================
   PORTFOLIO INTERACTIONS & RENDERING
   - Renders project cards + case-study modals from js/data.js
   - GitHub link logic:
       githubUrl set  -> "View on GitHub →" (links to the repository)
       githubUrl null -> "GitHub Repository — Coming Soon" (no invented links)
   - Mobile navigation, scrollspy, reveal-on-scroll, modal behaviour
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Icons (inline SVG strings used by JS-rendered content)              */
  /* ------------------------------------------------------------------ */

  var ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    arrowRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    arrowUpRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m20 6-11 11-5-5"/></svg>',
  };

  var STATUS_META = {
    "in-progress": { label: "In Progress", className: "status--progress" },
    planned: { label: "Planned", className: "status--planned" },
    learning: { label: "Learning &amp; Building", className: "status--learning" },
  };

  /* ------------------------------------------------------------------ */
  /* GitHub link rendering                                               */
  /* ------------------------------------------------------------------ */

  /**
   * Renders the GitHub affordance for a project.
   * - Repository exists  -> "View on GitHub →"
   * - No repository yet  -> "GitHub Repository — Coming Soon"
   */
  function githubLink(project) {
    if (project.githubUrl) {
      return (
        '<a class="project-gh" href="' + project.githubUrl + '" target="_blank" rel="noopener noreferrer">' +
        ICONS.github +
        "<span>View on GitHub</span>" +
        ICONS.arrowRight +
        "</a>"
      );
    }
    return (
      '<span class="project-gh project-gh--soon" title="The repository will be linked here once it is published.">' +
      ICONS.clock +
      "<span>GitHub Repository — Coming Soon</span>" +
      "</span>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Project cards                                                       */
  /* ------------------------------------------------------------------ */

  function renderProjects() {
    var grid = document.getElementById("projects-grid");
    if (!grid || typeof PROJECTS === "undefined") return;

    var cards = PROJECTS.map(function (project, index) {
      var status = STATUS_META[project.status] || STATUS_META.planned;
      var number = String(index + 1).padStart(2, "0");
      return (
        '<article class="project-card reveal" style="--reveal-delay:' + (index % 3) * 90 + 'ms">' +
        '<div class="project-top">' +
        '<span class="status ' + status.className + '">' + status.label + "</span>" +
        '<span class="project-number" aria-hidden="true">' + number + "</span>" +
        "</div>" +
        '<h3 class="project-title">' + project.title + "</h3>" +
        '<p class="project-summary">' + project.summary + "</p>" +
        '<ul class="project-tags" aria-label="Technologies used">' +
        project.tags
          .map(function (tag) {
            return "<li>" + tag + "</li>";
          })
          .join("") +
        "</ul>" +
        '<div class="project-links">' +
        '<button type="button" class="case-btn" data-case="' + project.id + '">' +
        "<span>Case Study</span>" + ICONS.arrowRight +
        "</button>" +
        githubLink(project) +
        "</div>" +
        "</article>"
      );
    });

    grid.innerHTML = cards.join("");

    // Attach case-study handlers
    grid.querySelectorAll(".case-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var project = PROJECTS.find(function (p) {
          return p.id === btn.getAttribute("data-case");
        });
        if (project) openCaseStudy(project, btn);
      });
    });

    observeReveal(grid.querySelectorAll(".reveal"));
  }

  /* ------------------------------------------------------------------ */
  /* Case-study modal                                                    */
  /* ------------------------------------------------------------------ */

  var modal = document.getElementById("case-modal");
  var modalBody = document.getElementById("case-body");
  var lastFocused = null;

  function openCaseStudy(project, trigger) {
    if (!modal || !modalBody) return;
    lastFocused = trigger || document.activeElement;

    var status = STATUS_META[project.status] || STATUS_META.planned;
    var objectives = project.caseStudy.objectives
      .map(function (item) {
        return "<li>" + ICONS.check + "<span>" + item + "</span></li>";
      })
      .join("");
    var tools = project.caseStudy.tools
      .map(function (tool) {
        return "<li>" + tool + "</li>";
      })
      .join("");

    modalBody.innerHTML =
      '<p class="case-eyebrow">Project Case Study</p>' +
      '<div class="case-head">' +
      '<span class="status ' + status.className + '">' + status.label + "</span>" +
      '<span class="case-id">' + project.title + "</span>" +
      "</div>" +
      '<h3 class="case-title" id="case-title">' + project.title + "</h3>" +
      '<div class="case-section">' +
      '<h4>Overview</h4>' +
      '<p class="case-overview">' + project.caseStudy.overview + "</p>" +
      "</div>" +
      '<div class="case-section">' +
      "<h4>Objectives</h4>" +
      '<ul class="case-objectives">' + objectives + "</ul>" +
      "</div>" +
      '<div class="case-section">' +
      "<h4>Approach</h4>" +
      '<p class="case-approach">' + project.caseStudy.approach + "</p>" +
      "</div>" +
      '<div class="case-section">' +
      "<h4>Tools &amp; Skills</h4>" +
      '<ul class="project-tags case-tools">' + tools + "</ul>" +
      "</div>" +
      '<div class="case-actions">' +
      githubLink(project) +
      '<a class="case-profile-link" href="' + GITHUB_PROFILE_URL + '" target="_blank" rel="noopener noreferrer">' +
      "See all activity on GitHub" + ICONS.arrowUpRight +
      "</a>" +
      "</div>";

    modal.hidden = false;
    document.body.classList.add("modal-open");
    // Allow the panel to fade in
    requestAnimationFrame(function () {
      modal.classList.add("is-open");
    });
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    // Wait for the fade-out before hiding
    window.setTimeout(function () {
      modal.hidden = true;
    }, 180);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function initModal() {
    if (!modal) return;

    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (!modal.hidden) closeModal();
        closeNavMenu();
      }

      // Simple focus trap while the modal is open
      if (event.key === "Tab" && !modal.hidden) {
        var focusables = modal.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation (mobile menu, scroll state, scrollspy)                   */
  /* ------------------------------------------------------------------ */

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");

  function closeNavMenu() {
    if (!header || !navToggle) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function initNav() {
    if (!header || !navToggle) return;

    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu when a link inside it is used
    document.querySelectorAll(".nav-menu a").forEach(function (link) {
      link.addEventListener("click", closeNavMenu);
    });

    // Elevated header once the page is scrolled
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initScrollSpy() {
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!links.length) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = link;
    });

    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("active");
            });
            if (map[entry.target.id]) map[entry.target.id].classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Reveal-on-scroll                                                    */
  /* ------------------------------------------------------------------ */

  function observeReveal(elements) {
    if (!elements || !elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Misc                                                                */
  /* ------------------------------------------------------------------ */

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
    initNav();
    initScrollSpy();
    initModal();
    initYear();
    observeReveal(document.querySelectorAll(".reveal"));
  });
})();
