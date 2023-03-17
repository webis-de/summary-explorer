/* eslint-disable */
import React from "react";

import { get } from "../request";
import ArticleBlock from "./ArticleBlock";
import ArticleNavigationBar from "./ArticleNavigationBar";
import ErrorMessage from "./ErrorMessage";
import LoadingIcon from "./icons/LoadingIcon";
import ShareButton from "./ShareButton";
import SummaryBlock from "./SummaryBlock";

class SingleGroupView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api_summary_url: "/api/summary/",
      api_article_url: "/api/article/",

      article_id: this.props.article_id,
      dataset_id: this.props.dataset_id,
      selected_models: this.props.selected_models,

      selected_sentences: {},
      models_selected_sentences: {},
      active_buttons: { lexical: false, bert: false, spacy: false },

      models_loaded: false,
      smodels: [],
      current_model: null,

      highlighted_sentences: [],
      corpus_upper_bound: { 1: 11448, 2: 10360, 3: 250 },
      error_message: "",
      show_error: false,
      loading_error: false,
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

  resetArticleParameters = () => {
    this.setState({
      selected_sentences: {},
    });
  };

  getArticle = (url) => {
    const { selected_models } = this.props;
    const parent = this;
    get(url)
      .then(({ article_id, raw: { sentences } }) => {
        this.setState({
          article_id,
          sentences,
          article_loaded: true,
        });
        this.props.setArticleId(article_id);
        this.loadGroupSummaries(selected_models);
      })
      .catch(() => {
        parent.setState({
          loading_error: true,
          article_loaded: false,
          models_loaded: false,
        });
      });
  };

  loadGroupSummaries = (selected_models) => {
    this.setState({
      models_loaded: false,
    });
    const url = `/api/articleModelGroup?ds_id=${this.state.dataset_id}&id=${
      this.state.article_id
    }&models=${selected_models.join(",")}`;
    get(url).then((smodels) => {
      this.setState({
        models_loaded: true,
        smodels,
      });
    });
  };

  highlight_article_sentences = (sentences, current_model) => {
    this.setState({
      selected_sentences: sentences,
      current_model: current_model,
    });
  };

  resetHighlightingAllModels = () => {
    this.setState({
      active_buttons: { lexical: false, bert: false, spacy: false },
      models_selected_sentences: {},
    });
  };

  setHighlighted_sentences = (lst) => {
    this.setState({
      highlighted_sentences: lst,
    });
  };

  loadArticleUserInput = () => {
    const { dataset_id, corpus_upper_bound, article_id } = this.state;
    let art_id = document.getElementById("article_id_input").value;
    if (
      !isNaN(art_id) &&
      art_id >= this.props.dataset_boundaries["article_id__min"] &&
      art_id <= this.props.dataset_boundaries["article_id__max"]
    ) {
      this.loadArticle(art_id, dataset_id);
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
      "&s=1&m=" +
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
      highlighted_sentences,
      article_id,
      loading_error,
      active_buttons,
      models_selected_sentences,
      corpus_upper_bound,
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
                />
              ) : null}
              {this.state.show_error ? (
                <ErrorMessage
                  error_message={this.state.error_message}
                  closeErrorMessage={this.closeErrorMessage}
                />
              ) : null}
            </div>
            <div className="w-6/12 ">
              <ShareButton copyTextToClipboard={this.copyTextToClipboard} />
            </div>
          </div>
          <div className="flex" id="singleModelView">
            <div className="w-6/12 rounded-t-md border bg-white text-left shadow-xl">
              {article_loaded ? (
                <ArticleBlock
                  key="ArticleBlock"
                  json={sentences}
                  selected_sentences={this.state.selected_sentences}
                  highlighted_sentences={highlighted_sentences}
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
            <div className="ml-4  w-6/12 text-left">
              {/*<RougeBarChart models={smodels} article_id={this.state.article_id} />*/}
              {models_loaded ? (
                smodels.map((model, i) => {
                  return (
                    <SummaryBlock
                      key="SummaryView"
                      setHighlighted_sentences={this.setHighlighted_sentences}
                      all_models={this.props.all_models}
                      sentences={model.raw.sentences}
                      model_info={model.model_info}
                      summ_model={model.smodel}
                      novelWords={model.raw.novelWords}
                      article_id={this.state.article_id}
                      current_model={current_model}
                      highlight_article_sentences={
                        this.highlight_article_sentences
                      }
                      rouge_score={model.raw.rouge_score}
                    />
                  );
                })
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

export default SingleGroupView;
