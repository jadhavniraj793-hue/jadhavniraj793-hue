/* ════════════════════════════════════════════════════════════
   SALES ANALYTICS DASHBOARD
   Pure vanilla JS + hand-drawn SVG charts (zero dependencies)
   ════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const SVG_NS = "http://www.w3.org/2000/svg";
  const COLORS = ["#00e5ff", "#8b5cf6", "#ec4899", "#34d399", "#fbbf24", "#60a5fa"];

  /* ── 1. Sample dataset (deterministic pseudo-random) ───────── */
  const CATEGORIES = ["Electronics", "Apparel", "Home & Living", "Grocery", "Beauty"];
  const REGIONS = ["North", "South", "East", "West"];
  const PRODUCTS = {
    Electronics: ["Noise Pro Earbuds", "4K Smart TV", "Gaming Laptop", "Smart Watch"],
    Apparel: ["Denim Jacket", "Running Shoes", "Cotton Tee Pack", "Winter Hoodie"],
    "Home & Living": ["Air Fryer", "Study Desk", "LED Floor Lamp", "Cookware Set"],
    Grocery: ["Organic Coffee", "Olive Oil 1L", "Protein Granola", "Dry Fruits Mix"],
    Beauty: ["Vitamin C Serum", "Matte Lipstick", "Hair Care Kit", "Sunscreen SPF50"]
  };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let seed = 20250930;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

  const DATA = [];
  [2024, 2025].forEach((year) => {
    for (let m = 0; m < 12; m++) {
      CATEGORIES.forEach((cat, ci) => {
        REGIONS.forEach((reg, ri) => {
          const prod = PRODUCTS[cat][Math.floor(rnd() * 4)];
          const season = 1 + 0.35 * Math.sin(((m - 2) / 12) * Math.PI * 2);
          const growth = year === 2025 ? 1.18 : 1;
          const units = Math.round((25 + rnd() * 120) * season * growth * (1 + ci * 0.05) * (1 + ri * 0.04));
          const price = 12 + Math.round(rnd() * 180);
          const revenue = units * price;
          const margin = 0.14 + rnd() * 0.28;
          DATA.push({
            year, month: m, region: reg, category: cat, product: prod,
            units, revenue, profit: Math.round(revenue * margin),
            orders: Math.max(1, Math.round(units / (2 + rnd() * 3)))
          });
        });
      });
    }
  });

  /* ── 2. Helpers ────────────────────────────────────────────── */
  const money = (n) =>
    n >= 1e6 ? "$" + (n / 1e6).toFixed(2) + "M" :
    n >= 1e3 ? "$" + (n / 1e3).toFixed(1) + "K" : "$" + Math.round(n);
  const num = (n) => n.toLocaleString("en-US");
  const pct = (n) => (n * 100).toFixed(1) + "%";
  const sum = (a, k) => a.reduce((t, d) => t + d[k], 0);
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const svgRoot = (host, w, h) => {
    host.innerHTML = "";
    const s = el("svg", { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none" });
    s.setAttribute("preserveAspectRatio", "xMidYMid meet");
    host.appendChild(s);
    return s;
  };

  /* tooltip */
  const tip = $("#tooltip");
  const bindTip = (node, text) => {
    node.addEventListener("mousemove", (e) => {
      tip.textContent = text;
      tip.style.left = e.clientX + "px";
      tip.style.top = e.clientY + "px";
      tip.classList.add("show");
    });
    node.addEventListener("mouseleave", () => tip.classList.remove("show"));
  };

  /* ── 3. Filters ────────────────────────────────────────────── */
  const state = { year: "all", region: "all", category: "all", sort: "revenue", dir: -1 };

  const fill = (sel, items) => {
    items.forEach((v) => {
      const o = document.createElement("option");
      o.value = v; o.textContent = v;
      sel.appendChild(o);
    });
  };
  fill($("#fRegion"), REGIONS);
  fill($("#fCategory"), CATEGORIES);

  const filtered = () => DATA.filter((d) =>
    (state.year === "all" || d.year === +state.year) &&
    (state.region === "all" || d.region === state.region) &&
    (state.category === "all" || d.category === state.category));

  /* ── 4. KPI cards ──────────────────────────────────────────── */
  function renderKPIs(rows) {
    const revenue = sum(rows, "revenue");
    const profit = sum(rows, "profit");
    const orders = sum(rows, "orders");
    const units = sum(rows, "units");

    // previous-period comparison = first half vs second half of range
    const half = Math.floor(rows.length / 2);
    const prevRev = sum(rows.slice(0, half), "revenue") || 1;
    const currRev = sum(rows.slice(half), "revenue");
    const delta = (currRev - prevRev) / prevRev;

    const monthly = MONTHS.map((_, m) => sum(rows.filter((d) => d.month === m), "revenue"));

    const cards = [
      { label: "Total Revenue", value: money(revenue), delta, spark: monthly, color: "#00e5ff" },
      { label: "Total Profit", value: money(profit), delta: delta * 0.92, spark: MONTHS.map((_, m) => sum(rows.filter((d) => d.month === m), "profit")), color: "#34d399" },
      { label: "Orders", value: num(orders), delta: delta * 0.6, spark: MONTHS.map((_, m) => sum(rows.filter((d) => d.month === m), "orders")), color: "#8b5cf6" },
      { label: "Avg Order Value", value: money(orders ? revenue / orders : 0), delta: delta * 0.3, spark: monthly.map((v, i) => v / 1000 + i), color: "#ec4899" },
      { label: "Units Sold", value: num(units), delta: delta * 0.8, spark: MONTHS.map((_, m) => sum(rows.filter((d) => d.month === m), "units")), color: "#fbbf24" },
      { label: "Profit Margin", value: pct(revenue ? profit / revenue : 0), delta: delta * 0.1, spark: monthly, color: "#60a5fa" }
    ];

    const grid = $("#kpiGrid");
    grid.innerHTML = "";
    cards.forEach((c) => {
      const box = document.createElement("div");
      box.className = "kpi";
      const up = c.delta >= 0;
      box.innerHTML =
        `<div class="kpi-label">${c.label}</div>
         <div class="kpi-value">${c.value}</div>
         <div class="kpi-delta ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${Math.abs(c.delta * 100).toFixed(1)}% vs prev. period</div>`;
      grid.appendChild(box);
      sparkline(box, c.spark, c.color);
    });
  }

  function sparkline(box, values, color) {
    const w = 200, h = 34;
    const s = el("svg", { viewBox: `0 0 ${w} ${h}`, class: "kpi-spark" });
    const max = Math.max(...values, 1), min = Math.min(...values);
    const pts = values.map((v, i) => [
      (i / (values.length - 1)) * w,
      h - 3 - ((v - min) / (max - min || 1)) * (h - 8)
    ]);
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    el("path", { d: `${d} L ${w} ${h} L 0 ${h} Z`, fill: color, opacity: ".12" }, s);
    el("path", { d, fill: "none", stroke: color, "stroke-width": "2", "stroke-linejoin": "round", "stroke-linecap": "round" }, s);
    box.appendChild(s);
  }

  /* ── 5. Line / area chart — revenue trend ──────────────────── */
  function renderTrend(rows) {
    const host = $("#chartTrend");
    const W = 900, H = 300, pad = { l: 58, r: 18, t: 16, b: 34 };
    const years = state.year === "all" ? [2024, 2025] : [+state.year];
    const series = years.map((y, i) => ({
      year: y,
      color: COLORS[i],
      values: MONTHS.map((_, m) => sum(rows.filter((d) => d.year === y && d.month === m), "revenue"))
    }));
    const max = Math.max(...series.flatMap((s) => s.values), 1) * 1.1;
    const x = (i) => pad.l + (i / 11) * (W - pad.l - pad.r);
    const y = (v) => H - pad.b - (v / max) * (H - pad.t - pad.b);

    const svg = svgRoot(host, W, H);
    for (let g = 0; g <= 4; g++) {
      const gy = pad.t + (g / 4) * (H - pad.t - pad.b);
      el("line", { x1: pad.l, x2: W - pad.r, y1: gy, y2: gy, class: "grid-line" }, svg);
      const t = el("text", { x: pad.l - 10, y: gy + 4, class: "axis-text", "text-anchor": "end" }, svg);
      t.textContent = money(max * (1 - g / 4));
    }
    MONTHS.forEach((m, i) => {
      const t = el("text", { x: x(i), y: H - 12, class: "axis-text", "text-anchor": "middle" }, svg);
      t.textContent = m;
    });

    series.forEach((s) => {
      const d = s.values.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
      el("path", { d: `${d} L ${x(11)} ${H - pad.b} L ${x(0)} ${H - pad.b} Z`, fill: s.color, opacity: ".10" }, svg);
      const line = el("path", { d, fill: "none", stroke: s.color, "stroke-width": "2.6", "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
      const len = 2000;
      line.setAttribute("stroke-dasharray", len);
      line.setAttribute("stroke-dashoffset", len);
      line.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 900, fill: "forwards", easing: "ease-out" });
      s.values.forEach((v, i) => {
        const c = el("circle", { cx: x(i), cy: y(v), r: 4, fill: "#050816", stroke: s.color, "stroke-width": "2.4", class: "dot" }, svg);
        bindTip(c, `${MONTHS[i]} ${s.year} · ${money(v)}`);
      });
    });

    $("#trendChip").textContent = years.join(" vs ");
  }

  /* ── 6. Donut — revenue by category ────────────────────────── */
  function renderDonut(rows) {
    const host = $("#chartDonut");
    const W = 320, H = 240, cx = W / 2, cy = H / 2, R = 92, r = 56;
    const data = CATEGORIES
      .map((c, i) => ({ name: c, value: sum(rows.filter((d) => d.category === c), "revenue"), color: COLORS[i] }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
    const total = data.reduce((t, d) => t + d.value, 0) || 1;

    const svg = svgRoot(host, W, H);
    let a0 = -Math.PI / 2;
    data.forEach((d) => {
      const a1 = a0 + (d.value / total) * Math.PI * 2;
      const big = a1 - a0 > Math.PI ? 1 : 0;
      const p = (rad, ang) => [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
      const [x1, y1] = p(R, a0), [x2, y2] = p(R, a1), [x3, y3] = p(r, a1), [x4, y4] = p(r, a0);
      const path = el("path", {
        d: `M${x1} ${y1} A${R} ${R} 0 ${big} 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 ${big} 0 ${x4} ${y4} Z`,
        fill: d.color, opacity: ".9", class: "slice"
      }, svg);
      bindTip(path, `${d.name} · ${money(d.value)} (${pct(d.value / total)})`);
      a0 = a1;
    });
    const t1 = el("text", { x: cx, y: cy - 4, "text-anchor": "middle", fill: "#e8edf7", "font-size": "20", "font-family": "Space Grotesk, sans-serif", "font-weight": "700" }, svg);
    t1.textContent = money(total);
    const t2 = el("text", { x: cx, y: cy + 16, "text-anchor": "middle", class: "axis-text" }, svg);
    t2.textContent = "total revenue";

    $("#donutLegend").innerHTML = data.map((d) =>
      `<li><i style="background:${d.color}"></i>${d.name} <b>${pct(d.value / total)}</b></li>`).join("");
  }

  /* ── 7. Horizontal bars — revenue by region ────────────────── */
  function renderBars(rows) {
    const host = $("#chartBars");
    const W = 340, rowH = 46, H = REGIONS.length * rowH + 14;
    const data = REGIONS.map((r, i) => ({
      name: r, value: sum(rows.filter((d) => d.region === r), "revenue"), color: COLORS[i]
    })).sort((a, b) => b.value - a.value);
    const max = Math.max(...data.map((d) => d.value), 1);

    const svg = svgRoot(host, W, H);
    data.forEach((d, i) => {
      const y = i * rowH + 8;
      const bw = Math.max(2, (d.value / max) * (W - 92));
      const lbl = el("text", { x: 0, y: y + 16, class: "axis-text" }, svg);
      lbl.textContent = d.name;
      el("rect", { x: 46, y, width: W - 92, height: 20, rx: 6, fill: "rgba(255,255,255,.05)" }, svg);
      const bar = el("rect", { x: 46, y, width: 0, height: 20, rx: 6, fill: d.color, opacity: ".9", class: "bar" }, svg);
      bar.animate([{ width: 0 }, { width: bw }], { duration: 700, fill: "forwards", easing: "ease-out" });
      bar.setAttribute("width", bw);
      bindTip(bar, `${d.name} · ${money(d.value)}`);
      const val = el("text", { x: W - 40, y: y + 16, class: "axis-text", "text-anchor": "start" }, svg);
      val.textContent = money(d.value);
    });
  }

  /* ── 8. Vertical bars — margin by category ─────────────────── */
  function renderMargin(rows) {
    const host = $("#chartMargin");
    const W = 340, H = 230, pad = { l: 40, r: 10, t: 14, b: 44 };
    const data = CATEGORIES.map((c, i) => {
      const r = rows.filter((d) => d.category === c);
      const rev = sum(r, "revenue");
      return { name: c, value: rev ? sum(r, "profit") / rev : 0, color: COLORS[i] };
    }).filter((d) => d.value > 0);
    const max = Math.max(...data.map((d) => d.value), 0.01) * 1.2;

    const svg = svgRoot(host, W, H);
    for (let g = 0; g <= 3; g++) {
      const gy = pad.t + (g / 3) * (H - pad.t - pad.b);
      el("line", { x1: pad.l, x2: W - pad.r, y1: gy, y2: gy, class: "grid-line" }, svg);
      const t = el("text", { x: pad.l - 8, y: gy + 4, class: "axis-text", "text-anchor": "end" }, svg);
      t.textContent = pct(max * (1 - g / 3));
    }
    const slot = (W - pad.l - pad.r) / (data.length || 1);
    data.forEach((d, i) => {
      const bw = Math.min(34, slot * 0.55);
      const x = pad.l + slot * i + (slot - bw) / 2;
      const h = (d.value / max) * (H - pad.t - pad.b);
      const y = H - pad.b - h;
      const bar = el("rect", { x, y, width: bw, height: h, rx: 6, fill: d.color, opacity: ".9", class: "bar" }, svg);
      bar.animate([{ height: 0, y: H - pad.b }, { height: h, y }], { duration: 700, fill: "forwards", easing: "ease-out" });
      bindTip(bar, `${d.name} · ${pct(d.value)} margin`);
      const t = el("text", { x: x + bw / 2, y: H - pad.b + 16, class: "axis-text", "text-anchor": "middle" }, svg);
      t.textContent = d.name.split(" ")[0].slice(0, 8);
    });
  }

  /* ── 9. Top products table ─────────────────────────────────── */
  function aggregateProducts(rows) {
    const map = new Map();
    rows.forEach((d) => {
      const key = d.product + "|" + d.region;
      const o = map.get(key) || { product: d.product, category: d.category, region: d.region, units: 0, revenue: 0, profit: 0 };
      o.units += d.units; o.revenue += d.revenue; o.profit += d.profit;
      map.set(key, o);
    });
    return [...map.values()].map((o) => ({ ...o, margin: o.revenue ? o.profit / o.revenue : 0 }));
  }

  let tableRows = [];
  function renderTable(rows) {
    tableRows = aggregateProducts(rows).sort((a, b) => {
      const A = a[state.sort], B = b[state.sort];
      return (typeof A === "string" ? A.localeCompare(B) : A - B) * state.dir;
    });
    const top = tableRows.slice(0, 12);
    $("#rowChip").textContent = `${top.length} of ${tableRows.length} rows`;
    $("#tableBody").innerHTML = top.length
      ? top.map((r) => {
          const cls = r.margin >= 0.3 ? "good" : r.margin >= 0.22 ? "mid" : "low";
          return `<tr>
            <td>${r.product}</td>
            <td><span class="tag">${r.category}</span></td>
            <td>${r.region}</td>
            <td class="num">${num(r.units)}</td>
            <td class="num">${money(r.revenue)}</td>
            <td class="num">${money(r.profit)}</td>
            <td class="num mg ${cls}">${pct(r.margin)}</td>
          </tr>`;
        }).join("")
      : `<tr><td colspan="7" class="empty">No records match the selected filters.</td></tr>`;
  }

  /* ── 10. Render pipeline ───────────────────────────────────── */
  function render() {
    const rows = filtered();
    renderKPIs(rows);
    renderTrend(rows);
    renderDonut(rows);
    renderBars(rows);
    renderMargin(rows);
    renderTable(rows);
  }

  /* ── 11. Events ────────────────────────────────────────────── */
  $("#fYear").addEventListener("change", (e) => { state.year = e.target.value; render(); });
  $("#fRegion").addEventListener("change", (e) => { state.region = e.target.value; render(); });
  $("#fCategory").addEventListener("change", (e) => { state.category = e.target.value; render(); });
  $("#btnReset").addEventListener("click", () => {
    state.year = "all"; state.region = "all"; state.category = "all";
    $("#fYear").value = "all"; $("#fRegion").value = "all"; $("#fCategory").value = "all";
    render();
  });
  $("#btnExport").addEventListener("click", () => {
    const head = ["product", "category", "region", "units", "revenue", "profit", "margin"];
    const csv = [head.join(",")].concat(
      tableRows.map((r) => head.map((k) => (typeof r[k] === "number" ? r[k].toFixed(2) : `"${r[k]}"`)).join(","))
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "sales-dashboard-export.csv"; a.click();
    URL.revokeObjectURL(url);
  });
  document.querySelectorAll(".dash-table th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const k = th.dataset.sort;
      state.dir = state.sort === k ? -state.dir : -1;
      state.sort = k;
      renderTable(filtered());
    });
  });
  window.addEventListener("resize", () => clearTimeout(window.__rz) || (window.__rz = setTimeout(render, 200)));

  $("#yr").textContent = new Date().getFullYear();
  render();
})();
