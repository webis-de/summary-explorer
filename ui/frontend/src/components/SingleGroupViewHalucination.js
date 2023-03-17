/* eslint-disable */
import React from "react";

import { get } from "../request";
import ArticleBlock from "./ArticleBlock";
import ArticleNavigationBar from "./ArticleNavigationBar";
import ErrorMessage from "./ErrorMessage";
import LoadingIcon from "./icons/LoadingIcon";
import ShareButton from "./ShareButton";
import SummaryBlockHalucination2 from "./SummaryBlockHallucinations2";

class SingleGroupViewHalucination extends React.Component {
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
      summaries: [],
      current_model: null,
      aggregate: false,
      corpus_upper_bound: { 1: 11448, 2: 10360, 3: 250 },
      error_message: "",
      show_error: false,
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
    this.reset_article_parameters();
  };

  reset_article_parameters = () => {
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
    const url = `/api/article/halucination?ds_id=${this.state.dataset_id}&id=${
      this.state.article_id
    }&models=${selected_models.join(",")}`;
    get(url).then(({ summaries, smodels, unique_hallucinations }) => {
      this.setState({
        models_loaded: true,
        summaries,
        smodels,
        hallucinations: unique_hallucinations,
      });
    });
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

  setHighlighted_sentences = (lst) => {
    this.setState({
      highlighted_sentences: lst,
    });
  };

  highlight_article_sentences = (sentences, current_model) => {
    // this.reset_highlighting_all_models()
    this.setState({
      selected_sentences: sentences,
      current_model: current_model,
    });
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
      "&s=2&m=" +
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
      hallucinations,
      summaries,
      aggregate,
      article_id,
      active_buttons,
      models_selected_sentences,
      corpus_upper_bound,
    } = this.state;
    return (
      <div>
        <div className="left-0 w-full justify-end p-1 text-left text-sm ">
          <div className="mb-1 flex w-full px-0 py-0">
            <div className="w-6/12 items-end ">
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
                      "mr-1 rounded px-1 py-1 text-xs outline-none hover:bg-red-700 hover:text-white" +
                      (aggregate
                        ? " bg-gray-400  text-gray-800"
                        : " bg-blue-800   text-white")
                    }
                  >
                    Show Summaries
                  </button>
                  <button
                    onClick={() => {
                      this.toggleAggregate();
                    }}
                    className={
                      "mr-1 rounded px-1 py-1 text-xs outline-none hover:bg-red-700 hover:text-white focus:outline-none " +
                      (aggregate
                        ? " bg-blue-800  text-white"
                        : " bg-gray-400  text-gray-800")
                    }
                  >
                    Aggregate Halucinations
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
                <ArticleBlock
                  key="ArticleBlock"
                  json={sentences}
                  selected_sentences={this.state.selected_sentences}
                  article_id={this.state.article_id}
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
                    <div
                      className="mb-2 w-full flex-wrap rounded-md border bg-white py-2 px-4
                                        leading-loose shadow-xl  hover:border-4 hover:border-gray-600"
                    >
                      <div className="flex ">
                        <h2 className="text-normal mb-0 self-end  font-extrabold  text-blue-900 ">
                          <span className="uppercase">Hallucinations</span>
                        </h2>
                      </div>
                      <div className="flex-wrap">
                        <div className="mb-2">
                          {hallucinations.map((h) => {
                            return (
                              <div
                                className="mx-1 mt-2 inline rounded bg-gray-300 px-1  py-1
                                             py-0 text-xs text-red-700 hover:bg-gray-400 "
                              >
                                {h[0]}
                                <span className="ml-1 rounded bg-white px-1 text-xs  font-semibold text-red-800">
                                  {h[1]}
                                </span>{" "}
                              </div>
                            );
                          })}
                        </div>

                        {hallucinations.length === 0 ? (
                          <span className="text-xs text-gray-600 ">
                            {" "}
                            No Hallucinations!
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 table">
                        {summaries.map((summ) => {
                          return (
                            <div className="mb-2 flex table-row">
                              <div
                                className="text-gray-700inline whitespace-nowrap header_font table-cell text-xs
                                                           font-semibold uppercase text-blue-900"
                              >
                                {summ["smodel_id"]}
                              </div>
                              <div className="table-cell border-t border-gray-200 py-2">
                                {summ["novelWords"].map((h) => {
                                  return (
                                    <div className="mx-1 mt-2 inline rounded bg-gray-300 px-1 py-1 text-xs text-red-700 hover:bg-gray-400">
                                      {h["token"]}
                                      <span className="ml-1 rounded bg-white px-1 text-xs  font-semibold text-red-800">
                                        {h["freq"]}
                                      </span>{" "}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {smodels.map((model, i) => {
                        return (
                          <SummaryBlockHalucination2
                            key={"SummaryView" + i}
                            all_models={this.props.all_models}
                            sentences={model.raw.sentences}
                            model_info={model.model_info}
                            summ_model={model.smodel}
                            novelWords={model.raw.novelWords}
                            article_id={this.state.article_id}
                            current_model={current_model}
                            setHighlighted_sentences={
                              this.setHighlighted_sentences
                            }
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

export default SingleGroupViewHalucination;
