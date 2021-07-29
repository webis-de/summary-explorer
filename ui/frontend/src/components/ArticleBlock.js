import React from 'react';
import '../assets/main.css';

class ArticleBlock extends React.Component {

    constructor(props) {
        super(props);

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

    render() {
        const {json, selected_sentences} = this.props;
        return (
            <div>
                <h2 className="uppercase font-bold text-normal mb-0 px-4 py-2  text-justify article_header text-blue-900">
                    <span>
                        ARTICLE {this.props.article_id}
                    </span>
                </h2>
                <div className="px-4 text-sm  text-left leading-relaxed pb-2" style={{fontFamily: "Verdana, serif"}}>
                    <div>{
                        json.map((sent, idx) => {
                            const bg = sent.sent_id in selected_sentences?selected_sentences[sent.sent_id] : {}
                            const style = sent.sent_id%5===0?"mb-3": ""
                            const fullstop = sent.text.trim().slice(-1)==="."?"":". "
                            return (
                                <div className={style+" inline"}>
                                 <span id={"sent_" + sent.sent_id} style={bg}>
                                     {sent.text+ fullstop}
                                </span>
                                    {sent.sent_id%5===0?<div className="h-3"/>:null}
                                </div>
                                )
                         })
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default ArticleBlock;