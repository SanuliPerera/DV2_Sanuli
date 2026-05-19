const boxPlot = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 250,
  "data": { "url": "data/set2.csv" },
  "transform": [
    { "filter": "datum.state == 'Sarawak' || datum.state == 'Johor' || datum.state == 'Sabah'" },
    { "filter": "datum.donations <= 700" }
  ],
  "encoding": {
    "y": { 
      "field": "state", 
      "type": "nominal", 
      "title": null, 
      "sort": ["Johor", "Sabah", "Sarawak"] 
    }
  },
  "layer": [
    // 1. Shaded IQR Background Bars
    {
      "data": {
        "values": [
          { "state": "Johor", "q1": 12, "q3": 55 },
          { "state": "Sabah", "q1": 11, "q3": 46 },
          { "state": "Sarawak", "q1": 11, "q3": 40 }
        ]
      },
      "mark": {
        "type": "bar",
        "height": 42,
        "fill": "#4C78A8",
        "fillOpacity": 0.15,
        "stroke": null
      },
      "encoding": {
        "x": { 
          "field": "q1", 
          "type": "quantitative",
          "scale": { "domain": [0, 140] }
        },
        "x2": { "field": "q3" }
      }
    },

    // 2. Base Boxplot
    {
      "mark": {
        "type": "boxplot",
        "extent": 1.5,
        "size": 42,
        "color": "#4C78A8",
        "fill": "transparent",
        "median": { "color": "#111", "strokeWidth": 3 },
        "ticks": { "color": "#666" },
        "outliers": false
      },
      "encoding": {
        "x": { 
          "field": "donations", 
          "type": "quantitative", 
          "scale": { "domain": [0, 140] }, 
          "axis": { "tickCount": 8 }, 
          "title": "Blood Donations" 
        }
      }
    },

    // 3. Median Value Labels (Inside)
    {
      "data": {
        "values": [
          { "state": "Johor", "median_val": 25, "label": "25" },
          { "state": "Sabah", "median_val": 22, "label": "22" },
          { "state": "Sarawak", "median_val": 22.5, "label": "22.5" }
        ]
      },
      "mark": {
        "type": "text",
        "font": "Inter",
        "fontSize": 11,
        "fontWeight": "bold",
        "color": "#FFF",
        "align": "center",
        "baseline": "middle",
        "dy": 0
      },
      "encoding": {
        "x": { "field": "median_val", "type": "quantitative" },
        "text": { "field": "label", "type": "nominal" }
      }
    },

    // 4. State-Specific IQR Text Labels (UPDATED: Moved safely below the box, horizontally centered)
    {
      "data": {
        "values": [
          { "state": "Johor", "mid_iqr": 33.5, "iqr_text": "IQR: 12–55" },
          { "state": "Sabah", "mid_iqr": 28.5, "iqr_text": "IQR: 11–46" },
          { "state": "Sarawak", "mid_iqr": 25.5, "iqr_text": "IQR: 11–40" }
        ]
      },
      "mark": {
        "type": "text",
        "font": "Inter",
        "fontSize": 10,
        "fontWeight": "500",
        "color": "#4A5568",
        "align": "center",
        "baseline": "middle",  // Kept middle to make calculation predictable
        "dy": 34                // Pushes text outside the 42px height of the box layout
      },
      "encoding": {
        "x": { "field": "mid_iqr", "type": "quantitative" },
        "text": { "field": "iqr_text", "type": "nominal" }
      }
    },

    // 5. Single Global Annotation
    {
      "data": {
        "values": [{ "x": 90, "state": "Johor", "text": "Max donations across all states: 100" }]
      },
      "mark": {
        "type": "text",
        "font": "Inter",
        "fontSize": 11,
        "fontWeight": "600",
        "color": "#121212",
        "align": "left",
        "baseline": "bottom",
        "dy": -45 
      },
      "encoding": {
        "x": { "field": "x", "type": "quantitative" },
        "text": { "field": "text", "type": "nominal" }
      }
    }
  ],

  "config": {
    "view": { "stroke": null },
    "axis": { "gridColor": "#eee", "labelFont": "Inter", "titleFont": "Inter", "labelFontSize": 12, "titleFontSize": 13 }
  }
};

vegaEmbed("#boxPlot", boxPlot, { actions: false });