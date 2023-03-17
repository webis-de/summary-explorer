/* eslint-disable */
import React from "react";

import { get } from "../request";
import ArticleBlockEntities from "./ArticleBlockEntities";
import ArticleNavigationBar from "./ArticleNavigationBar";
import ErrorMessage from "./ErrorMessage";
import LoadingIcon from "./icons/LoadingIcon";
import ShareButton from "./ShareButton";
import SummaryBlockEntities from "./SummaryBlockEntities";

class SingleGroupViewEntity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api_summary_url: `/api/summary/`,
      api_article_url: `/api/article/`,

      article_id: this.props.article_id,
      dataset_id: this.props.dataset_id,
      selected_models: this.props.selected_models,

      selected_sentences: {},
      models_selected_sentences: {},

      hallucinations: [],
      models_loaded: false,
      smodels: [],
      entities: [],
      current_model: null,
      aggregate: false,
      corpus_upper_bound: { 1: 11448, 2: 10360, 3: 250 },
      error_message: "",
      show_error: false,
      missing_entities: [],
      article_entities: [],
    };
  }

  componentDidMount() {
    this.loadArticle(this.props.article_id, this.props.dataset_id);
  }

  loadArticle = (article_id, ds_id) => {
    this.setState({
      article_loaded: false,
      models_loaded: false,
    });
    let url = `${this.state.api_article_url}${article_id}/${ds_id}`;
    if (article_id === -1) {
      url = `/api/article/${this.state.dataset_id}/random`;
    }
    this.getArticle(url);
    this.resetArticleParameters();
  };

  resetArticleParameters = () => {
    this.setState({
      selected_sentences: {},
    });
  };

  getArticle = (url) => {
    const { selected_models } = this.props;
    get(url).then(({ article_id, raw: { sentences } }) => {
      this.setState({
        article_id,
        sentences,
        article_loaded: true,
      });
      this.props.setArticleId(article_id);
      this.loadGroupSummaries(selected_models);
    });
  };

  loadGroupSummaries = (selected_models) => {
    this.setState({
      models_loaded: false,
    });
    const url = `/api/article/entities?ds_id=${this.state.dataset_id}&id=${
      this.state.article_id
    }&models=${selected_models.join(",")}`;
    get(url).then(
      ({ smodels, entities, missing_entities, article_entities }) => {
        this.setState({
          models_loaded: true,
          smodels,
          entities,
          missing_entities,
          article_entities,
        });
      }
    );
  };

  toggleAggregate = () => {
    this.setState({
      aggregate: !this.state.aggregate,
    });
  };

  loadArticleUserInput = () => {
    const { dataset_id, corpus_upper_bound } = this.state;
    let article_id = document.getElementById("article_id_input").value;
    if (
      !isNaN(article_id) &&
      article_id >= this.props.dataset_boundaries["article_id__min"] &&
      article_id <= this.props.dataset_boundaries["article_id__max"]
    ) {
      this.loadArticle(article_id, dataset_id);
    } else {
      this.setState({
        error_message:
          "Article ID should be a number between " +
          this.props.dataset_boundaries["article_id__min"] +
          " and " +
          this.props.dataset_boundaries["article_id__max"],
        show_error: true,
      });
      document.getElementById("article_id_input").value = article_id;
    }
  };

  closeErrorMessage = () => {
    this.setState({
      error_message: "",
      show_error: false,
    });
  };

  copyTextToClipboard = () => {
    const { dataset_id, article_id } = this.state;
    const external_link =
      window.location.origin +
      "/article?ds=" +
      dataset_id +
      "&a=" +
      article_id +
      "&s=3&m=" +
      this.props.selected_models.join(",");
    navigator.clipboard.writeText(external_link);
  };

  render() {
    const {
      article_loaded,
      models_loaded,
      sentences,
      smodels,
      current_model,
      dataset_id,
      entities,
      aggregate,
      corpus_upper_bound,
      article_id,
    } = this.state;
    return (
      <div>
        <div className="left-0 w-full justify-end p-1 text-left text-sm ">
          <div className="mb-1 flex w-full px-0 py-0">
            <div className="w-6/12 items-end">
              {article_loaded ? (
                <ArticleNavigationBar
                  article_id={article_id}
                  dataset_boundaries={this.props.dataset_boundaries}
                  dataset_id={dataset_id}
                  loadArticleUserInput={this.loadArticleUserInput}
                  loadArticle={this.loadArticle}
                  copyTextToClipboard={this.copyTextToClipboard}
                />
              ) : null}
              {this.state.show_error ? (
                <ErrorMessage
                  error_message={this.state.error_message}
                  closeErrorMessage={this.closeErrorMessage}
                />
              ) : null}
            </div>
            <div className="ml-4 flex w-6/12">
              {models_loaded ? (
                <div className="w-1/2">
                  <button
                    onClick={() => {
                      this.toggleAggregate();
                    }}
                    className={
                      "mr-1 rounded px-1 py-1 text-xs hover:bg-red-700 hover:text-white focus:outline-none" +
                      (aggregate
                        ? " bg-gray-400  text-gray-800"
                        : " bg-blue-800  text-white")
                    }
                  >
                    Show Summaries
                  </button>
                  <button
                    onClick={() => {
                      this.toggleAggregate();
                    }}
                    className={
                      "mr-1 rounded px-1 py-1 text-xs hover:bg-red-700 hover:text-white focus:outline-none" +
                      (aggregate
                        ? " bg-blue-800  text-white"
                        : " bg-gray-400  text-gray-800")
                    }
                  >
                    Aggregate Entities
                  </button>
                </div>
              ) : null}
              <div className="w-1/2">
                <ShareButton copyTextToClipboard={this.copyTextToClipboard} />
              </div>
            </div>
          </div>
          <div className="flex" id="singleModelViewHalucination">
            <div className="w-6/12 rounded-t-md border bg-white text-left shadow-xl">
              {article_loaded ? (
                <ArticleBlockEntities
                  key="ArticleBlock"
                  json={sentences}
                  selected_sentences={this.state.selected_sentences}
                  article_id={this.state.article_id}
                  missing_entities={this.state.missing_entities}
                />
              ) : (
                <div className="w-full rounded-t-md border bg-white text-left shadow-xl">
                  <div className="m-auto block p-5">
                    <LoadingIcon />
                  </div>
                </div>
              )}
            </div>
            <div className="ml-4 w-6/12 text-left">
              {models_loaded ? (
                <div>
                  {aggregate ? (
                    <div className="mb-2 w-full flex-wrap rounded-md border bg-white py-2 px-4 leading-loose shadow-xl  hover:border-4 hover:border-yellow-600">
                      <div className="flex ">
                        <h2 className="text-normal article_header mb-0  self-end font-extrabold ">
                          <span className="header_font uppercase text-blue-900">
                            Covered Article Entities
                          </span>
                        </h2>
                      </div>
                      <div className="flex-wrap">
                        {entities.map((h) => {
                          return (
                            <div
                              className="mt-2 mb-2 mr-1 inline rounded bg-green-700 px-1 py-1
                                         py-0 text-xs text-white hover:bg-green-800 "
                            >
                              {h[0][0]}
                              <sub
                                className="text-xs font-bold text-yellow-300"
                                style={{ fontSize: "5pt" }}
                              >
                                {h[0][1]}
                              </sub>
                              <span className="ml-1 rounded bg-white px-1 text-xs font-semibold text-green-800">
                                {h[1]}
                              </span>{" "}
                            </div>
                          );
                        })}
                        {entities.length === 0 ? (
                          <span className="text-xs text-gray-600 ">
                            {" "}
                            Summaries don't contain any entities!
                          </span>
                        ) : null}
                        <div className="mt-2 table">
                          {smodels.map((summ) => {
                            return summ.raw["entities"].length > 0 ? (
                              <div className="mt-2 mb-2 flex table-row border-t border-gray-200 pt-2">
                                <div className="whitespace-nowrap header_font inline table-cell text-xs font-semibold uppercase text-blue-900">
                                  {summ["smodel"]}
                                </div>
                                <div className="table-cell border-t border-gray-200 py-2">
                                  {summ.raw["entities"].map((h) => {
                                    return (
                                      <div className="mx-1 mt-2 inline rounded bg-green-700 px-1 py-1 text-xs text-white hover:bg-green-800">
                                        {h["text"]}
                                        <sub
                                          className="ml-1 text-xs font-bold text-yellow-300"
                                          style={{ fontSize: "5pt" }}
                                        >
                                          {h["type"]}
                                        </sub>
                                        <span className="ml-1 rounded bg-white px-1 text-xs font-semibold text-green-800">
                                          {h["frequency"]}
                                        </span>{" "}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {smodels.map((model, i) => {
                        return (
                          <SummaryBlockEntities
                            key={"SummaryView" + i}
                            all_models={this.props.all_models}
                            sentences={model.raw.sentences}
                            model_info={model.model_info}
                            summ_model={model.smodel}
                            novelWords={model.raw.novelWords}
                            article_id={this.state.article_id}
                            current_model={current_model}
                            article_entities={this.state.article_entities}
                            highlight_article_sentences={
                              this.highlight_article_sentences
                            }
                            rouge_score={model.raw.rouge_score}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full rounded-t-md border bg-white text-left shadow-xl">
                  <div className="m-auto block p-5">
                    <LoadingIcon />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SingleGroupViewEntity;
