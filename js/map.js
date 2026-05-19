// js/map.js

const geoPath = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/malaysia.geojson';
const csvPath = 'data/set2.csv';

// Mock population data (in thousands) for Malaysia states to calculate rate per 1k.
// Replace these with your actual 2015-2025 state population stats!
const statePopulations = {
  "Johor": 4000, "Kedah": 2200, "Kelantan": 1900, "Melaka": 1000,
  "Negeri Sembilan": 1200, "Pahang": 1600, "Perak": 2500, "Perlis": 300,
  "Pulau Pinang": 1800, "Sabah": 3400, "Sarawak": 2500, "Selangor": 7000,
  "Terengganu": 1200, "W.P. Kuala Lumpur": 2000, "W.P. Labuan": 100, "W.P. Putrajaya": 120
};

Promise.all([
  fetch(geoPath).then(r => r.json()),
  fetch(csvPath).then(r => r.text())
])
.then(([geojson, csvText]) => {

  const rows = d3.csvParse(csvText);

  // 1. Group and Aggregate donations by State AND Year
  const donationsByStateYear = {};
  const yearsSet = new Set();

  rows.forEach(d => {
    const parts = d.date.split('/');
    const year = parts[parts.length - 1];
    if (!year) return;

    yearsSet.add(year);
    const key = `${d.state}_${year}`;
    donationsByStateYear[key] = (donationsByStateYear[key] || 0) + (+d.donations);
  });

  const sortedYears = Array.from(yearsSet).sort();

  // 2. Create the "Long" dataset with calculated Rate per 1,000 people
  const mapData = [];
  sortedYears.forEach(year => {
    geojson.features.forEach(f => {
      const stateName = f.properties.name || f.properties.STATE;
      const totalDonations = donationsByStateYear[`${stateName}_${year}`] || 0;
      
      // Get population in thousands (default to 1000 if not found to avoid division by zero)
      const popInThousands = statePopulations[stateName] || 1000; 
      const donationsPer1k = +(totalDonations / popInThousands).toFixed(2);

      mapData.push({
        ...f,
        properties: {
          ...f.properties,
          year: parseInt(year),
          donations: totalDonations,
          donationsPer1k: donationsPer1k,
          stateName: stateName
        }
      });
    });
  });

  // 3. Render map with Year Slider and Quantize/Threshold color blocks
  vegaEmbed('#mapChart', {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 250, 
    "autosize": {"type": "fit", "contains": "padding"},
    "projection": { "type": "mercator" },
    "data": {"values": mapData},
    "params": [
      {
        "name": "yearSlider",
        "value": Math.min(...sortedYears.map(Number)),
        "select": { "type": "point", "fields": ["properties.year"] },
        "bind": {
          "input": "range",
          "min": Math.min(...sortedYears.map(Number)),
          "max": Math.max(...sortedYears.map(Number)),
          "step": 1,
          "name": "Year: "
        }
      }
    ],
    "mark": {"type": "geoshape", "stroke": "#333", "strokeWidth": 0.5},
    "encoding": {
      "opacity": {
        "condition": { "param": "yearSlider", "value": 1 },
        "value": 0
      },
      "color": {
        "field": "properties.donationsPer1k",
        "type": "quantitative",
        // Using a threshold scale turns the legend into discrete labeled boxes 
        "scale": {
          "type": "threshold",
          "domain": [10, 20, 30], // Define boundaries for your 4 classes (e.g. <10, 10-20, 20-30, >30)
          "range": ["#deebf4", "#a1ceeb", "#5ea9d5", "#0f67b5"] // 4 distinct sequential blue shades
        },
        "title": "Donations per 1,000 People",
        "legend": {
          "orient": "bottom",
          "direction": "horizontal",
          "offset": -15,
          "titleFontSize": 12,
          "labelFontSize": 10,
          "symbolType": "square", // Ensures the legend items look like distinct boxes
          "symbolSize": 150
        }
      },
      "tooltip": [
        {"field": "properties.stateName", "type": "nominal", "title": "State"},
        {"field": "properties.donations", "type": "quantitative", "title": "Total Donations"},
        {"field": "properties.donationsPer1k", "type": "quantitative", "title": "Donations per 1k"},
        {"field": "properties.year", "type": "nominal", "title": "Year"}
      ]
    },
    "config": {
        "view": {"stroke": null}
    }
  }).then(res => res.view.run());

})
.catch(err => console.error("Data loading error:", err));