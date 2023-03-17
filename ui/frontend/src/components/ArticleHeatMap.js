/* eslint-disable */
import * as d3 from "d3";
import React from "react";

import Legend from "./Legend";

class ArticleHeatMap extends React.Component {
  constructor(props) {
    super(props);
  }

  Color = (v) => {
    const interpolator = this.props.lexical
      ? d3.interpolateGreens
      : d3.interpolateBlues;
    return interpolator(0.5 + v / 2);
  };

  render() {
    const { sentences, sentences_array } = this.props;
    return (
      <div>
        <h2 className="text-normal article_header mb-0 flex px-4  py-2 text-justify text-blue-900">
          <span className="w-1/3 font-bold uppercase">
            ARTICLE {this.props.article_id}
          </span>
          <div className="flex-end mr-1  w-2/3 text-right">
            <div className="float-right flex">
              <div className="float-right flex">
                <span className="text-xxs px-1 py-1">Agreement</span>
              </div>
              {this.props.lexical ? (
                <Legend
                  key="AHMlegend"
                  label_left="Low"
                  label_right="High"
                  id_="articleheatmap_legend"
                  interpolator={d3.interpolateGreens}
                />
              ) : (
                <Legend
                  key="AHMlegend"
                  label_left="Low"
                  label_right="High"
                  id_="articleheatmap_legend"
                  interpolator={d3.interpolateBlues}
                />
              )}

              <div className="flex">
                <button
                  onClick={() => {
                    this.props.buttonClicked("lexical");
                  }}
                  className={
                    "text-xxs mr-1 rounded px-1 py-1 hover:bg-blue-700 hover:text-white focus:outline-none" +
                    (this.props.buttons["lexical"]
                      ? " bg-blue-800  text-white"
                      : " bg-gray-400  text-gray-800")
                  }
                >
                  Lexical
                </button>
                <button
                  onClick={() => {
                    this.props.buttonClicked("bert");
                  }}
                  className={
                    "text-xxs mr-1 rounded px-1 py-1 hover:bg-blue-700 hover:text-white focus:outline-none" +
                    (this.props.buttons["bert"]
                      ? " bg-blue-800  text-white"
                      : " bg-gray-400  text-gray-800")
                  }
                >
                  Semantic
                </button>
              </div>
            </div>
          </div>
        </h2>
        <div className="mb-2 px-4 pb-2 text-left text-sm  leading-relaxed">
          <div style={{ fontFamily: "Verdana, serif" }}>
            {sentences.map((sent) => {
              const score =
                sent.sent_id in sentences_array
                  ? sentences_array[sent.sent_id]
                  : 0;
              const font_color = score > 0 ? "#FFFFFF" : "#000000";
              let label =
                Math.round(score * this.props.num_of_summaries) +
                "/" +
                this.props.num_of_summaries;
              const style = sent.sent_id % 5 === 0 ? "mb-3" : "";
              const fullstop = sent.text.trim().slice(-1) === "." ? "" : ". ";
              return (
                <div className={style + " inline"}>
                  <span
                    id={"sent_" + sent.sent_id}
                    className="mr-1 cursor-pointer"
                    title={label}
                    onClick={() => {
                      this.props.set_id(sent.sent_id);
                    }}
                    style={{
                      backgroundColor:
                        score === 0 ? "#FFFFFF" : this.Color(score),
                      color: font_color,
                    }}
                  >
                    {sent.text + fullstop}
                  </span>
                  {sent.sent_id % 5 === 0 ? <div className="h-3" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ArticleHeatMap;
