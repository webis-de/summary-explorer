/* eslint-disable */
import React from "react";

import { get } from "../request";
import ArticleHeatMap from "./ArticleHeatMap";
import ArticleNavigationBar from "./ArticleNavigationBar";
import ErrorMessage from "./ErrorMessage";
import LoadingIcon from "./icons/LoadingIcon";
import ShareButton from "./ShareButton";
import SummaryBlockAHM from "./SummaryBlockAHM";

class SingleGroupViewArticleHM extends React.Component {
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
      spacy_hm: null,
      bert_hm: null,
      lex_hm: null,
      buttons: { lexical: true, spacy: false, bert: false },
      current_selection: "lexical",
      current_array: null,
      corpus_upper_bound: { 1: 11448, 2: 10360, 3: 250 },
      error_message: "",
      show_error: false,
      selected_sentence_article_id: null,
    };
  }

  set_selected_sentence_article_id = (id) => {
    this.setState({
      selected_sentence_article_id: id,
    });
  };

  componentDidMount() {
    this.loadArticle(this.props.article_id, this.props.dataset_id);
  }

  buttonClicked = (b) => {
    let buttons_ = this.state.buttons;
    Object.keys(buttons_).map(function (keyName, keyIndex) {
      buttons_[keyName] = keyName === b;
    });

    let temp = {
      lexical: this.state.lex_hm,
      spacy: this.state.spacy_hm,
      bert: this.state.bert_hm,
    };
    this.setState({
      buttons: buttons_,
      current_selection: b,
      current_array: temp[b],
    });
  };

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
      selected_sentence_article_id: null,
    });
  };

  getArticle = (url) => {
    const { selected_models } = this.props;
    get(url).then(({ article_id, raw: { sentences } }) => {
      this.setState({
        article_id,
        sentences,
        article_loaded: true,
        selected_sentence_article_id: null,
      });
      this.props.setArticleId(article_id);
      this.loadGroupSummaries(selected_models);
    });
  };

  loadGroupSummaries = (selected_models) => {
    this.setState({
      models_loaded: false,
    });
    const url = `/api/article/heatmap?ds_id=${this.state.dataset_id}&id=${
      this.state.article_id
    }&models=${selected_models.join(",")}`;
    get(url).then(
      ({
        lexical_article_map,
        spacy_article_map,
        bert_article_map,
        smodels,
      }) => {
        let temp = {
          lexical: lexical_article_map,
          spacy: spacy_article_map,
          bert: bert_article_map,
        };
        this.setState({
          models_loaded: true,
          smodels,
          spacy_hm: spacy_article_map,
          bert_hm: bert_article_map,
          lex_hm: lexical_article_map,
          current_array: temp[this.state.current_selection],
        });
      }
    );
  };

  highlight_article_sentences = (sentences, current_model) => {
    // this.reset_highlighting_all_models()
    this.setState({
      selected_sentences: sentences,
      current_model: current_model,
    });
  };

  reset_highlighting_all_models = () => {
    this.setState({
      active_buttons: { lexical: false, bert: false, spacy: false },
      models_selected_sentences: {},
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
      "&s=5&m=" +
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
      current_array,
      article_id,
      lex_hm,
      bert_hm,
      spacy_hm,
      corpus_upper_bound,
      buttons,
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
          {/* <div className="w-1/2 text-right mr-1">*/}
          {/*   <button onClick={()=>{this.buttonClicked('lexical')}}*/}
          {/*       className={'px-1 py-1 text-xxs rounded mr-1 hover:text-white hover:bg-blue-700 outline-none'*/}
          {/*       + (buttons['lexical'] ? " bg-blue-800  text-white":" bg-gray-400  text-gray-800") }>Lexical*/}
          {/*   </button>*/}
          {/*   <button onClick={()=>{this.buttonClicked('bert')}}*/}
          {/*       className={'px-1 py-1 text-xxs rounded mr-1 hover:text-white hover:bg-blue-700 outline-none'*/}
          {/*       + (buttons['bert'] ? " bg-blue-800  text-white":" bg-gray-400  text-gray-800") }>Semantic*/}
          {/*   </button>*/}
          {/*</div>*/}
          <div className="flex" id="singleModelView">
            <div className="w-6/12 rounded-t-md border bg-white text-left shadow-xl">
              {article_loaded && models_loaded && current_array !== null ? (
                <ArticleHeatMap
                  article_id={article_id}
                  set_id={this.set_selected_sentence_article_id}
                  sentences={sentences}
                  buttons={buttons}
                  buttonClicked={this.buttonClicked}
                  sentences_array={current_array}
                  lexical={this.state.current_selection === "lexical"}
                  num_of_summaries={smodels.length}
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
              {models_loaded ? (
                smodels.map((model, i) => {
                  return (
                    <SummaryBlockAHM
                      key="SummaryView"
                      all_models={this.props.all_models}
                      sentences={model.raw.sentences}
                      model_info={model.model_info}
                      summ_model={model.smodel}
                      article_id={this.state.article_id}
                      current_model={current_model}
                      selected_sentence_article_id={
                        this.state.selected_sentence_article_id
                      }
                      similarity_type={this.state.current_selection}
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

export default SingleGroupViewArticleHM;
