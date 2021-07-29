import React from 'react';
import '../assets/main.css';
import Legend from "./Legend";

class ArticleBlockRelations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            relation_view: this.props.relation_view,
            selected_relation: this.props.selected_relation,
            selected_sentences: this.props.selected_sentences
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.selected_relation !==prevState.selected_relation ||
            this.props.relation_view !==prevState.relation_view ||
            this.props.selected_sentences !==prevState.selected_sentences){
            this.setState({
                relation_view: this.props.relation_view,
                selected_relation: this.props.selected_relation,
                selected_sentences: this.props.selected_sentences
        })
        }

    }

    style_sentence = (sent)=>{
        var html = [];
        var start = 0;
        sent.chunks.map(chunk => {
            html.push(sent.text.slice(start, chunk[2]));
            html.push(<span className={"p-1 " + chunk[1]} title={chunk[1]}>{chunk[0]}</span>);
            start = chunk[3];
        });
        html.push(sent.text.slice(start));
        return html;
    };

    toggleRelationView = (val)=>{
        this.setState({
            relation_view: val
        })
    }

    render() {
        const {relation_view, selected_relation} = this.state;
        const {json, selected_sentences, relations} = this.props;
        return (
            <div>
                <h2 className="flex uppercase font-bold text-normal mb-0 px-4 py-2  text-justify article_header text-blue-900">
                    <span className="w-1/2">
                        ARTICLE {this.props.article_id}
                    </span>
                    <div className="flex-end w-1/2  text-right mr-1">
                        <button className={"inline text-xs px-1 py-1 text-xs rounded mr-1 hover:text-white focus:outline-none " +
                        "hover:bg-blue-700" + (this.state.relation_view?" bg-gray-200  text-gray-600 ":" bg-blue-800  text-white ") }
                        onClick={()=>{this.toggleRelationView(false)}}>
                            Text
                        </button>
                        <button className={"inline text-xs px-1 py-1 text-xs rounded mr-1 hover:text-white focus:outline-none " +
                        "hover:bg-blue-700" + (this.state.relation_view?" bg-blue-800  text-white ": " bg-gray-200  text-gray-600 ") }
                        onClick={()=>{this.toggleRelationView(true)}}>
                            Relations
                        </button>
                    </div>
                </h2>
                <div className="px-4 text-sm text-left leading-relaxed  pb-2">
                    <div style={{fontFamily: "Verdana, serif"}}>
                        {relation_view?
                           relations.map(rel =>{
                               return (<div>
                                   {selected_relation===null || selected_relation===rel.text.toLowerCase()?
                                            <div>
                                                 <span>{rel.subject+ " "}</span>
                                                 <span className="text-orange-600 ">{rel.relation+ " "}</span>
                                                 <span>{rel.object+ " "}</span>
                                             </div>:null}
                                            {selected_relation===rel.text.toLowerCase()?
                                                (<div className="my-1 p-1 mx-3 my-2 bg-gray-100 rounded">
                                                     <div className="pt-2 px-2"
                                                         dangerouslySetInnerHTML={{ __html: rel.context.replace(rel.relation,
                                                                 '<span class="text-orange-600 ">'+rel.relation+"</span>")}}>
                                                     </div>
                                                </div>):null}

                                        </div>)
                                })
                        :
                        json.map(sent => {
                            const bg = sent.sent_id in this.state.selected_sentences?selected_sentences[sent.sent_id]: {}
                            return (
                                 <span id={"sent_" + sent.sent_id} style={bg}>
                                     {sent.text+ ". "}
                                 </span>)
                         })
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default ArticleBlockRelations;