import React from "react";

export default function NextIcon(props) {
    const cls = props.cls? props.cls: " h-4 w-4 ";
    return (
            <svg xmlns="http://www.w3.org/2000/svg" className={"inline-block " + cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
    )
}