/* eslint-disable */
import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";

class ModelsScores extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawPanel();
  }

  drawPanel = () => {
    const { scores } = this.props;
    const metrics = ["rouge1", "rouge2", "rougeL"]; //'bert',
    const node = ReactDOM.findDOMNode(this);
    const divWidth = node.getBoundingClientRect().width - 20;
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 3, bottom: 10, left: 3 };
    const width = divWidth - margin.left - margin.right;
    const horizontal_labels_width = 60;
    const vertical_labels_height = 90;
    const textlength = scores.length;
    const cell_width = 20; //Math.min(20, (width-textlength) / scores.length);
    const cell_height = 18; //Math.min(20, (width-textlength) / scores.length);
    const paddingX = 2;
    const paddingY = 2;

    const height =
      (cell_width + paddingY) * metrics.length +
      vertical_labels_height -
      margin.top -
      margin.bottom;

    d3.select("#all_models_scores").select("svg").remove();
    const svg = d3
      .select("#all_models_scores")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Build X scales and axis:
    let xAxis = d3
      .scaleLinear()
      .range([0, (cell_width + paddingX) * scores.length])
      .domain([0, scores.length]);

    // Tooltip
    let tooltip = d3
      .select("#tooltip_nav")
      .append("div")
      .attr("class", "tooltip_navigation")
      .style("opacity", 0);

    // add labels
    metrics.map((mod, ind) => {
      svg
        .append("text")
        .attr("x", function (d) {
          return 0;
        })
        .attr("y", function (d) {
          return (
            paddingY / 2 +
            (cell_height + paddingY) / 2 +
            ind * (cell_height + paddingY)
          );
        })
        .text(function (d) {
          return mod.toUpperCase();
        })
        .attr("font-family", "sans-serif")
        .attr("model", mod)
        .attr("font-size", "9px")
        .attr("fill", "#333333");
    });

    scores.map((value, idx) => {
      const y = 5 + (cell_height + paddingY) * metrics.length;
      const xx = horizontal_labels_width + xAxis(idx) + cell_width / 2;
      svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text(value["smodel"])
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "#333333")
        .style("text-anchor", "end")
        //.attr("transform", "")
        .attr("transform", "translate(" + xx + "," + y + "), rotate(-45)");
    });

    const Color = (v) => {
      return d3.interpolateBlues(v);
    };
    const BertColor = (v) => {
      var scale = d3.scaleSequential(d3.interpolateYlOrBr).domain([0.7, 1]);
      return scale(v);
    };

    scores.map((value, idx) => {
      metrics.map((mod, ind) => {
        svg
          .append("rect")
          .attr("class", "bars")
          // .attr("aid", d.article_id)
          // .attr("model", mod)
          .attr("y", ind * (cell_height + paddingY))
          .attr("x", horizontal_labels_width + xAxis(idx))
          .attr("width", cell_width - paddingX)
          .attr("height", cell_height)
          .style("fill", () => {
            return mod === "bert" ? BertColor(value[mod]) : Color(value[mod]);
          })
          .on("mouseover", function (s) {
            tooltip
              .html(
                "<span class='uppercase'>" +
                  mod +
                  " Score</span><br>" +
                  " <b class='uppercase'>  " +
                  value["smodel"] +
                  "  <span class='ml-2 text-lg' >" +
                  value[mod] +
                  "</span></b>"
              )
              .style("left", s.x + "px")
              .style("top", s.pageY - 28 + "px")
              .style("background-color", Color(value[mod]))
              .style("color", function () {
                return value[mod] > 0.7 ? "#FFFFFF" : "#000000";
              });
            tooltip.transition().duration(200).style("opacity", 0.95);
          })
          .on("mouseout", function () {
            tooltip.html("");
            tooltip.transition().duration(200).style("opacity", 0);
          });
      });
    });
  };

  render() {
    return (
      <div>
        <div
          id="all_models_scores"
          className="my-2 rounded bg-white px-4 py-1 shadow-xl"
        ></div>
        <div id="tooltip_nav"></div>
      </div>
    );
  }
}

export default ModelsScores;
