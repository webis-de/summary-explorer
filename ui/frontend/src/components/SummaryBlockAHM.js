import React from 'react';
import '../assets/main.css';
import LoadingIcon from '../assets/images/loading.svg';
import ListBoxModels from "./ListBoxModels";
import PopoverDiv from "./Popover";
import axios from "axios";

class SummaryBlockAHM extends React.Component {

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
            selected_sentence_article_id: this.props.selected_sentence_article_id

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

    render() {
        const {sentences, show_component, novelWords, summ_model,
            showModelsList, summary_loaded, model_info, selected_sentences} = this.state;

        return (
            show_component ?
                    <div className="flex flex-row ">
                        <div className="w-full shadow-xl border bg-white mb-4 rounded-md   hover:border-red-600 hover:border-4">
                        {summary_loaded?
                            <div>
                                <div className="flex items-center mx-4 my-2">
                                    <h2 className="w-1/2  font-extrabold text-normal mb-0 text-blue-900 article_header self-end ">
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
                                            let highlighted = false;
                                            const k = this.props.similarity_type==="lexical"?
                                                "lexical_alignment_candidates_mean_rouge":
                                                "semantic_similarity_candidates_bert_score"
                                            sentence[k].map(elm=>{
                                                if(elm.article_sent_id===this.props.selected_sentence_article_id)
                                                    highlighted=true;
                                            })
                                            let bg = "";
                                            if(highlighted){
                                                bg= this.props.similarity_type==="lexical"?"bg-green-600 text-white":"bg-blue-600 text-white"
                                            }
                                            return (
                                                <span key={summ_model + "_sent_" + sentence.sent_id} className={bg}>
                                                    {sentence.text +" "}
                                                </span>
                                            )})}
                                    </div>
                                </div> :null}

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

export default SummaryBlockAHM;