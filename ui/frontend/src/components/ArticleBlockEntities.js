import React from 'react';
import '../assets/main.css';

class ArticleBlockEntities extends React.Component {

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
        const {json, selected_sentences, missing_entities} = this.props;
        return (
            <div>
                <h2 className="uppercase font-bold text-normal mb-0 px-4 py-2  text-justify article_header text-blue-900">
                    <span>
                        ARTICLE {this.props.article_id}
                    </span>
                </h2>
                <div className="px-4 text-sm text-left leading-relaxed  pb-2">
                    <div style={{fontFamily: "Verdana, serif"}}>{
                        json.map(sentence => {
                            const bg = sentence.sent_id in selected_sentences?selected_sentences[sentence.sent_id] : ""
                            let start=0
                                let arr = ""
                                for(let i=0; i<sentence.entities.length;i++){
                                    // new entitiy
                                    let substring = sentence.text.slice(start, sentence.entities[i][2])
                                    arr+=substring;
                                    substring = sentence.text.slice(sentence.entities[i][2], sentence.entities[i][3])
                                    if(missing_entities.includes(substring.toLowerCase()))
                                        arr+="<span class='text-red-600'><b>"+substring+"</b></span>";
                                    else
                                        arr+="<span class='text-green-600'><b>"+substring+"</b></span>";

                                    start = sentence.entities[i][3]
                                }
                                if(start < sentence.text.length)
                                    arr+=sentence.text.slice(start);
                                arr+= ". "
                            return (
                                 <span id={"sent_" + sentence.sent_id}
                                       className={bg}
                                 dangerouslySetInnerHTML={{ __html: arr+" " }}>
                                     {/*{sentence.text+ ". "}*/}
                                 </span>)
                         })
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default ArticleBlockEntities;