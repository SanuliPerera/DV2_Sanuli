const butterflyChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "autosize": { "type": "fit-x", "contains": "padding" },
  "padding": 10,
  "width": "container",
  "height": 320,

  "data": { "url": "data/summary.csv" },

  "transform": [
    { "filter": "datum.state != 'Kuala Lumpur'" },

    {
      "joinaggregate": [
        { "op": "sum", "field": "donations", "as": "total_donations" },
        { "op": "sum", "field": "pledges", "as": "total_pledges" }
      ]
    },

    { "calculate": "-(datum.donations / datum.total_donations) * 100", "as": "donations_pct" },
    { "calculate": "(datum.pledges / datum.total_pledges) * 100", "as": "pledges_pct" },

    { "calculate": "format(abs(datum.donations_pct), '.1f') + '%'", "as": "donations_label" },
    { "calculate": "format(datum.pledges_pct, '.1f') + '%'", "as": "pledges_label" }
  ],

  "layer": [
    {
      "mark": { "type": "bar", "color": "#4C78A8" },
      "encoding": {
        "y": {
          "field": "state",
          "type": "ordinal",
          "sort": { "field": "donations_pct", "order": "descending" }
        },
        "x": {
          "field": "donations_pct",
          "type": "quantitative",
          "scale": { "domain": [-50, 50] },
          "axis": {
            "title": "Share of Total (%)",
            "labelExpr": "abs(datum.value)"
          }
        }
      }
    },

    {
      "mark": { "type": "bar", "color": "#F28E2B" },
      "encoding": {
        "y": { "field": "state", "type": "ordinal" },
        "x": { "field": "pledges_pct", "type": "quantitative" }
      }
    },

    {
      "mark": { "type": "text", "align": "right", "dx": -5, "baseline": "middle" },
      "encoding": {
        "y": { "field": "state", "type": "ordinal" },
        "x": { "field": "donations_pct", "type": "quantitative" },
        "text": { "field": "donations_label", "type": "nominal" }
      }
    },

    {
      "mark": { "type": "text", "align": "left", "dx": 5, "baseline": "middle" },
      "encoding": {
        "y": { "field": "state", "type": "ordinal" },
        "x": { "field": "pledges_pct", "type": "quantitative" },
        "text": { "field": "pledges_label", "type": "nominal" }
      }
    },

    {
      "mark": { "type": "rule", "color": "#484747" },
      "encoding": {
        "x": { "datum": 0 }
      }
    }
  ],

  "config": {
    "view": { "stroke": null },

    "axis": {
      "labelFont": "Inter",
      "titleFont": "Inter",
      "grid": true
    },

    "x": {
      "axis": {
        "grid": false
      }
    },

    "y": {
      "axis": {
        "grid": true
      }
    }
  }
};

vegaEmbed("#butterflyChart", butterflyChart, { actions: false, renderer: "canvas" });