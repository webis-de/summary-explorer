/* eslint-disable */
import React from "react";

import questions_list from "./config/questions.js";
import MinusIcon from "./icons/MinusIcon";
import PlusIcon from "./icons/PlusIcon";

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_container: "", //container1
    };
  }

  set_container = (id) => {
    const { selected_container } = this.state;
    const container_id = selected_container === id ? "" : id;
    this.setState({
      selected_container: container_id,
    });
  };

  openView = (lst, question, q_id) => {
    this.props.setSubMetrics(lst, question, q_id);
  };

  render() {
    const { selected_container } = this.state;
    return (
      <div className="mx-auto mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-xl">
        <ul className="shadow-box">
          {questions_list.map((q, i) => {
            return (
              <li
                key={i}
                className="relative border-b border-gray-200 focus:outline-none"
              >
                <button
                  type="button"
                  onClick={() => {
                    this.set_container(q.id);
                  }}
                  className="w-full px-8 py-6 text-left text-blue-800 hover:bg-gray-100 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">
                        {q.heading}
                        <span
                          className={
                            q.badge_style +
                            " text-xxs ml-3 flex-shrink-0 rounded-full py-0.5 font-medium"
                          }
                        >
                          {q.badge}
                        </span>
                      </div>
                      <div>{q.question}</div>
                    </div>
                    <span className="float-right inline">
                      {selected_container === q.id ? (
                        <MinusIcon />
                      ) : (
                        <PlusIcon />
                      )}
                    </span>
                  </div>
                </button>
                {selected_container === q.id && (
                  <div className="relative transition-all duration-700">
                    <div className="flex px-8 py-4">
                      <div className="mr-3 w-1/4 text-sm">
                        {q.desc}
                        <button
                          className="align-center my-1 w-full rounded bg-blue-800 px-3 py-1 text-sm font-normal text-white hover:bg-red-700 focus:outline-none"
                          onClick={() => {
                            this.openView(q.metrics_subset, q.question, q.id);
                          }}
                        >
                          Select Models
                        </button>
                      </div>
                      <div className="w-3/4">
                        <img src={q.image_path} className="m-auto w-11/12" />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Questions;
