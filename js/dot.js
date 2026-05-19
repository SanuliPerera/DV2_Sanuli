const dotChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 330,
  "padding": 10,
  "autosize": {"type": "fit", "contains": "padding"},
  "data": { "url": "data/summary.csv" },

  "params": [
    {
      "name": "xMax",
      "value": 4500000 ,
      "bind": {
        "input": "range",
        "min": 150000, 
        "max": 4500000,
        "step": 50000,
        "name": "Adjust axis range: "
      }
    }
  ],

  /* 📈 CALCULATE THE GAP */
  "transform": [
    {
      "calculate": "abs(datum.donations - datum.pledges)",
      "as": "gap_size"
    }
  ],

  "encoding": {
    "y": {
      "field": "state",
      "type": "nominal",
      /* ⬇️ SORT BY GAP: Smallest gap at top, largest at bottom */
      "sort": {"field": "gap_size", "order": "ascending"},
      "axis": { 
        "labelPadding": 20,
        "domain": false,
        "ticks": false
      }
    },
    "x": {
      "type": "quantitative",
      "scale": { 
        "domain": [-150000, { "expr": "xMax" }],
        "nice": false
      },
      "axis": { 
        "title": "Amount (Pledges vs Donations)",
        "format": "~s",
        "domain": false,
        "values": [0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000]
      }
    }
  },

  "layer": [
    /* 🔗 CONNECTING LINE */
    {
      "mark": { "type": "rule", "color": "#bbb", "strokeWidth": 2, "clip": true },
      "encoding": {
        "x": { "field": "pledges" },
        "x2": { "field": "donations" }
      }
    },

    /* 🔵 DONATIONS DOT */
    {
      "transform": [{ "calculate": "'Donations'", "as": "series" }],
      "mark": { "type": "circle", "size": 80, "opacity": 0.9, "clip": true },
      "encoding": {
        "x": { "field": "donations" },
        "color": {
          "field": "series",
          "scale": {
            "domain": ["Donations", "Pledges"],
            "range": ["#4C78A8", "#F58518"]
          },
          "legend": { "orient": "top", "direction": "horizontal", "title": null }
        },
        "tooltip": [
          {"field": "state", "type": "nominal"},
          {"field": "donations", "type": "quantitative", "format": ","},
          {"field": "gap_size", "title": "Gap", "type": "quantitative", "format": ","}
        ]
      }
    },

    /* 🟠 PLEDGES DOT */
    {
      "transform": [{ "calculate": "'Pledges'", "as": "series" }],
      "mark": { "type": "circle", "size": 80, "opacity": 0.9, "clip": true },
      "encoding": {
        "x": { "field": "pledges" },
        "color": { "field": "series" },
        "tooltip": [
          {"field": "state", "type": "nominal"},
          {"field": "pledges", "type": "quantitative", "format": ","}
        ]
      }
    }
  ]
};

vegaEmbed('#dotChart', dotChart);