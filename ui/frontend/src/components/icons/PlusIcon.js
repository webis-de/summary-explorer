import React from "react";

export default function PlusIcon(props) {
    const cls = props.cls? props.cls: " h-5 w-5 ";
    return (
            <svg xmlns="http://www.w3.org/2000/svg" className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
    )
}