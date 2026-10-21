// FIT3179 DV2 — embed each chart independently so one issue never hides the others.
const embedOptions = { actions: false, renderer: "svg" };
const charts = [
  ["vis1", "leading-brands.json"],
  ["vis2", "market-share.json"],
  ["vis3", "smartwatch-map.json"],
  ["vis4", "wristband-map.json"],
  ["vis5", "bivariate-map.json"],
  ["vis6", "australia-trend.json"],
  ["vis7", "australia-gaps.json"],
  ["vis8", "age-gender-map.json"],
  ["vis9", "lifestyle-ownership.json"],
  ["vis10", "feature-rankings.json"],
  ["vis11", "motivations-waffle.json"],
  ["vis12", "complaints-butterfly.json"]
];

async function loadChart([id, filename]) {
  const target = document.getElementById(id);
  if (!target) {
    console.warn(`Missing HTML chart container: #${id}`);
    return;
  }

  target.innerHTML = '<p class="chart-loading">Loading visualisation…</p>';
  try {
    if (typeof vegaEmbed !== "function") {
      throw new Error("Vega libraries did not load. Check internet access and the three CDN script tags.");
    }

    const path = `js/charts/${filename}`;
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Cannot load ${path} (HTTP ${response.status})`);
    const spec = await response.json();

    // Vega (not Vega-Lite) treemap requires a numeric width; fit to this chart column.
    if ((spec.$schema || "").includes("/schema/vega/v")) {
      spec.width = Math.max(260, Math.floor(target.clientWidth) - 8);
    }

    target.replaceChildren();
    await vegaEmbed(target, spec, embedOptions);
    console.info(`Loaded ${id}: ${filename}`);
  } catch (error) {
    console.error(`Failed ${id} (${filename})`, error);
    const note = document.createElement("p");
    note.className = "chart-error";
    note.textContent = `Unable to load ${filename}: ${error.message}. See the browser Console for details.`;
    target.replaceChildren(note);
  }
}

function loadAllCharts() {
  // Chart failures are isolated; the rest of the story still renders.
  Promise.allSettled(charts.map(loadChart));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAllCharts);
} else {
  loadAllCharts();
}
