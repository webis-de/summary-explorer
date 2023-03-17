import React from "react";

export default function NextIcon({ cls }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${cls ?? "h-4 w-4"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
