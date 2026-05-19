const gapChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": "container",
  "height": 350,

  "autosize": {
    "type": "fit",
    "contains": "padding"
  },

  "padding": {
    "left": 60,
    "right": 20,
    "top": 10,
    "bottom": 40
  },

  "data": {
    "url": "data/set2.csv"
  },

  "transform": [
    {
      "aggregate": [
        {"op": "sum", "field": "donations", "as": "total_donations"}
      ],
      "groupby": ["state"]
    },
    {
      "lookup": "state",
      "from": {
        "data": {"url": "data/set4.csv"},
        "key": "state",
        "fields": ["pledges"]
      }
    },
    {
      "aggregate": [
        {"op": "sum", "field": "pledges", "as": "total_pledges"}
      ],
      "groupby": ["state", "total_donations"]
    },
    {
      "calculate": "abs(datum.total_donations - datum.total_pledges)",
      "as": "gap"
    }
  ],

  "mark": "bar",

  "encoding": {

    "x": {
      "field": "state",
      "type": "nominal",
      "sort": "-y",
      "axis": {
        "labelAngle": -40,
        "labelLimit": 120
      }
    },

    "y": {
      "field": "gap",
      "type": "quantitative",
      "title": "Donation–Pledge Gap"
    },

    "color": {
      "value": "#4C78A8"
    },

    "tooltip": [
      {"field": "state"},
      {"field": "total_donations"},
      {"field": "total_pledges"},
      {"field": "gap"}
    ]
  }
};

vegaEmbed("#gapBarChart", gapChart, {actions: false});