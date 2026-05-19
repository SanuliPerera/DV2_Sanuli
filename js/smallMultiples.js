const smallMultiples = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "url": "data/set2.csv"
  },
  
  "transform": [
    { "calculate": "toDate(datum.date)", "as": "d" },
    { "filter": "year(datum.d) >= 2010 && year(datum.d) <= 2025" },
    {
      "filter": "indexof(['Selangor','Johor','Penang','Sabah','Perak','Kedah'], datum.state) >= 0"
    },
    {
      "timeUnit": "year",
      "field": "d",
      "as": "year"
    },
    {
      "aggregate": [
        { "op": "sum", "field": "donations", "as": "total_donations" }
      ],
      "groupby": ["year", "state"]
    }
  ],
  "facet": {
    "field": "state",
    "type": "nominal",
    "columns": 3,
    "header": {"title": null, "labelFontWeight": "bold"}
  },
  "spec": {
    "width": 130,
    "height": 100,
    "layer": [
      {
        // --- LAYER 1: The background "ghost" lines ---
        "data": { "url": "data/set2.csv" },
        "transform": [
           { "calculate": "toDate(datum.date)", "as": "d" },
           { "filter": "year(datum.d) >= 2010 && year(datum.d) <= 2025" },
           { "filter": "indexof(['Selangor','Johor','Penang','Sabah','Perak','Kedah'], datum.state) >= 0" },
           { "timeUnit": "year", "field": "d", "as": "year" },
           { "aggregate": [{"op": "sum", "field": "donations", "as": "total_donations"}], "groupby": ["year", "state"]}
        ],
        "mark": {
          "type": "line",
          "interpolate": "monotone",
          "color": "#3f34342a", // Slightly more transparent
          "strokeWidth": 2
        },
        "encoding": {
          "x": { "field": "year", "type": "temporal" },
          "y": { "field": "total_donations", "type": "quantitative" },
          "detail": { "field": "state" }
        }
      },
      {
        // --- LAYER 2: The highlighted "active" line ---
        "mark": {
          "type": "line",
          "interpolate": "monotone",
          "color": "#4C78A8",
          "strokeWidth": 2.5
        },
        "encoding": {
          "x": { "field": "year", "type": "temporal", "title": null },
          "y": { "field": "total_donations", "type": "quantitative", "title": null }
        }
      },
      {
        // --- LAYER 3: Transparent points for easier Tooltip trigger ---
        "params": [{
          "name": "hover",
          "select": {
            "type": "point",
            "on": "mouseover",
            "clear": "mouseout",
            "nearest": true,
            "encodings": ["x"]
          }
        }],
        "mark": {
          "type": "point",
          "size": 80,
          "tooltip": true
        },
        "encoding": {
          "x": { "field": "year", "type": "temporal" },
          "y": { "field": "total_donations", "type": "quantitative" },
          "opacity": {
            "condition": { "param": "hover", "value": 1, "empty": false },
            "value": 0
          },
          "tooltip": [
            { "field": "state", "title": "State" },
            { "field": "year", "type": "temporal", "title": "Year", "format": "%Y" },
            { "field": "total_donations", "title": "Donations", "format": ",.0f" }
          ]
        }
      }
    ]
  },
  "resolve": {
    "scale": { "y": "shared" }
  }
};

vegaEmbed("#smallMultiples", smallMultiples, { actions: false });