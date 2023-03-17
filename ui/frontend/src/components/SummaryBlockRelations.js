/* eslint-disable */
import React from "react";

import { get } from "../request";
import LoadingIcon from "./icons/LoadingIcon";
import ListBoxModels from "./ListBoxModels";
import PopoverDiv from "./Popover";
import RougeScoreBlock from "./RougeScoreBlock";

class SummaryBlockRelations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article_id: this.props.article_id,
      api_summary_url: `../api/summary/`,

      sentences: this.props.sentences,
      novelWords: this.props.novelWords,
      summ_model: this.props.summ_model,
      model_info: this.props.model_info,

      showModelsList: false,
      summary_loaded: true,
      hide_content: false,
      show_component: true,

      active_buttons: { lexical: false, bert: false, spacy: false },

      selected_sentences: {},
      relation_view: true,
      selected_relation: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.current_model !== this.props.summ_model &&
      Object.keys(prevState.selected_sentences).length !== 0
    ) {
      this.setState({
        active_buttons: { lexical: false, bert: false, spacy: false },
        selected_sentences: {},
      });
    }
  }

  resetView = () => {
    this.setState({
      showModelsList: false,
      summary_loaded: true,
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
    get(`${api_summary_url}${article_id}/${model_id}`).then((data) => {
      const summary = data[0].raw;
      const m_info = data[0].model_info;
      this.setState({
        summ_model: model_id,
        sentences: summary.sentences,
        novelWords: summary.novelWords,
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

  toggleRelationView = (val) => {
    this.setState({
      relation_view: val, //!this.state.relation_view
    });
  };

  setSelectedRelation = (rel, aligned, sent_id) => {
    this.setState({
      selected_relation: rel,
    });
    const param = aligned ? rel : null;
    this.props.set_selected_relation(param);
    if (!aligned) {
      // send parameter to article
      // 1- get related sentences
      let article_sentences = {};
      const k = "semantic_similarity_candidates_bert_score";
      this.state.sentences.map((sentence, idx) => {
        if (sent_id === sentence.sent_id) {
          sentence[k].map((elm) => {
            article_sentences[elm["article_sent_id"]] = {
              backgroundColor: "#ea9999",
              color: "#321a1a",
            };
          });
        }
      });
      this.props.highlight_article_sentences(
        article_sentences,
        this.state.summ_model
      );
    }
  };

  render() {
    const {
      sentences,
      show_component,
      novelWords,
      summ_model,
      relation_view,
      selected_relation,
      showModelsList,
      summary_loaded,
      model_info,
      selected_sentences,
    } = this.state;

    return show_component ? (
      <div className="flex flex-row ">
        <div className="mb-4 w-full rounded-md border bg-white shadow-xl   hover:border-4 hover:border-red-600">
          {summary_loaded ? (
            <div>
              <div className="mx-4 my-2 flex items-center">
                <h2 className="text-normal  article_header mb-0 w-1/2 self-end font-extrabold text-blue-900 ">
                  <span className="uppercase">{summ_model}</span>
                  <PopoverDiv model_info={model_info} />
                </h2>
                <span className="w-1/2 px-2">
                  {showModelsList ? (
                    <ListBoxModels
                      selected_model={summ_model}
                      s_models={this.props.all_models}
                      handleSelect={this.loadSummary}
                    />
                  ) : null}
                </span>
                {/*Change Model*/}
                {/*<span className="float-right text-gray-700 hover:text-red-700 cursor-pointer  pr-2 pt-1" onClick={()=>{this.toggleModelsList()}}>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">*/}
                {/*      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />*/}
                {/*      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />*/}
                {/*    </svg>*/}
                {/*</span>*/}
                <span className="flex">
                  <button
                    className={
                      "mr-1 inline rounded px-1 py-1 text-xs text-xs hover:text-white focus:outline-none " +
                      "hover:bg-blue-700" +
                      (this.state.relation_view
                        ? " bg-gray-200  text-gray-600 "
                        : " bg-blue-800  text-white ")
                    }
                    onClick={() => {
                      this.toggleRelationView(false);
                    }}
                  >
                    Text
                  </button>
                  <button
                    className={
                      "mr-1 inline rounded px-1 py-1 text-xs text-xs hover:text-white focus:outline-none " +
                      "hover:bg-blue-700" +
                      (this.state.relation_view
                        ? " bg-blue-800  text-white "
                        : " bg-gray-200  text-gray-600 ")
                    }
                    onClick={() => {
                      this.toggleRelationView(true);
                    }}
                  >
                    Relations
                  </button>
                </span>

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
              {!this.state.hide_content ? (
                <div>
                  <div className="mt-1 px-4 pb-2">
                    {relation_view
                      ? sentences.map((sent) => {
                          return sent.filtered_relations.map((rel, i) => {
                            return (
                              <div
                                className={
                                  "mb-1 rounded px-2 py-1 " +
                                  (rel.aligned ? "bg-green-200" : "bg-red-200")
                                }
                              >
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    this.setSelectedRelation(
                                      rel.text.toLowerCase(),
                                      rel.aligned,
                                      rel.sent_id
                                    );
                                  }}
                                >
                                  <span>{rel.subject + " "}</span>
                                  <span className="rounded text-orange-600">
                                    {rel.relation + " "}
                                  </span>
                                  <span>{rel.object + " "}</span>
                                </div>
                                {selected_relation ===
                                rel.text.toLowerCase() ? (
                                  <div className="my-1 mx-3 my-2 rounded bg-gray-100 p-1">
                                    <div
                                      className="float-right cursor-pointer  text-red-700 hover:text-red-800"
                                      onClick={() => {
                                        this.setSelectedRelation(null);
                                      }}
                                    >
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
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </div>
                                    <div className="px-2 pt-2">
                                      {rel.context}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            );
                          });
                        })
                      : sentences.map((sent) => {
                          const bg =
                            sent.sent_id in selected_sentences
                              ? selected_sentences[sent.sent_id]
                              : "";
                          return (
                            <span id={"sent_" + sent.sent_id} className={bg}>
                              {sent.text + ". "}
                            </span>
                          );
                        })}
                  </div>
                </div>
              ) : null}
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

export default SummaryBlockRelations;
