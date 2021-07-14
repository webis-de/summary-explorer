import React from "react";

export default function MinusIcon(props) {
    const cls = props.cls? props.cls: " h-5 w-5 ";
    return (
            <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
    )
}