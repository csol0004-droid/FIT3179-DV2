 const embedOptions = {
  actions: false,
  renderer: "svg"
};

async function loadCharts() {
  try {
    await vegaEmbed(
      "#vis1",
      "js/charts/test-chart.json",
      embedOptions
    );
  } catch (error) {
    console.error("Chart failed to load:", error);
  }
}

loadCharts();