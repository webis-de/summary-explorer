/* eslint-disable */
import React from "react";

import { get } from "../request";
import LoadingIcon from "./icons/LoadingIcon";
import ListBoxModels from "./ListBoxModels";
import PopoverDiv from "./Popover";
import RougeScoreBlock from "./RougeScoreBlock";

class SummaryBlockEntities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article_id: this.props.article_id,
      api_summary_url: "/api/summary/",

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
    const url = `${api_summary_url}${article_id}/${model_id}`;
    get(url).then((data) => {
      const { sentences, novelWords } = data[0].raw;
      const { model_info } = data[0];
      this.setState({
        summ_model: model_id,
        sentences,
        novelWords,
        model_info,
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
    this.enable_highlight("lexical_alignment_candidates_mean_rouge");
    this.setState({
      active_buttons: { lexical: true, bert: false, spacy: false },
    });
  };

  enable_highlight = (k) => {
    const { sentences } = this.state;
    const colors = [
      "bg-blue-200",
      "bg-red-200",
      "bg-green-200",
      "bg-pink-200",
      "bg-yellow-200",
      "bg-orange-200",
    ];
    let article_sentences = {};
    let summ_sentences = {};

    sentences.map((sentence, idx) => {
      summ_sentences[sentence.sent_id] = colors[idx];
      sentence[k].map((elm) => {
        article_sentences[elm["article_sent_id"]] = colors[idx];
      });
    });
    this.setState({
      selected_sentences: summ_sentences,
    });
    this.props.highlight_article_sentences(
      article_sentences,
      this.state.summ_model
    );
  };

  enable_semantic_bert = () => {
    this.enable_highlight("semantic_similarity_candidates_bert_score");
    this.setState({
      active_buttons: { lexical: false, bert: true, spacy: false },
    });
  };

  enable_semantic_spacy = () => {
    this.enable_highlight("semantic_similarity_candidates_spacy");
    this.setState({
      active_buttons: { lexical: false, bert: false, spacy: true },
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
                  {showModelsList && (
                    <ListBoxModels
                      selected_model={summ_model}
                      s_models={this.props.all_models}
                      handleSelect={this.loadSummary}
                    />
                  )}
                </span>
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
                {/*    /!*Remove Block*!/*/}
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
                          : "";
                      let start = 0;
                      let arr = "";
                      for (let i = 0; i < sentence.entities.length; i++) {
                        // new entitiy
                        let substring = sentence.text.slice(
                          start,
                          sentence.entities[i][2]
                        );
                        arr += substring;
                        substring = sentence.text.slice(
                          sentence.entities[i][2],
                          sentence.entities[i][3]
                        );
                        if (
                          this.props.article_entities.includes(
                            substring.toLowerCase()
                          )
                        )
                          arr +=
                            "<span class='text-green-600'><b>" +
                            substring +
                            "</b></span>";
                        else
                          arr +=
                            "<span class='text-red-600'><b>" +
                            substring +
                            "</b></span>";
                        start = sentence.entities[i][3];
                      }
                      if (start < sentence.text.length)
                        arr += sentence.text.slice(start);
                      return (
                        <span
                          key={summ_model + "_sent_" + sentence.sent_id}
                          className={bg}
                          dangerouslySetInnerHTML={{ __html: arr + ". " }}
                        >
                          {/*{sentence.text +" "}*/}
                          {/*{arr +" "}*/}
                        </span>
                      );
                    })}
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

export default SummaryBlockEntities;
