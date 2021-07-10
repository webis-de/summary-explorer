import React from "react";

export default function DataSetBlock(props) {
    const {dataset_id} = props;
    return (
            <div className="flex-1 px-1 header_font truncate py-1">
                {dataset_id===1?
                    <h3 className="text-blue-800 font-bold truncate">CNN/Daily Mail Corpus </h3>
                :null}
                {dataset_id===2?
                    <h3 className="text-blue-800 font-bold truncate">XSum </h3>
                :null}
                {dataset_id===3?
                    <h3 className="text-blue-800 font-bold truncate">Webis TL;DR </h3>
                :null}
            </div>
    )
}