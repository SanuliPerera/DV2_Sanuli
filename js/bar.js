const barChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Stable bar chart with sharp corners, year slider, and state focus.",
  
  "autosize": {"type": "fit", "contains": "padding"},
  "width": "container",
  "height": 250,

  "config": {
    "transition": {"duration": 800},
    "view": {"stroke": "transparent"}
  },

  "data": {
    "url": "data/set4.csv",
    "format": {
      "type": "csv",
      "parse": {"date": "date"}
    }
  },

  "params": [
    {
      "name": "selectedYear",
      "value": 2010,
      "bind": {
        "input": "range",
        "min": 2010, 
        "max": 2024, 
        "step": 1,
        "name": "Year: "
      }
    },
    {
      "name": "stateSelection",
      "select": {"type": "point", "fields": ["state"]},
      "bind": {
        "input": "select",
        "options": [
          null, "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", 
          "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah", 
          "Sarawak", "Selangor", "Terengganu", "W.P. Kuala Lumpur", 
          "W.P. Labuan", "W.P. Putrajaya"
        ],
        "labels": [
          "Show All", "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", 
          "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah", 
          "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur", "Labuan", "Putrajaya"
        ],
        "name": "Focus State: "
      }
    }
  ],

  "transform": [
    // FILTER DATA FROM 2010 ONWARDS
    {"filter": "year(datum.date) >= 2010"},

    {"calculate": "year(datum.date)", "as": "dataYear"},

    {
      "joinaggregate": [{"op": "distinct", "field": "dataYear", "as": "total_years_in_dataset"}]
    },
    {
      "joinaggregate": [{"op": "distinct", "field": "dataYear", "as": "years_per_state"}],
      "groupby": ["state"]
    },
    {"filter": "datum.years_per_state === datum.total_years_in_dataset"},
    {"filter": "datum.dataYear == selectedYear"},
    {
      "aggregate": [{"op": "sum", "field": "pledges", "as": "total_pledges"}],
      "groupby": ["state"]
    },
    {
      "window": [{"op": "rank", "as": "rank"}],
      "sort": [{"field": "total_pledges", "order": "descending"}]
    },
    {"filter": "datum.rank <= 10"}
  ],

  "mark": {
    "type": "bar",
    "cursor": "pointer"
  },

  "encoding": {
    "y": {
      "field": "state",
      "type": "ordinal",
      "sort": "-x",
      "title": null
    },
    "x": {
      "field": "total_pledges",
      "type": "quantitative",
      "title": "Total Pledges",
      "scale": {"nice": true, "domainMin": 0}
    },
    "color": {"value": "#F28E2B"},
    "opacity": {
      "condition": {"param": "stateSelection", "value": 1},
      "value": 0.25
    },
    "stroke": {
      "condition": {"param": "stateSelection", "empty": false, "value": "#A15700"},
      "value": null
    },
    "strokeWidth": {"value": 1.5},
    "tooltip": [
      {"field": "state", "title": "State"},
      {"field": "total_pledges", "title": "Total Pledges", "format": ",d"}
    ]
  }
};

vegaEmbed("#barChart", barChart, {actions: false}).catch(console.error);