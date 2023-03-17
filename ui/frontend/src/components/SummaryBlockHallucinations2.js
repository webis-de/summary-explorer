/* eslint-disable */
import * as d3 from "d3";
import React from "react";

import { get } from "../request";
import LoadingIcon from "./icons/LoadingIcon";
import PopoverDiv from "./Popover";
import RougeScoreBlock from "./RougeScoreBlock";

class SummaryBlockHallucinations2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      article_id: this.props.article_id,
      api_summary_url: `/api/summary/`,

      sentences: this.props.sentences,
      novelWords: this.props.novelWords,
      summ_model: this.props.summ_model,
      model_info: this.props.model_info,

      showModelsList: false,
      summary_loaded: true,
      hide_content: false,
      show_component: true,

      active_buttons: "", // {'lexical': false, 'bert': false, 'spacy': false},
      selected_sentences: {},
      article_sentences_highlighted: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    //
    if (
      this.props.current_model !== this.props.summ_model &&
      Object.keys(prevState.selected_sentences).length !== 0
    ) {
      this.setState({
        active_buttons: "", //{'lexical': false, 'bert': false, 'spacy': false},
        selected_sentences: {},
      });
    }
  }

  resetView = () => {
    this.setState({
      showModelsList: false,
      summary_loaded: true,
      article_sentences_highlighted: {},
    });
  };

  toggleModelsList = () => {
    this.setState({
      showModelsList: !this.state.showModelsList,
    });
  };

  loadSummary = (model_id) => {
    this.setState({
      summary_loaded: false,
    });
    const { article_id, api_summary_url } = this.state;
    const url = `${api_summary_url}${article_id}/${model_id}`;
    get(url).then((data) => {
      const { sentences, novelWords } = data[0].raw;
      const m_info = data[0].model_info;
      this.setState({
        summ_model: model_id,
        sentences,
        novelWords,
        model_info: m_info,
      });
      this.resetView();
    });
  };

  toggle_content = () => {
    this.setState({
      hide_content: !this.state.hide_content,
    });
  };

  hide_component = () => {
    this.setState({
      show_component: false,
    });
  };

  enable_lexical = () => {
    this.setState(
      {
        active_buttons: "lexical", //{'lexical': true, 'bert': false, 'spacy': false},
      },
      () => {
        const { selected_sentences } = this.state;
        if (Object.keys(selected_sentences).length === 1)
          this.higlightCorrespondings(
            Object.keys(selected_sentences).map((m) => {
              return parseInt(m);
            })[0]
          );
        else this.enable_highlight("lexical_alignment_candidates_mean_rouge");
      }
    );
  };

  ColorScale = (v, k) => {
    // return d3.scaleSequential(d3.interpolateBlues).domain([0,2])(v);
    if (k === "semantic_similarity_candidates_bert_score")
      return d3.scaleSequential(d3.interpolateBlues).domain([0, 3])(v);
    else return d3.scaleSequential(d3.interpolateGreens).domain([0, 3])(v);
  };

  enable_highlight = (k) => {
    const { sentences } = this.state;
    let article_sentences = {};
    let article_sentences_freq = {};
    let summ_sentences = {};
    const highlight_color =
      k === "semantic_similarity_candidates_bert_score"
        ? { backgroundColor: "rgb(171, 207, 230)", color: "#222222" }
        : { backgroundColor: "#b5dcad", color: "#222222" };

    sentences.map((sentence, idx) => {
      summ_sentences[sentence.sent_id] = highlight_color;
      sentence[k].map((elm) => {
        if (elm["article_sent_id"] in article_sentences_freq)
          article_sentences_freq[elm["article_sent_id"]] += 1;
        else article_sentences_freq[elm["article_sent_id"]] = 1;
      });
    });
    let max_score = 0;
    Object.values(article_sentences_freq).forEach((value) => {
      max_score = value > max_score ? value : max_score;
    });
    Object.entries(article_sentences_freq).forEach(([key, value]) => {
      let score = value / max_score;
      article_sentences[key] = {
        backgroundColor: this.ColorScale(score, k),
        color: "#222222",
      };
    });
    this.setState({
      selected_sentences: summ_sentences,
      article_sentences_highlighted: article_sentences,
    });
    this.props.highlight_article_sentences(
      article_sentences,
      this.state.summ_model
    );
  };

  enable_semantic_bert = () => {
    this.setState(
      {
        active_buttons: "bert", //{'lexical': false, 'bert': true, 'spacy': false},
      },
      () => {
        const { selected_sentences } = this.state;
        if (Object.keys(selected_sentences).length === 1)
          this.higlightCorrespondings(
            Object.keys(selected_sentences).map((m) => {
              return parseInt(m);
            })[0]
          );
        else this.enable_highlight("semantic_similarity_candidates_bert_score");
      }
    );
  };

  enable_semantic_spacy = () => {
    this.enable_highlight("semantic_similarity_candidates_spacy");
    this.setState({
      active_buttons: "spacy", //{'lexical': false, 'bert': false, 'spacy': true},
    });
  };

  higlightCorrespondings = (sent_ids) => {
    const { active_buttons, sentences } = this.state;
    if (!Array.isArray(sent_ids)) sent_ids = [sent_ids];

    const typ =
      active_buttons === "bert"
        ? "semantic_similarity_candidates_bert_score"
        : "lexical_alignment_candidates_mean_rouge";
    let article_sentences_user_selected = [];
    sentences.map((sentence, idx) => {
      sentence[typ].map((elm) => {
        if (sent_ids.includes(sentence.sent_id))
          article_sentences_user_selected.push(elm["article_sent_id"]);
      });
    });
    const highlight_color =
      typ === "semantic_similarity_candidates_bert_score"
        ? { backgroundColor: "rgb(253, 194, 140)", color: "#222222" }
        : { backgroundColor: "#b5dcad", color: "#222222" };
    let article_sentences = {};
    article_sentences_user_selected.map((key) => {
      article_sentences[key] = highlight_color;
    });
    this.props.highlight_article_sentences(
      article_sentences,
      this.state.summ_model
    );
    let buttons =
      typ === "lexical_alignment_candidates_mean_rouge" ? "lexical" : "bert";
    let summ_sentences = {};
    sent_ids.map((sent_id) => {
      summ_sentences[sent_id] = highlight_color;
    });

    this.setState({
      selected_sentences: summ_sentences,
      active_buttons: buttons,
    });
  };

  render() {
    const {
      sentences,
      show_component,
      novelWords,
      summ_model,
      showModelsList,
      summary_loaded,
      model_info,
      selected_sentences,
    } = this.state;
    const novel_tokens_list = novelWords.map((a) => {
      return a.token;
    });
    const cls = showModelsList ? " text-red-600 " : "";
    const highlight_color = { backgroundColor: "#ea9999", color: "#321a1a" };
    const default_button_color = {
      backgroundColor: "#e2e8f0",
      color: "#222222",
    };
    return show_component ? (
      <div className="flex flex-row ">
        <div className="mb-4 w-full rounded-md border bg-white shadow-xl   hover:border-4 hover:border-red-600">
          {summary_loaded ? (
            <div>
              <div className="mx-4 my-2 flex items-center">
                <h2 className="text-normal  article_header mb-0 w-full self-end font-extrabold text-blue-900 ">
                  <span className="uppercase">{summ_model}</span>
                  <PopoverDiv model_info={model_info} />
                  <span className="text-xxs float-right px-2 pt-1">
                    Click on a sentence to align it.
                  </span>
                </h2>

                {/*<span className="w-1/2 px-2">*/}
                {/*    {showModelsList?*/}
                {/*    <ListBoxModels selected_model={summ_model} s_models={this.props.all_models} handleSelect={this.loadSummary}/>: null}*/}
                {/*</span>*/}
                {/*Change Model*/}
                {/*<span className="float-right text-gray-700 hover:text-red-700 cursor-pointer  pr-2 pt-1" onClick={()=>{this.toggleModelsList()}}>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">*/}
                {/*      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />*/}
                {/*      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />*/}
                {/*    </svg>*/}
                {/*</span>*/}
                {/*Hide/Show Icon*/}
                <span
                  className="float-right cursor-pointer pr-1 pt-1  text-gray-700 hover:text-red-700"
                  onClick={() => {
                    this.toggle_content();
                  }}
                >
                  {!this.state.hide_content ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                </span>
                {/*Remove Block*/}
                {/*<span className="float-right text-red-700  hover:text-red-800 cursor-pointer  pr-1 pt-1" onClick={()=>{this.hide_component()}}>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />*/}
                {/*    </svg>*/}
                {/*</span>*/}
              </div>
              {!this.state.hide_content && (
                <div>
                  <div className="mt-1 px-4 pb-2">
                    {sentences.map((sentence) => {
                      const bg =
                        sentence.sent_id in selected_sentences
                          ? selected_sentences[sentence.sent_id]
                          : {};
                      let str = sentence.text;
                      let regex = "/\b(w|')+\b/gim";
                      // let tokens = str.match(/\b(w|')+\b/gim);
                      let tokens = str.split(/\s+/);
                      return (
                        <span
                          key={summ_model + "_sent_" + sentence.sent_id}
                          className={
                            "hover:font-red-600 cursor-pointer hover:bg-yellow-100 hover:underline "
                          }
                          style={bg}
                          onClick={() => {
                            this.higlightCorrespondings(sentence.sent_id);
                          }}
                        >
                          {tokens.map((t) => {
                            const c =
                              novel_tokens_list.includes(t) ||
                              novel_tokens_list.includes(t.toLowerCase())
                                ? " font-semibold text-red-600"
                                : "";
                            return <span className={c}>{t + " "}</span>; //title={t.pos_tags}
                          })}
                          .
                        </span>
                      );
                    })}
                  </div>
                  <div className="mb-1 px-4">
                    <span
                      className={
                        " mr-1 cursor-pointer rounded p-1 text-xs " +
                        (this.state.active_buttons === "lexical"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-800")
                      }
                      onClick={this.enable_lexical}
                    >
                      Lexical
                    </span>
                    {/*<span className={" text-xs rounded p-1 mr-1 cursor-pointer " + (this.state.active_buttons.spacy?"bg-blue-300": "bg-gray-300")}*/}
                    {/*onClick={(e)=>{this.enable_semantic_spacy()}}>Semantic (Spacy)</span>*/}
                    <span
                      className={
                        " mr-1 cursor-pointer rounded p-1 text-xs " +
                        (this.state.active_buttons === "bert"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-800")
                      }
                      onClick={this.enable_semantic_bert}
                    >
                      Semantic
                    </span>
                  </div>
                </div>
              )}
              <RougeScoreBlock rouge_score={this.props.rouge_score} />
            </div>
          ) : (
            <div className="flex">
              <div className="m-auto block p-5">
                <LoadingIcon />
              </div>
            </div>
          )}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

export default SummaryBlockHallucinations2;
