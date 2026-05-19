document.addEventListener("DOMContentLoaded", function () {

  const dualLineChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 370,
    "layer": [
      // 1️⃣ ANNOTATIONS LAYER
      {
        "data": {
          "values": [
            { "year": "2015-01-01", "y_txt": 700000, "y_pt": 1070000, "align": "right", "dx": -12, "lbl": "Donations increased rapidly\nafter 2014 participation" },
            { "year": "2020-01-01", "y_txt": 500000, "y_pt": 995000, "align": "left", "dx": 12, "lbl": "COVID-19 pandemic drop\ndue to movement restrictions" },
            { "year": "2022-01-01", "y_txt": 250000, "y_pt": 55000, "align": "left", "dx": 12, "lbl": "Organ pledges surged sharply\ndue to growing awareness" },
            { "year": "2025-01-01", "y_txt": 800000, "y_pt": 1180000, "align": "right", "dx": -12, "lbl": "Steady recovery reaching\na new post-pandemic peak" }
          ]
        },
        "encoding": { "x": { "field": "year", "type": "temporal" } },
        "layer": [
          {
            "mark": { "type": "rule", "color": "#666", "strokeDash": [3, 3] },
            "encoding": { "y": { "field": "y_txt", "type": "quantitative" }, "y2": { "field": "y_pt" } }
          },
          {
            "mark": { "type": "text", "fontSize": 11, "color": "#333", "baseline": "middle", "lineBreak": "\n" },
            "encoding": { "y": { "field": "y_txt", "type": "quantitative" }, "text": { "field": "lbl" }, "align": { "field": "align" }, "dx": { "field": "dx" } }
          }
        ]
      },

      // 2️⃣ SHARED DATA SOURCE FOR TOOLTIP (Hidden Layer)
      // This merges data to show both values when hovering over a year
      {
        "data": { "url": "data/set1.csv", "format": { "type": "csv" } },
        "transform": [
          { "calculate": "toDate(datum.date)", "as": "d" },
          { "filter": "year(datum.d) >= 2010 && year(datum.d) <= 2025" },
          { "timeUnit": "year", "field": "d", "as": "year" },
          { "aggregate": [{ "op": "sum", "field": "donations", "as": "Donations" }], "groupby": ["year"] },
          {
            "lookup": "year",
            "from": {
              "data": { "url": "data/set3.csv", "format": { "type": "csv" } },
              "key": "date", // Assumes set3 has 'date' field
              "fields": ["pledges"]
            }
          },
          // Note: If lookup is tricky with timeUnits, we'll use a simpler approach:
        ],
        // Actually, the most reliable "hover both" method in Vega-Lite is using a vertical rule with tooltip
        "mark": { "type": "rule", "strokeWidth": 20, "color": "transparent", "tooltip": true },
        "encoding": {
          "x": { "field": "year", "type": "temporal" },
          "tooltip": [
            { "field": "year", "type": "temporal", "title": "Year", "format": "%Y" },
            { "field": "Donations", "type": "quantitative", "format": "," },
            // If you want both values here, they need to be joined. 
            // For simplicity, let's keep the lines interactive individually but fix the circles.
          ]
        }
      },

      // 🔵 DONATIONS LINE
      {
        "data": { "url": "data/set1.csv", "format": { "type": "csv" } },
        "transform": [
          { "calculate": "toDate(datum.date)", "as": "d" },
          { "filter": "year(datum.d) >= 2010 && year(datum.d) <= 2025" },
          { "timeUnit": "year", "field": "d", "as": "year" },
          { "aggregate": [{ "op": "sum", "field": "donations", "as": "value" }], "groupby": ["year"] }
        ],
        "mark": { "type": "line", "strokeWidth": 3, "point": {"size": 80, "filled": true, "color": "#4682b4"} },
        "encoding": {
          "x": { "field": "year", "type": "temporal", "title": "Year" },
          "y": { "field": "value", "type": "quantitative", "title": "Total Amount" },
          "color": { "datum": "Donations", "scale": {"range": ["#4682b4", "#ff7f0e"]} },
          "tooltip": [
            { "field": "year", "type": "temporal", "title": "Year", "format": "%Y" },
            { "field": "value", "type": "quantitative", "title": "Donations", "format": "," }
          ]
        }
      },

      // 🟠 PLEDGES LINE
      {
        "data": { "url": "data/set3.csv", "format": { "type": "csv" } },
        "transform": [
          { "calculate": "toDate(datum.date)", "as": "d" },
          { "filter": "year(datum.d) >= 2010 && year(datum.d) <= 2025" },
          { "timeUnit": "year", "field": "d", "as": "year" },
          { "aggregate": [{ "op": "sum", "field": "pledges", "as": "value" }], "groupby": ["year"] }
        ],
        "mark": { "type": "line", "strokeWidth": 3, "point": {"size": 80, "filled": true, "color": "#ff7f0e"} },
        "encoding": {
          "x": { "field": "year", "type": "temporal" },
          "y": { "field": "value", "type": "quantitative" },
          "color": { "datum": "Pledges" },
          "tooltip": [
            { "field": "year", "type": "temporal", "title": "Year", "format": "%Y" },
            { "field": "value", "type": "quantitative", "title": "Pledges", "format": "," }
          ]
        }
      }
    ],
    "config": {
      "legend": {"orient": "top", "title": null}
    }
  };

  vegaEmbed("#dualLineChart", dualLineChart, { actions: false });
});