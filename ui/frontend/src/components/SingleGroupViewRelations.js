/* eslint-disable */
import React from "react";

import { get } from "../request";
import ArticleBlockRelations from "./ArticleBlockRelations";
import ArticleNavigationBar from "./ArticleNavigationBar";
import ErrorMessage from "./ErrorMessage";
import LoadingIcon from "./icons/LoadingIcon";
import ShareButton from "./ShareButton";
import SummaryBlockRelations from "./SummaryBlockRelations";

class SingleGroupViewRelations extends React.Component {
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
      relations: [],
      current_model: null,
      aggregate: false,
      selected_relation: null,
      corpus_upper_bound: { 1: 11448, 2: 10360, 3: 250 },
      error_message: "",
      show_error: false,
      relation_view: true,
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

  set_selected_relation = (s) => {
    this.setState({
      selected_relation: s,
      relation_view: s !== null,
    });
  };

  getArticle = (url) => {
    const { selected_models } = this.props;
    get(url).then((data) => {
      const article = data.raw;
      this.setState({
        article_id: data.article_id,
        sentences: article.sentences,
        article_loaded: true,
        selected_relation: null,
      });
      this.props.setArticleId(data.article_id);
      this.loadGroupSummaries(selected_models);
    });
  };

  loadGroupSummaries = (selected_models) => {
    this.setState({
      models_loaded: false,
    });
    const url = `/api/article/relations?ds_id=${this.state.dataset_id}&id=${
      this.state.article_id
    }&models=${selected_models.join(",")}`;
    get(url).then(
      ({ summaries, smodels, relations_list, unique_hallucinations }) => {
        this.setState({
          models_loaded: true,
          summaries,
          smodels,
          relations: relations_list,
          hallucinations: unique_hallucinations,
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

  highlight_article_sentences = (sentences, current_model) => {
    // this.reset_highlighting_all_models()
    this.setState({
      selected_sentences: sentences,
      relation_view: false,
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
      "&s=4&m=" +
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
      relations,
      corpus_upper_bound,
      selected_relation,
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
            <div className="ml-4 w-6/12 ">
              <ShareButton copyTextToClipboard={this.copyTextToClipboard} />
            </div>
          </div>
          <div className="flex" id="singleModelViewHalucination">
            <div className="w-6/12 rounded-t-md border bg-white text-left shadow-xl">
              {article_loaded ? (
                <ArticleBlockRelations
                  key="ArticleBlock"
                  json={sentences}
                  relation_view={this.state.relation_view}
                  relations={relations}
                  selected_sentences={this.state.selected_sentences}
                  selected_relation={selected_relation}
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
                        <h2 className="text-normal article_header mb-0  self-end font-extrabold ">
                          <span className="uppercase">Hallucinations</span>
                        </h2>
                      </div>
                      <div className="flex-wrap">
                        <div className="mb-2">
                          {hallucinations.map((h) => {
                            return (
                              <div
                                className="mx-1 mt-2 inline rounded bg-gray-300 px-1 py-1
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
                      {summaries.map((summ) => {
                        return (
                          <div className="mb-2 flex">
                            <div className="text-gray-700inline whitespace-nowrap header_font text-xs font-semibold uppercase">
                              {summ.smodel_id}
                            </div>
                            <div>
                              {summ.novelWords.map((h) => {
                                return (
                                  <div className="mx-1 mt-2 inline rounded bg-gray-300 px-1 py-1 text-xs text-red-700 hover:bg-gray-400">
                                    {h.token}
                                    <span className="ml-1 rounded bg-white px-1 text-xs  font-semibold text-red-800">
                                      {h.freq}
                                    </span>{" "}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      {smodels.map((model, i) => {
                        return (
                          <SummaryBlockRelations
                            key={"SummaryView" + i}
                            all_models={this.props.all_models}
                            sentences={model.raw.sentences}
                            model_info={model.model_info}
                            summ_model={model.smodel}
                            novelWords={model.raw.novelWords}
                            article_id={this.state.article_id}
                            current_model={current_model}
                            set_selected_relation={this.set_selected_relation}
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

export default SingleGroupViewRelations;
