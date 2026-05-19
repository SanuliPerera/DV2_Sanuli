// js/heatmapWithMargins.js
const dataPath = 'data/combined.csv';

fetch(dataPath)
  .then(r => r.text())
  .then(csvText => {
    const rows = d3.csvParse(csvText);

    rows.forEach(d => {
      d.date = +d.date;
      d.donations = +d.donations;
      d.pledges = +d.pledges;
      d.total = d.donations + d.pledges;
    });

    const container = document.getElementById('heatmapWithMargins');

    container.innerHTML = `
      <div style="
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: end;
        width: 685px; 
        font-family: Inter, sans-serif;
        margin-bottom: -25px; 
        position: relative;
        z-index: 10;
      ">
        <div id="legendPlaceholder"></div>

        <label style="
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 8px; 
          cursor: pointer;
          user-select: none;
          pointer-events: auto;
        ">
          Exclude W.P. Kuala Lumpur
          <input type="checkbox" id="excludeKLCheckbox" style="margin:0;">
        </label>
      </div>

      <div id="heatmapChart" style="position: relative; z-index: 1;"></div>
    `;

    const checkbox = document.getElementById("excludeKLCheckbox");

    function renderHeatmap(excludeKL) {
      const filteredRows = excludeKL
        ? rows.filter(d => d.state !== "W.P. Kuala Lumpur")
        : rows;

      const maxTotal = d3.max(filteredRows, d => d.total);
      const threshold = maxTotal / 2;

      const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { values: filteredRows },

        // ✅ uniform outer padding
        padding: { top: 5, left: 5, right: 5, bottom: 5 },

        autosize: { type: "fit", contains: "padding" },

        config: {
          view: { stroke: null },
          axis: {
            grid: false,
            domain: false,
            ticks: false,
            labelFontSize: 11
          }
        },

        // ✅ FIX A: Master spacing for horizontal concat (Heatmap Column <-> Right Bars)
        spacing: 10,

        resolve: { scale: { y: "shared" } },

        hconcat: [
          {
            // ✅ FIX B: Force the vertical layout engine to flush boundaries 
            // and use a matching 10px layout gap for the bottom marginal bar.
            vconcat: [
              {
                name: "main_heatmap",
                width: 580,
                height: 180,

                encoding: {
                  x: {
                    field: "date",
                    type: "ordinal",
                    title: null,
                    axis: {
                      orient: "top",
                      labelAngle: 0,
                      labelPadding: 10
                    }
                  },
                  y: {
                    field: "state",
                    type: "ordinal",
                    title: null,
                    sort: { op: "sum", field: "total", order: "descending" }
                  }
                },

                layer: [
                  {
                    mark: {
                      type: "rect",
                      stroke: "white",
                      strokeWidth: 0.5
                    },
                    encoding: {
                      color: {
                        field: "total",
                        type: "quantitative",
                        scale: { scheme: "purples" },
                        legend: {
                          title: "Total Amount",
                          orient: "top",
                          direction: "horizontal",
                          gradientLength: 160,
                          legendX: 0,
                          legendY: -12,
                          titleFontSize: 12,
                          labelFontSize: 11,
                          titlePadding: 4
                        }
                      },
                      tooltip: [
                        { field: "state", title: "State" },
                        { field: "date", title: "Year" },
                        { field: "total", title: "Total", format: "," }
                      ]
                    }
                  },
                  {
                    mark: {
                      type: "text",
                      baseline: "middle",
                      fontSize: 9,
                      fontWeight: "bold"
                    },
                    encoding: {
                      text: { field: "total", type: "quantitative", format: ".2s" },
                      color: {
                        condition: {
                          test: `datum.total !== null && datum.total > ${threshold}`,
                          value: "white"
                        },
                        value: "black"
                      }
                    }
                  }
                ]
              },

              {
                /* --- BOTTOM MARGINAL BARS --- */
                width: 580,
                height: 50,

                padding: { top: 0, left: 0, right: 0, bottom: 0 },

                encoding: {
                  x: { field: "date", type: "ordinal", axis: null },
                  y: {
                    aggregate: "sum",
                    field: "total",
                    axis: null,
                    scale: { reverse: true }
                  }
                },

                layer: [
                  { mark: { type: "bar", color: "#9ca3af" } },
                  {
                    mark: {
                      type: "text",
                      dy: 5,
                      fontSize: 10,
                      baseline: "top"
                    },
                    encoding: {
                      text: { aggregate: "sum", field: "total", format: ".2s" }
                    }
                  }
                ]
              }
            ],
            spacing: 10,       // ✅ Explicitly matches the vertical gap with horizontal gap
            bounds: "flush"    // ✅ Clips unseen component spacing wrappers to isolate standard pixels
          },

          {
            /* --- RIGHT MARGINAL BARS --- */
            width: 160,
            height: 180,

            padding: { top: 0, left: 0, right: 0, bottom: 0 },

            encoding: {
              y: {
                field: "state",
                type: "ordinal",
                axis: null,
                sort: { op: "sum", field: "total", order: "descending" }
              },
              x: { aggregate: "sum", field: "total", axis: null }
            },

            layer: [
              { mark: { type: "bar", color: "#a6a9ae" } },
              {
                mark: {
                  type: "text",
                  dx: 5,
                  align: "left",
                  fontSize: 10
                },
                encoding: {
                  text: { aggregate: "sum", field: "total", format: ".2s" }
                }
              }
            ]
          }
        ]
      };

      vegaEmbed('#heatmapChart', spec, { actions: false })
        .catch(err => console.error(err));
    }

    renderHeatmap(false);

    checkbox.addEventListener('change', () => {
      renderHeatmap(checkbox.checked);
    });

  })
  .catch(err => console.error(err));