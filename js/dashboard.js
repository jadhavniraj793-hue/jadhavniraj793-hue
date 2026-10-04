(() => {
  "use strict";

  const chartData = {
    7: { labels: ["Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29", "Oct 30", "Oct 31"], current: [64, 70, 61, 75, 79, 86, 94], previous: [54, 57, 66, 58, 68, 72, 76], revenue: "$21,480", change: "↗ 9.8%" },
    30: { labels: ["Oct 01", "Oct 05", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 31"], current: [38, 51, 44, 66, 61, 78, 91], previous: [34, 39, 48, 43, 55, 61, 72], revenue: "$84,240", change: "↗ 12.5%" },
    90: { labels: ["Aug 01", "Aug 15", "Sep 01", "Sep 15", "Oct 01", "Oct 15", "Oct 31"], current: [25, 35, 43, 55, 61, 75, 91], previous: [23, 31, 37, 48, 51, 61, 72], revenue: "$214,830", change: "↗ 17.2%" }
  };

  const chartHost = document.getElementById("revenueChart");
  const tooltip = document.getElementById("chartTooltip");
  const chartRevenue = document.getElementById("chartRevenue");
  const chartChange = document.getElementById("chartChange");

  function points(values, width, height, margin) {
    const min = 0;
    const max = 100;
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    return values.map((value, index) => ({
      x: margin.left + (plotWidth / (values.length - 1)) * index,
      y: margin.top + plotHeight - ((value - min) / (max - min)) * plotHeight
    }));
  }

  function toPath(pointsArray) {
    return pointsArray.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  }

  function renderChart(range = 30) {
    if (!chartHost) return;
    const data = chartData[range];
    const w = 720, h = 205;
    const margin = { left: 4, right: 7, top: 15, bottom: 27 };
    const currentPoints = points(data.current, w, h, margin);
    const previousPoints = points(data.previous, w, h, margin);
    const currentPath = toPath(currentPoints);
    const previousPath = toPath(previousPoints);
    const baseline = h - margin.bottom;
    const areaPath = `${currentPath} L${currentPoints[currentPoints.length - 1].x.toFixed(1)},${baseline} L${currentPoints[0].x.toFixed(1)},${baseline} Z`;
    const gridYs = [15, 58, 101, 144, 178];
    const grid = gridYs.map(y => `<line class="grid-line" x1="${margin.left}" x2="${w - margin.right}" y1="${y}" y2="${y}"/>`).join("");
    const labels = data.labels.map((label, index) => `<text class="axis-label" text-anchor="${index === 0 ? "start" : index === data.labels.length - 1 ? "end" : "middle"}" x="${currentPoints[index].x}" y="${h - 5}">${label}</text>`).join("");
    const dots = currentPoints.map((point, index) => `<circle class="data-dot" data-index="${index}" cx="${point.x}" cy="${point.y}" r="3.6" tabindex="0" aria-label="${data.labels[index]}, index ${data.current[index]}"></circle>`).join("");

    chartHost.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Revenue trending upward over selected period"><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7156e8" stop-opacity=".20"/><stop offset="1" stop-color="#7156e8" stop-opacity="0"/></linearGradient></defs>${grid}<path class="revenue-area" d="${areaPath}"/><path class="previous-line" d="${previousPath}"/><path class="revenue-line" d="${currentPath}"/>${dots}${labels}</svg>`;

    chartRevenue.textContent = data.revenue;
    chartChange.textContent = data.change;

    chartHost.querySelectorAll(".data-dot").forEach((dot) => {
      const showTooltip = () => {
        const index = Number(dot.dataset.index);
        const point = currentPoints[index];
        tooltip.querySelector("span").textContent = data.labels[index];
        tooltip.querySelector("strong").textContent = `$${(data.current[index] * 42.37).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
        tooltip.style.display = "block";
        tooltip.style.left = `${Math.min(83, Math.max(2, (point.x / w) * 100))}%`;
        tooltip.style.top = `${Math.max(5, (point.y / h) * 100 - 4)}%`;
      };
      dot.addEventListener("mouseenter", showTooltip);
      dot.addEventListener("focus", showTooltip);
      dot.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });
      dot.addEventListener("blur", () => { tooltip.style.display = "none"; });
    });
  }

  renderChart();

  document.querySelectorAll(".range-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".range-tabs button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderChart(Number(button.dataset.range));
    });
  });

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuButton = document.getElementById("menuButton");
  const sidebarClose = document.getElementById("sidebarClose");
  const setMenu = (open) => {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (menuButton) menuButton.addEventListener("click", () => setMenu(true));
  if (sidebarClose) sidebarClose.addEventListener("click", () => setMenu(false));
  if (overlay) overlay.addEventListener("click", () => setMenu(false));
  document.querySelectorAll(".side-nav a").forEach((link) => link.addEventListener("click", () => {
    document.querySelectorAll(".side-nav a").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    setMenu(false);
  }));

  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(title, body) {
    if (!toast) return;
    toast.querySelector("strong").textContent = title;
    toast.querySelector("small").textContent = body;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  }
  document.getElementById("toastClose")?.addEventListener("click", () => toast.classList.remove("show"));
  document.getElementById("exportButton")?.addEventListener("click", () => showToast("Export queued", "Your October overview will download shortly."));
  document.getElementById("upgradeButton")?.addEventListener("click", () => showToast("Pro overview", "A plan comparison has been prepared for you."));
  document.getElementById("notificationButton")?.addEventListener("click", () => showToast("You’re all caught up", "No new notifications in your workspace."));
  document.getElementById("dateButton")?.addEventListener("click", () => showToast("Date range", "Showing data for October 1–31, 2026."));

  document.querySelectorAll(".more-button, .insight-arrow").forEach(button => {
    button.addEventListener("click", () => showToast("More options", "This interactive dashboard is ready for your data source."));
  });
})();
