import React from 'react';
import '../assets/main.css';
import LoadingIcon from '../assets/images/loading.svg';
import ListBoxModels from "./ListBoxModels";
import PopoverDiv from "./Popover";
import axios from "axios";
import * as d3 from "d3";

class SummaryBlock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            article_id: this.props.article_id,
            api_summary_url : `../api/summary/`,

            sentences: this.props.sentences,
            novelWords: this.props.novelWords,
            summ_model: this.props.summ_model,
            model_info: this.props.model_info,

            show_models_list : false,
            summary_loaded: true,
            hide_content: false,
            show_component: true,

            active_buttons: "", // {'lexical': false, 'bert': false, 'spacy': false},
            selected_sentences: {},
            article_sentences_highlighted: {}

    }
    }
    
    componentDidUpdate(prevProps, prevState) {
        //
      if (this.props.current_model !== this.props.summ_model && Object.keys(prevState.selected_sentences).length!==0) {
          this.setState({
            active_buttons: "", //{'lexical': false, 'bert': false, 'spacy': false},
            selected_sentences: {}
        })
      }
    }

    resetView = ()=>{
        this.setState({
            show_models_list : false,
            summary_loaded: true,
            article_sentences_highlighted: {}
        });
    }

    toggleModelsList = ()=>{
        this.setState({
            show_models_list : !this.state.show_models_list,
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

    toggleContent = () => {
        this.setState({
            hide_content: ! this.state.hide_content
        })
    }

    hideComponent = () => {
        this.setState({
            show_component: false
        })
    }

    enableLexical = ()=>{
        this.setState({
            active_buttons: 'lexical' //{'lexical': true, 'bert': false, 'spacy': false},
        }, ()=>{
            const {selected_sentences} = this.state;
            if (Object.keys(selected_sentences).length === 1)
                this.higlightCorrespondings(Object.keys(selected_sentences).map(m=>{return parseInt(m)})[0])
            else
                this.enableHighlight("lexical_alignment_candidates_mean_rouge");
        });

    }

    ColorScale = (v, k)=> {
        // return d3.scaleSequential(d3.interpolateBlues).domain([0,2])(v);
        if(k==="semantic_similarity_candidates_bert_score")
            return d3.scaleSequential(d3.interpolateBlues).domain([0,3])(v);
        else
            return d3.scaleSequential(d3.interpolateGreens).domain([0,3])(v);
        }

    enableHighlight = (k)=>{
        const {sentences} = this.state;
        let article_sentences = {};
        let article_sentences_freq = {};
        let summ_sentences = {};
        const highlight_color = k==="semantic_similarity_candidates_bert_score"?
            {"backgroundColor":"rgb(171, 207, 230)", "color": "#222222"}:
            {"backgroundColor":"#b5dcad", "color": "#222222"}

        sentences.map((sentence, idx) => {
            summ_sentences[sentence.sent_id] = highlight_color;
            sentence[k].map(elm=>{
                if (elm['article_sent_id'] in article_sentences_freq)
                    article_sentences_freq[elm['article_sent_id']] += 1;
                else
                    article_sentences_freq[elm['article_sent_id']] = 1
            })
        })
        let max_score = 0;
        Object.entries(article_sentences_freq).map(([key, value]) => {
            max_score = value > max_score?value:max_score;
        })
        Object.entries(article_sentences_freq).map(([key, value]) => {
            let score = value/max_score;
            article_sentences[key] = {"backgroundColor":this.ColorScale(score, k), "color": "#222222"};
        })
        this.setState({
            selected_sentences: summ_sentences,
            article_sentences_highlighted: article_sentences,
        })
        this.props.highlight_article_sentences(article_sentences, this.state.summ_model);
    }

    enableSemanticBert = ()=>{
        this.setState({
            active_buttons: 'bert'//{'lexical': false, 'bert': true, 'spacy': false},
        }, ()=>{
            const {selected_sentences} = this.state;
            if (Object.keys(selected_sentences).length === 1)
                this.higlightCorrespondings(Object.keys(selected_sentences).map(m=>{return parseInt(m)})[0])
            else
                this.enableHighlight("semantic_similarity_candidates_bert_score");
        });

    }

    enableSemanticSpacy= ()=>{
        this.enableHighlight("semantic_similarity_candidates_spacy");
        this.setState({
            active_buttons: "spacy"//{'lexical': false, 'bert': false, 'spacy': true},
        });
    }

    higlightCorrespondings = (sent_ids)=>{
        const {active_buttons, sentences} = this.state;
        if(!Array.isArray(sent_ids))
            sent_ids = [sent_ids]
        const typ = active_buttons==="bert"?"semantic_similarity_candidates_bert_score": "lexical_alignment_candidates_mean_rouge";
        let article_sentences_user_selected = []
        sentences.map((sentence, idx) => {
            sentence[typ].map(elm=>{
                if(sent_ids.includes(sentence.sent_id))
                    article_sentences_user_selected.push(elm['article_sent_id'])
            })
        })
        const highlight_color = typ==="semantic_similarity_candidates_bert_score"?
            {"backgroundColor":"rgb(171, 207, 230)", "color": "#222222"}:
            {"backgroundColor":"#b5dcad", "color": "#222222"}
        let article_sentences= {}
        article_sentences_user_selected.map(key=>{
            article_sentences[key] = highlight_color;
        })
        this.props.highlight_article_sentences(article_sentences, this.state.summ_model);
        let buttons = typ==="lexical_alignment_candidates_mean_rouge"?'lexical':'bert'
        let summ_sentences = {};
        sent_ids.map(sent_id=>{summ_sentences[sent_id] = highlight_color})

        this.setState({
            selected_sentences: summ_sentences,
            active_buttons: buttons
        })
    }

    render() {
        const {sentences, show_component, novelWords, summ_model,
            show_models_list, summary_loaded, model_info, selected_sentences} = this.state;
        const novel_tokens_list = novelWords.map(a => {return a.token})
        const cls = show_models_list?" text-red-600 " : "";

        return (
            show_component ?
                    <div className="flex flex-row ">
                        <div className="w-full shadow-xl border bg-white mb-4 rounded-md   hover:border-red-600 hover:border-4">
                        {summary_loaded?
                            <div>
                                <div className="flex items-center mx-4 my-2">
                                    <h2 className="w-full  font-extrabold text-normal mb-0 text-blue-900 article_header self-end ">
                                        <span className="uppercase">{summ_model}</span>
                                        <PopoverDiv model_info={model_info}/>
                                        <span className="pt-1 px-2 text-xxs float-right">
                                            Click on a sentence to align it.
                                        </span>
                                    </h2>

                                {/*<span className="w-1/2 px-2">*/}
                                {/*    {show_models_list?*/}
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
                                <span className="float-right text-gray-700 hover:text-red-700 cursor-pointer  pr-1 pt-1" onClick={()=>{this.toggleContent()}}>
                                    {!this.state.hide_content?
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>}
                                </span>
                                    {/*Remove Block*/}
                                {/*<span className="float-right text-red-700  hover:text-red-800 cursor-pointer  pr-1 pt-1" onClick={()=>{this.hideComponent()}}>*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                                {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />*/}
                                {/*    </svg>*/}
                                {/*</span>*/}
                            </div>
                                {!this.state.hide_content?
                                <div>
                                    <div  className="mt-1 px-4 pb-2 ">
                                {sentences.map(sentence => {
                                const bg = sentence.sent_id in selected_sentences?selected_sentences[sentence.sent_id] : {}
                                return (
                                    <span key={summ_model + "_sent_" + sentence.sent_id}
                                          className={"cursor-pointer hover:underline hover:font-red-600 hover:bg-yellow-100 "}
                                          style={bg}
                                          onClick={()=>{this.higlightCorrespondings(sentence.sent_id)}}
                                    >
                                        {sentence.text +". "}
                                    </span>
                                )})}
                            </div>
                                    <div className="px-4 mb-1">
                                        <span className={" text-xs rounded p-1 mr-1 cursor-pointer "
                                        +(this.state.active_buttons==="lexical"? "bg-blue-800 text-white": "bg-gray-200 text-gray-800")}
                                        onClick={(e)=>{this.enableLexical()}}>Lexical</span>
                                        {/*<span className={" text-xs rounded p-1 mr-1 cursor-pointer " + (this.state.active_buttons.spacy?"bg-blue-300": "bg-gray-300")}*/}
                                        {/*onClick={(e)=>{this.enableSemanticSpacy()}}>Semantic (Spacy)</span>*/}
                                        <span className={" text-xs rounded p-1 mr-1 cursor-pointer "
                                        +(this.state.active_buttons==="bert"? "bg-blue-800 text-white": "bg-gray-200 text-gray-800")}
                                        onClick={(e)=>{this.enableSemanticBert()}}>Semantic</span>
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

export default SummaryBlock;