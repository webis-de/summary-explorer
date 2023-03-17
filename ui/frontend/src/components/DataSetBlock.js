/* eslint-disable */
import React from "react";

export default function DataSetBlock(props) {
  const { dataset_id } = props;
  return (
    <div className="header_font flex-1 truncate px-1 py-1">
      {dataset_id === 1 && (
        <h3 className="truncate font-bold text-blue-800">
          CNN/Daily Mail Corpus{" "}
        </h3>
      )}
      {dataset_id === 2 && (
        <h3 className="truncate font-bold text-blue-800">XSum </h3>
      )}
      {dataset_id === 3 && (
        <h3 className="truncate font-bold text-blue-800">Webis TL;DR </h3>
      )}
    </div>
  );
}
