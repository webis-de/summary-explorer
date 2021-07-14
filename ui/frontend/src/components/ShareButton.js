import React from "react";
import CopyIcon from "./icons/CopyIcon";

export default function ShareButton(props) {
    return (
            <button className="px-1 py-1 bg-blue-800 text-white text-xs rounded mr-1
            hover:bg-red-700 cursor-pointer mr-1 float-right focus:outline-none"
                  onClick={()=>{props.copyTextToClipboard()}}>
                <span className="mx-1">Share</span>
                <CopyIcon />
            </button>
        )
}



