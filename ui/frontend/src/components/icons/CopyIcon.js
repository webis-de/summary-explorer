import React from "react";

export default function CopyIcon({ cls }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`mr-1 inline-block ${cls ?? "h-4 w-4"}`}
      fill="#FFFFFF"
      viewBox="0 0 24 24"
    >
      <g>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path
          d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0
                        2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        />
      </g>
    </svg>
  );
}
