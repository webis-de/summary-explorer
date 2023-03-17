/* eslint-disable */
import * as d3 from "d3";
import React from "react";

class Legend extends React.Component {
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
    const { label_left, label_right, interpolator } = this.props;

    const d3_color_interpolator = interpolator;
    // set the dimensions and margins of the graph
    const margin = { top: 1, right: 3, bottom: 1, left: 3 };
    const width = 140 - margin.left - margin.right;
    const height = 28 - margin.top - margin.bottom;
    const legend_width = 120;
    const legend_height = 12;
    const idGradient = "legendGradient_" + this.props.id_;
    d3.select("#" + this.props.id_)
      .select("svg")
      .remove();
    const svg = d3
      .select("#" + this.props.id_)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 22)
      .text(label_left) // "Low"
      .attr("font-family", "sans-serif")
      .attr("font-size", "8px")
      .attr("fill", d3_color_interpolator(0.9))
      .style("text-anchor", "start");

    svg
      .append("text")
      .attr("x", margin.left + 102)
      .attr("y", 22)
      .text(label_right) // "High"
      .attr("font-family", "sans-serif")
      .attr("font-size", "8px")
      .attr("fill", d3_color_interpolator(0.9))
      .style("text-anchor", "start");

    svg
      .append("g")
      .append("defs")
      .append("linearGradient")
      .attr("id", idGradient)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");
    svg
      .append("rect")
      .attr("fill", "url(#" + idGradient + ")")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", legend_width)
      .attr("height", legend_height);

    const numberHues = 100;
    var deltaPercent = 1 / (numberHues - 1);
    var theData = [];
    for (var i = 0; i < numberHues; i++) {
      var p = deltaPercent * i;
      var clr = d3_color_interpolator(i / numberHues); //d3.interpolateBlues
      theData.push({ rgb: clr, opacity: 1.0, percent: p });
    }

    d3.select("#" + idGradient)
      .selectAll("stop")
      .data(theData)
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.percent;
      })
      .attr("stop-color", function (d) {
        return d.rgb;
      })
      .attr("stop-opacity", function (d) {
        return d.opacity;
      });
  };

  render() {
    return <div id={this.props.id_} className="bg-white "></div>;
  }
}

export default Legend;
