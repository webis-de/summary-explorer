/* eslint-disable */
import React from "react";

class ArticleBlockEntities extends React.Component {
  constructor(props) {
    super(props);
  }

  style_sentence = (sent) => {
    var html = [];
    var start = 0;
    sent.chunks.map((chunk) => {
      html.push(sent.text.slice(start, chunk[2]));
      html.push(
        <span className={"p-1 " + chunk[1]} title={chunk[1]}>
          {chunk[0]}
        </span>
      );
      start = chunk[3];
    });
    html.push(sent.text.slice(start));
    return html;
  };

  render() {
    const { json, selected_sentences, missing_entities } = this.props;
    return (
      <div>
        <h2 className="text-normal article_header mb-0 px-4 py-2 text-justify  font-bold uppercase text-blue-900">
          <span>ARTICLE {this.props.article_id}</span>
        </h2>
        <div className="px-4 pb-2 text-left text-sm  leading-relaxed">
          <div style={{ fontFamily: "Verdana, serif" }}>
            {json.map((sentence) => {
              const bg =
                sentence.sent_id in selected_sentences
                  ? selected_sentences[sentence.sent_id]
                  : "";
              const style = sentence.sent_id % 5 === 0 ? "mb-3" : "";
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
                if (missing_entities.includes(substring.toLowerCase()))
                  arr +=
                    "<span class='text-red-600'><b>" +
                    substring +
                    "</b></span>";
                else
                  arr +=
                    "<span class='text-green-600'><b>" +
                    substring +
                    "</b></span>";

                start = sentence.entities[i][3];
              }
              if (start < sentence.text.length)
                arr += sentence.text.slice(start);
              if (arr.trim().slice(-1) !== ".") arr += ". ";
              return (
                <div className={style + " inline"}>
                  <span
                    id={"sent_" + sentence.sent_id}
                    className={bg}
                    dangerouslySetInnerHTML={{ __html: arr + " " }}
                  ></span>
                  {sentence.sent_id % 5 === 0 ? <div className="h-3" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ArticleBlockEntities;
