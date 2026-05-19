const areaChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "url": "data/set1.csv"
  },
  "transform": [
    { "filter": "datum.blood_type != 'all'" },
    {
      "filter": "toDate(datum.date) >= toDate('2010-01-01') && toDate(datum.date) <= toDate('2025-12-31')"
    },
    { "timeUnit": "year", "field": "date", "as": "year" },
    {
      "aggregate": [{ "op": "sum", "field": "donations", "as": "total_donations" }],
      "groupby": ["year", "blood_type"]
    }
  ],
  "vconcat": [
    {
      "title": "Detailed View (Drag below to zoom)",
      "width": "container",
      "height": 230,
      "mark": { 
        "type": "area", 
        "interpolate": "monotone", 
        "opacity": 0.7 
      },
      "encoding": {
        "x": {
          "field": "year",
          "type": "temporal",
          "title": "Year",
          "scale": { "domain": { "param": "brush" } }
        },
        "y": {
          "field": "total_donations",
          "type": "quantitative",
          "title": "Total Donations",
          "stack": "zero"
        },
        "color": {
          "field": "blood_type",
          "type": "nominal",
          "scale": {
            "range": ["#bfdbf6", "#4da6d6", "#1c5a99", "#03214e"]  // lightest to darkest
          },
          "legend": { 
            "title": "Blood Type",
            "titleFontWeight": "normal",
            "orient": "top",
            "direction": "horizontal",
            "titleOrient": "left"
          }
        },
        "tooltip": [
          { "field": "year", "type": "temporal", "format": "%Y" },
          { "field": "blood_type" },
          { "field": "total_donations" }
        ]
      }
    },
    {
      "title": "Overview (Brush here)",
      "width": "container",
      "height": 50,
      "params": [
        {
          "name": "brush",
          "select": { "type": "interval", "encodings": ["x"] }
        }
      ],
      "mark": { 
        "type": "area", 
        "interpolate": "monotone", 
        "opacity": 0.7 
      },
      "encoding": {
        "x": { "field": "year", "type": "temporal", "title": "" },
        "y": {
          "field": "total_donations",
          "type": "quantitative",
          "axis": { "tickCount": 3, "grid": false },
          "title": ""
        },
        "color": {
          "field": "blood_type",
          "type": "nominal",
          "scale": {
            "range": ["#bfdbf6", "#4da6d6", "#1c5a99", "#03214e"]
          },
          "legend": null
        }
      }
    }
  ],
  "autosize": { "type": "fit-x", "contains": "padding" }
};

vegaEmbed("#areaChart", areaChart, { actions: false });