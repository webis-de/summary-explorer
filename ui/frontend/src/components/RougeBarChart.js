/* eslint-disable */
import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";

class RougeBarChart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.draw();
  }

  draw = () => {
    const { article_id, models } = this.props;

    const node = ReactDOM.findDOMNode(this);
    const divWidth = node.getBoundingClientRect().width - 20;

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 20, left: 45 };
    const width = divWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select("#rouge_scores_barchart").select("svg").remove();
    const svg = d3
      .select("#rouge_scores_barchart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // Build X scales and axis:
    // let xAxis = d3.scaleLinear()
    //     .domain([0, scores.max_score])
    //     .range([0, width]);

    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xAxis));

    // Assign each model an unique color
    const color = d3.scaleOrdinal(d3["schemeCategory20"]);
    let models_colors = {};
    models.map((m, idx) => {
      models_colors[m.smodel] = color(idx);
    });

    // // And apply this function to data to get the bins
    // let bins = scores.bins
    // let yAxis = d3.scaleLinear()
    //     .range([height, 0]);

    // yAxis.domain([0, d3.max(bins, function(d) { return d.length_; })]);
    //
    // svg.append("g")
    //     .call(d3.axisLeft(yAxis))

    //   // append the bar rectangles to the svg element
    // svg.selectAll("rect")
    //     .data(bins)
    //     .enter()
    //     .append("rect")
    //         .attr("x", 1)
    //         .attr("transform", function(d) { return "translate(" + xAxis(d.x0) + "," + yAxis(d.length_) + ")"; })
    //         .attr("width", function(d) { return Math.max(xAxis(d.x1) - xAxis(d.x0) -1, 0) ; })
    //         .attr("height", function(d) { return height - yAxis(d.length_); })
    //         .style("fill", "#2b6cb0") // "rgb(48, 127, 188)"
  };

  render() {
    const { uid, title } = this.props;
    return (
      <div>
        <div
          id={"histogram_" + uid}
          key={"histogram_k_" + uid}
          className="my-2 rounded bg-white px-4 py-1"
        ></div>
        <div className="text-center text-xs font-semibold text-blue-800">
          {title}
        </div>
      </div>
    );
  }
}

export default RougeBarChart;
