const bumpChartAllStates = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 720,
  "height": 250,
  "data": { 
    "url": "data/combined.csv",
    "format": { "type": "csv", "parse": { "date": "number", "donations": "number", "pledges": "number" } }
  },
  "transform": [
    { "filter": "datum.date >= 2020 && datum.date <= 2025" },
    { "calculate": "datum.donations + datum.pledges", "as": "total" },
    {
      "aggregate": [{ "op": "sum", "field": "total", "as": "yearly_total" }],
      "groupby": ["date", "state"]
    },
    {
      "window": [{ "op": "sum", "field": "yearly_total", "as": "year_total_all_states" }],
      "frame": [null, null],
      "groupby": ["date"]
    },
    {
      "calculate": "datum.yearly_total / datum.year_total_all_states",
      "as": "percentage"
    },
    {
      "window": [{ "op": "rank", "as": "rank" }],
      "groupby": ["date"],
      "sort": [{ "field": "yearly_total", "order": "descending" }]
    }
  ],
  "layer": [
    {
      // --- LINES ---
      "params": [
        {
          "name": "hover",
          "select": { "type": "point", "fields": ["state"], "on": "mouseover", "clear": "mouseout" }
        }
      ],
      "mark": { "type": "line", "strokeWidth": 3 },
      "encoding": {
        "x": { "field": "date", "type": "ordinal", "title": "Year", "scale": { "padding": 0.5 } },
        "y": { "field": "rank", "type": "ordinal", "axis": { "title": "Rank" } },
        "color": { 
          "field": "state", 
          "type": "nominal",
          "scale": { 
            "range": [
              "#66c2a5", // Teal
              "#fc6281", // Raspberry
              "#a48dcb", // Goldenrod-ish
              "#e78ac3", // Deep Purple
              "#a6d854", // Lime Green
              "#ffd92f"  // Yellow
            ] 
          }
        },
        "opacity": {
          "condition": { "param": "hover", "value": 1 },
          "value": 0.1 
        },
        "detail": { "field": "state" }
      }
    },
    {
      // --- POINTS ---
      "mark": { "type": "point", "filled": true },
      "encoding": {
        "x": { "field": "date", "type": "ordinal" },
        "y": { "field": "rank", "type": "ordinal" },
        "color": { "field": "state", "type": "nominal" },
        "size": {
          "condition": { "param": "hover", "empty": false, "value": 1000 },
          "value": 120
        },
        "opacity": {
          "condition": { "param": "hover", "value": 1 },
          "value": 0.2 
        },
        "detail": { "field": "state" }
      }
    },
    {
      // --- PERCENTAGE TEXT ---
      "mark": { "type": "text", "baseline": "middle", "fontSize": 12, "fontWeight": "bold" },
      "encoding": {
        "x": { "field": "date", "type": "ordinal" },
        "y": { "field": "rank", "type": "ordinal" },
        "text": { "field": "percentage", "type": "quantitative", "format": ".0%" },
        "color": { "value": "white" },
        "opacity": { 
          "condition": { "param": "hover", "empty": false, "value": 1 },
          "value": 0
        }
      }
    },
    {
      // --- RIGHT-SIDE LABELS (BLACK) ---
      "transform": [{ "filter": "datum.date == 2025" }],
      "mark": { "type": "text", "align": "left", "dx": 25, "fontSize": 12 },
      "encoding": {
        "x": { "field": "date", "type": "ordinal" },
        "y": { "field": "rank", "type": "ordinal" },
        "text": { "field": "state" },
        "color": { "value": "black" }, // ✅ fixed black for all state labels
        "opacity": {
          "condition": { "param": "hover", "value": 1 },
          "value": 0.1 
        }
      }
    }
  ],
  "config": {
    "background": "white",
    "view": { "stroke": null },
    "legend": { "disable": true }
  }
};

vegaEmbed("#bumpChart", bumpChartAllStates, { actions: false });