/* eslint-disable */
import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";

import { get } from "../request";
import Legend from "./Legend";
import LoadingIcon from "./icons/LoadingIcon";

class ArticlesBarsHeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles_loaded: false,
      dataset_id: this.props.dataset_id,
      model_name: this.props.model_name,
      articles: [],
      selected_metric: "lexical",
    };
    this.loadArticles(this.props.model_name);
  }

  loadArticles = (model_name) => {
    this.setState({
      articles_loaded: false,
    });

    const url = `/api/smodel/${model_name}/${this.state.dataset_id}/articlemaps`;
    get(url).then(({ max_length, articles }) => {
      this.setState({
        articles_loaded: true,
        max_length,
        articles,
      });
      this.drawPanel(this.state.selected_metric);
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.model_name !== this.props.model_name) {
      this.setState({
        articles_loaded: false,
        dataset_id: this.props.dataset_id,
        model_name: this.props.model_name,
        articles: [],
      });
      this.loadArticles(this.props.model_name);
    }
  }

  drawPanel = (selected_metric) => {
    const setArticleId = this.props.setArticleBarsHeatMapSelectedModel;
    const { articles, max_length } = this.state;
    const node = ReactDOM.findDOMNode(this);
    const divWidth = node.getBoundingClientRect().width - 20;
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 3, bottom: 10, left: 3 };
    const width = divWidth - margin.left - margin.right;
    let horizontal_labels_width = 30;

    const cell_height = 10;
    const paddingX = 0;
    const paddingY = 2;
    const labels_color = "#333333";
    const height =
      20 +
      (cell_height + paddingY) * articles.length -
      margin.top -
      margin.bottom;
    const d3_color_interpolator =
      selected_metric === "lexical"
        ? d3.interpolateGreens
        : d3.interpolateBlues;
    d3.select("#articles_heatmap").select("svg").remove();
    const svg = d3
      .select("#articles_heatmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Build X scales and axis:
    let xAxis = d3
      .scaleLinear()
      .range([0, width - horizontal_labels_width])
      .domain([0, max_length]);

    // Tooltip
    let tooltip = d3
      .select("#tooltip_nav")
      .append("div")
      .attr("class", "tooltip_navigation")
      .style("opacity", 0);

    // add labels
    articles.map((article, ind) => {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", function (d) {
          return (
            paddingY / 2 +
            (cell_height + paddingY) / 2 +
            ind * (cell_height + paddingY)
          );
        })
        .text(article.id) //.toUpperCase()
        .attr("font-family", "sans-serif")
        .attr("width", horizontal_labels_width)
        .attr("text-anchor", "end")
        .attr("font-size", "8px")
        .style("cursor", "pointer")
        .attr("fill", labels_color)
        .on("mouseover", function (d) {
          d3.select(this).style("fill", "#9b2c2c").attr("font-weight", "bold");
        })
        .on("mouseout", function (d) {
          d3.select(this).style("fill", labels_color).attr("font-weight", "");
        })
        .on("click", function () {
          setArticleId(article.id);
        });
      let start = 0;
      article.sentences.map((sent, sent_ind) => {
        const cell_width = 30;
        let score = sent.lexical;
        if (selected_metric === "bert") score = sent.bert;
        if (selected_metric === "spacy") score = sent.spacy;
        svg
          .append("rect")
          .attr("class", "bars")
          .attr("y", ind * (cell_height + paddingY))
          .attr("x", horizontal_labels_width + start)
          .attr("width", Math.max(xAxis(sent.len) - paddingX, 0))
          .attr("height", cell_height)
          .style("fill", function () {
            return score === 0 ? "#CCCCCC" : d3_color_interpolator(score);
          });
        start += xAxis(sent.len);
      });
    });
  };

  buttonClicked = (b) => {
    this.setState({
      selected_metric: b,
    });
    this.drawPanel(b);
  };

  render() {
    const { articles_loaded, model_name, selected_metric } = this.state;
    return (
      <div className="my-2 rounded bg-white px-4 py-1">
        <div className="text-normal article_header mb-0 flex px-4 text-justify">
          <div className="flex-end w-1/2 ">
            <span className="mr-5 uppercase  text-blue-900 hover:text-red-800">
              {model_name}
            </span>

            <span className="flex-end mr-1 w-full text-right">
              <button
                onClick={() => {
                  this.buttonClicked("lexical");
                }}
                className={
                  "mr-1 rounded px-1 py-1 text-xs outline-none hover:bg-blue-600 hover:text-white focus:outline-none" +
                  (selected_metric === "lexical"
                    ? " bg-blue-700  text-white"
                    : " bg-gray-300  text-gray-800")
                }
              >
                Lexical
              </button>
              {/*<button onClick={()=>{this.buttonClicked('spacy')}}*/}
              {/*    className={'focus:outline-none px-1 py-1 text-xs rounded mr-1 hover:text-white hover:bg-green-700 outline-none'*/}
              {/*    + (selected_metric==='spacy' ? " bg-blue-700  text-white":" bg-gray-300  text-gray-800") }>Spacy*/}
              {/*</button>*/}
              <button
                onClick={() => {
                  this.buttonClicked("bert");
                }}
                className={
                  "mr-1 rounded px-1 py-1 text-xs outline-none hover:bg-blue-600 hover:text-white focus:outline-none" +
                  (selected_metric === "bert"
                    ? " bg-blue-700  text-white"
                    : " bg-gray-300  text-gray-800")
                }
              >
                Semantic
              </button>
            </span>
          </div>

          <div className="flex-end mr-1  w-1/2 text-right">
            <div className="float-right flex">
              {selected_metric === "lexical" ? (
                <Legend
                  key="HMlegend"
                  id_="HMlegend"
                  label_left="Low"
                  label_right="High"
                  interpolator={d3.interpolateGreens}
                />
              ) : (
                <Legend
                  key="HMlegend2"
                  id_="HMlegend2"
                  label_left="Low"
                  label_right="High"
                  interpolator={d3.interpolateBlues}
                />
              )}
            </div>
            <span
              className="mr-1 cursor-pointer rounded  bg-blue-700 px-1 py-1 text-xs text-white hover:bg-blue-600
                                  hover:bg-red-700"
              onClick={() => {
                this.loadArticles(model_name);
              }}
            >
              Load 50 Random Articles
            </span>
          </div>
        </div>
        {articles_loaded ? (
          <div id="articles_heatmap" />
        ) : (
          <div className="m-auto block p-5">
            <LoadingIcon />
          </div>
        )}

        <div id="tooltip_nav" />
      </div>
    );
  }
}

export default ArticlesBarsHeatMap;
