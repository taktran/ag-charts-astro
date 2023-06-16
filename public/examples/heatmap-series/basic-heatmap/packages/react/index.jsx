"use strict";

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import "ag-charts-enterprise";

class ChartExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        data: getData(),
        title: {
          text: "UK monthly mean temperature °C",
        },
        series: [
          {
            type: "heatmap",
            xKey: "month",
            xName: "Month",
            yKey: "year",
            yName: "Year",
            colorKey: "temperature",
            colorName: "Temperature",
            colorRange: ["aliceblue", "orange"],
          },
        ],
      },
    };
  }

  componentDidMount() {}

  render() {
    return <AgChartsReact options={this.state.options} />;
  }
}

const root = createRoot(document.getElementById("root"));
root.render(<ChartExample />);
