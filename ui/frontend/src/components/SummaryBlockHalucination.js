import React from 'react';
import '../assets/main.css';
import LoadingIcon from '../assets/images/loading.svg';
import ListBoxModels from "./ListBoxModels";
import PopoverDiv from "./Popover";
import axios from "axios";

class SummaryBlockHalucination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            article_id: this.props.article_id,
            api_summary_url : `../api/summary/`,

            sentences: this.props.sentences,
            novelWords: this.props.novelWords,
            summ_model: this.props.summ_model,
            model_info: this.props.model_info,

            showModelsList : false,
            summary_loaded: true,
            hide_content: false,
            show_component: true,

            active_buttons: {'lexical': false, 'bert': false, 'spacy': false},

            selected_sentences: {},

    }
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.current_model !== this.props.summ_model && Object.keys(prevState.selected_sentences).length!==0) {
          this.setState({
            active_buttons: {'lexical': false, 'bert': false, 'spacy': false},
            selected_sentences: {}
        })
      }

    }

    resetView = ()=>{
        this.setState({
            showModelsList : false,
            summary_loaded: true,
        });
    }

    toggleModelsList = ()=>{
        this.setState({
            showModelsList : !this.state.showModelsList,
        });
    }

    loadSummary = (model_id)=>{
        this.setState({
            summary_loaded: false,
        })
        const {article_id, api_summary_url } = this.state;
        const url = api_summary_url+ article_id +"/" + model_id;
        axios.get(url)
            .then(res => {
                const summary = res.data[0].raw;
                const m_info = res.data[0].model_info;
                this.setState({
                                    summ_model: model_id,
                                    sentences: summary.sentences,
                                    novelWords: summary.novelWords,
                                    model_info: m_info
                });
                this.resetView();
              })
    };

    toggle_content = () => {
        this.setState({
            hide_content: ! this.state.hide_content
        })
    }

    hide_component = () => {
        this.setState({
            show_component: false
        })
    }

    enable_lexical = ()=>{
        this.enable_highlight("lexical_alignment_candidates_mean_rouge");
        this.setState({
            active_buttons: {'lexical': true, 'bert': false, 'spacy': false},
        });
    }

    enable_highlight = (k)=>{
        const {sentences} = this.state;
        const colors = ["bg-blue-200", "bg-red-200", "bg-green-200", "bg-pink-200", "bg-yellow-200", "bg-orange-200"];
        let article_sentences = {};
        let summ_sentences = {};

        sentences.map((sentence, idx) => {
            summ_sentences[sentence.sent_id] = colors[idx];
            sentence[k].map(elm=>{
                article_sentences[elm['article_sent_id']] = colors[idx];
            })
        })
        this.setState({
            selected_sentences: summ_sentences
        })
        this.props.highlight_article_sentences(article_sentences, this.state.summ_model);
    }

    enable_semantic_bert = ()=>{
        this.enable_highlight("semantic_similarity_candidates_bert_score");
        this.setState({
            active_buttons: {'lexical': false, 'bert': true, 'spacy': false},
        });
    }

    enable_semantic_spacy= ()=>{
        this.enable_highlight("semantic_similarity_candidates_spacy");
        this.setState({
            active_buttons: {'lexical': false, 'bert': false, 'spacy': true},
        });
    }

    render() {
        const {sentences, show_component, novelWords, summ_model,
            showModelsList, summary_loaded, model_info, selected_sentences} = this.state;
        const novel_tokens_list = novelWords.map(a => {return a.token})
        const cls = showModelsList?" text-red-600 " : "";

        return (
            show_component ?
                    <div className="flex flex-row ">
                        <div className="w-full shadow-xl border bg-white mb-4 rounded-md   hover:border-red-600 hover:border-4">
                        {summary_loaded?
                            <div>
                                <div className="flex items-center mx-4 my-2">
                                    <h2 className="w-1/2  font-extrabold text-normal mb-0  text-blue-900 article_header self-end ">
                                        <span className="uppercase">{summ_model}</span>
                                        <PopoverDiv model_info={model_info}/>
                                    </h2>
                                <span className="w-1/2 px-2">
                                    {showModelsList?
                                    <ListBoxModels selected_model={summ_model} s_models={this.props.all_models} handleSelect={this.loadSummary}/>: null}
                                </span>
                                    {/*Change Model*/}
                                {/*<span className="float-right text-gray-700 hover:text-red-700 cursor-pointer  pr-2 pt-1" onClick={()=>{this.toggleModelsList()}}>*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">*/}
                                {/*      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />*/}
                                {/*      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />*/}
                                {/*    </svg>*/}
                                {/*</span>*/}
                                    {/*Hide/Show Icon*/}
                                <span className="float-right text-gray-700 hover:text-red-700 cursor-pointer  pr-1 pt-1" onClick={()=>{this.toggle_content()}}>
                                    {!this.state.hide_content?
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>}
                                </span>
                                    {/*Remove Block*/}
                                {/*<span className="float-right text-red-700  hover:text-red-800 cursor-pointer  pr-1 pt-1" onClick={()=>{this.hide_component()}}>*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                                {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />*/}
                                {/*    </svg>*/}
                                {/*</span>*/}
                            </div>
                                {!this.state.hide_content?
                                <div>
                                    <div  className="mt-1 px-4 pb-2">
                                        {sentences.map(sentence => {
                                            const bg = sentence.sent_id in selected_sentences?selected_sentences[sentence.sent_id] : ""
                                            let str = sentence.text
                                            let regex = "/\b(\w|')+\b/gim";
                                            // let tokens = str.match(/\b(w|')+\b/gim);
                                            let tokens = str.split(/\s+/);

                                            return (
                                                <span key={summ_model + "_sent_" + sentence.sent_id} className={bg}>
                                                    {
                                                        tokens.map(t => {
                                                                const c = novel_tokens_list.includes(t) || novel_tokens_list.includes(t.toLowerCase())? " novel_word": "";
                                                                return (<span className={"mr-1 " + c}>{t+ ' '}</span>);  //title={t.pos_tags}
                                                            })
                                                    }
                                                </span>
                                            )}
                                        )}
                                    </div>
                                </div>
                                    :null
                                }

                        </div>
                        :<div className="flex">
                            <div dangerouslySetInnerHTML={{__html: LoadingIcon}} className="p-5 m-auto block" />
                        </div>}
                    </div>
                    </div>
                    : <div/>
        )
    }
}

export default SummaryBlockHalucination;