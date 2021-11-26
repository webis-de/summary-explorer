import React from "react";

export default function RougeScoreBlock(props) {
    const rouge_score = props.rouge_score;
    return (
            <div>
                {typeof rouge_score===undefined || rouge_score==null?null:
                    <div className="flex bg-gray-200 px-4 mt-1 text-blue-600 text-xs py-1 mb-0 rounded-b">
                        <div className="w-1/3">
                            <span className="px-1 text-gray-600">Rouge1:</span>
                            <span>{Math.round(10000*rouge_score.rouge1.fmeasure)/100}</span>
                        </div>
                        <div className="w-1/3">
                            <span className="px-1  text-gray-600">Rouge2:</span>
                            <span>{Math.round(10000*rouge_score.rouge2.fmeasure)/100}</span>
                        </div>
                        <div className="w-1/3 ">
                            <span className="px-1  text-gray-600">RougeL:</span>
                            <span>{Math.round(10000*rouge_score.rougeL.fmeasure)/100}</span>
                        </div>
                    </div>
                }
            </div>

    )
}