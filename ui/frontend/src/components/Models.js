/* eslint-disable */
import Fuse from "fuse.js";
import React from "react";

import { get } from "../request";
import GithubIcon from "./icons/GithubIcon";
import PaperIcon from "./icons/PaperIcon";

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

class Models extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smodels: [],
      filtered_results: [],
      selected_container: "",
      search_term: "",
      sorted_by: "name",
      asc: true,
    };
  }

  setContainer = (id) => {
    const { selected_container } = this.state;
    const container_id = selected_container === id ? "" : id;
    this.setState({
      selected_container: container_id,
    });
  };

  componentDidMount() {
    this.loadModels();
  }

  search = () => {
    let search_term = document.getElementById("model_search_field").value;
    let results = this.state.smodels;
    if (search_term !== "") {
      const fuse = new Fuse(this.state.smodels, {
        keys: ["name", "title"],
        //minMatchCharLength: 2,
        threshold: 0.2,
        ignoreLocation: true,
        includeScore: true,
      });
      results = fuse.search(search_term).map((model) => model.item);
    }
    this.setState({
      filtered_results: results,
      search_term: search_term,
      selected_container: "",
      sorted_by: "",
      asc: null,
    });
  };

  loadModels = () => {
    get("/api/smodel/all/").then((data) => {
      this.setState({
        smodels: data.smodels,
        filtered_results: data.smodels,
        search_term: "",
        selected_container: "",
      });
    });
  };

  sortBy = (arr, prop) => {
    if (prop === "name")
      // sorting string property
      return arr.sort((a, b) => a[prop].localeCompare(b[prop]));
    else return arr.sort((a, b) => a[prop] - b[prop]);
  };

  datasetBadge = (dataset_id) => {
    let label = "";
    let style = "";
    if (dataset_id === 1) {
      label = "CNN/DM";
      style = "text-yellow-800 bg-yellow-100 ";
    } else if (dataset_id === 2) {
      label = "XSum";
      style = "text-red-800 bg-red-100 ";
    } else {
      label = "Webis TL;DR";
      style = "text-purple-800 bg-purple-100 ";
    }

    return (
      <span
        className={
          style + " text-xxs ml-3 flex-shrink-0 rounded-full py-0.5 font-medium"
        }
      >
        {label}
      </span>
    );
  };

  sortByVal = (v) => {
    let sorted = this.sortBy(this.state.filtered_results, v);
    let asc = true;
    if (this.state.sorted_by === v && this.state.asc !== null) {
      if (this.state.asc) {
        sorted = sorted.reverse();
        asc = false;
      }
    }
    this.setState({
      filtered_results: sorted,
      sorted_by: v,
      asc: asc,
    });
  };

  render() {
    const { filtered_results, selected_container } = this.state;
    return (
      <div className="left-0 mt-4 w-full justify-end rounded-lg bg-white p-1 px-4 py-4 text-left text-sm">
        <h1 className="text-normal header_font mb-0 px-4 py-2 text-justify text-xl font-bold text-blue-900">
          Hosted Models
        </h1>
        <div className="mx-4 flex bg-white py-2 px-4 shadow">
          <span className="flex w-auto items-center justify-end p-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            className="w-full rounded p-2 focus:outline-none"
            id="model_search_field"
            onChange={() => {
              this.search();
            }}
            type="text"
            placeholder="Search Models"
          />
          {/*<button className="bg-blue-700 hover:bg-blue-600 rounded text-white p-2 pl-4 pr-4">*/}
          {/*    <p className="font-semibold text-xs">Search</p>*/}
          {/*</button>*/}
        </div>
        <div className="mx-4 my-2 ">
          Found{" "}
          <span className="font-bold text-blue-800">
            {filtered_results.length}
          </span>{" "}
          models.
        </div>
        <div className="px-4 text-justify text-sm leading-relaxed">
          <ul>
            <li className="relative border-b border-gray-200">
              <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-3 text-left focus:outline-none">
                <div className="flex items-center justify-between">
                  <span className="flex w-full">
                    <span
                      className="article_header w-1/6 cursor-pointer text-xs
                                            font-semibold text-white"
                      onClick={() => {
                        this.sortByVal("name");
                      }}
                    >
                      {this.state.sorted_by === "name" ? (
                        <span>
                          <span className="font-bold">Model Name</span>
                          {this.state.asc ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="inline-block h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="inline-block h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                      ) : (
                        "Model Name"
                      )}
                    </span>
                    <span className="article_header ml-3 w-2/6 text-xs font-semibold text-white ">
                      Title
                    </span>
                    <span className="w-3/6">
                      <span
                        className="article_header ml-3 inline-block w-1/6 cursor-pointer text-xs font-semibold text-white"
                        onClick={() => {
                          this.sortByVal("rouge1");
                        }}
                      >
                        {this.state.sorted_by === "rouge1" ? (
                          <span>
                            <span className="font-bold">Rouge 1</span>
                            {this.state.asc ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        ) : (
                          "Rouge 1"
                        )}
                      </span>
                      <span
                        className="article_header ml-3 inline-block w-1/6 cursor-pointer text-xs font-semibold text-white"
                        onClick={() => {
                          this.sortByVal("rouge2");
                        }}
                      >
                        {this.state.sorted_by === "rouge2" ? (
                          <span>
                            <span className="font-bold">Rouge 2</span>
                            {this.state.asc ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        ) : (
                          "Rouge 2"
                        )}
                      </span>
                      <span
                        className="article_header ml-3 inline-block w-1/6 cursor-pointer text-xs font-semibold text-white"
                        onClick={() => {
                          this.sortByVal("rougel");
                        }}
                      >
                        {this.state.sorted_by === "rougel" ? (
                          <span>
                            <span className="font-bold">Rouge L</span>
                            {this.state.asc ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        ) : (
                          "Rouge L"
                        )}
                      </span>
                      <span className="ml-3 inline-block w-1/6 cursor-pointer text-xs font-semibold text-white">
                        Paper
                      </span>
                      <span className="ml-3 inline-block w-1/6 cursor-pointer text-xs font-semibold text-white">
                        Git Repo
                      </span>
                    </span>
                  </span>
                  <span className="float-right inline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </li>
            {filtered_results.map((obj, ind) => {
              const thisID = `container_${ind}`;
              const setID = () => {
                this.setContainer(thisID);
              };
              const thisIsSelected = selected_container === thisID;
              return (
                <li
                  key={`${obj.name}-${obj.dataset_id}`}
                  className="relative border-b border-gray-200"
                >
                  <button
                    type="button"
                    className="w-full px-8 py-4 text-left hover:bg-blue-100 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex w-full">
                        <span
                          className="article_header header_font w-1/6 text-xs font-semibold uppercase text-blue-800"
                          onClick={setID}
                        >
                          {obj.name}
                          {this.datasetBadge(obj.dataset_id)}
                        </span>
                        <span
                          className="ml-5 w-2/6 text-xs font-normal text-black"
                          onClick={setID}
                        >
                          {obj.title}
                        </span>
                        <span className="w-3/6">
                          <span
                            className="ml-5 inline-block w-1/6 text-xs font-normal text-black"
                            onClick={setID}
                          >
                            {obj.rouge1.toFixed(2)}
                          </span>
                          <span
                            className="ml-5 inline-block w-1/6 text-xs font-normal text-black"
                            onClick={setID}
                          >
                            {obj.rouge2.toFixed(2)}
                          </span>
                          <span
                            className="ml-5 inline-block w-1/6  text-xs font-normal text-black"
                            onClick={setID}
                          >
                            {obj.rougel.toFixed(2)}
                          </span>
                          <span className="ml-3 inline-block w-1/6 cursor-pointer text-xs">
                            <a
                              href={obj.url}
                              className="font-semibold text-blue-800"
                              target="_blank"
                            >
                              {" "}
                              <PaperIcon />{" "}
                            </a>
                          </span>
                          <span className="m-auto ml-3 inline-block w-1/6 cursor-pointer text-xs">
                            {obj.github === "" ? (
                              " - "
                            ) : (
                              <a
                                href={obj.github}
                                className="font-semibold text-blue-800"
                                target="_blank"
                              >
                                {" "}
                                <GithubIcon />{" "}
                              </a>
                            )}
                          </span>
                        </span>
                      </span>

                      <span
                        className="float-right inline text-blue-800"
                        onClick={setID}
                      >
                        {thisIsSelected ? <MinusIcon /> : <PlusIcon />}
                      </span>
                    </div>
                  </button>
                  {thisIsSelected && (
                    <div className="transition-all duration-700">
                      <div className="px-8 py-4">
                        <div className="mt-1 mb-1 text-justify text-xs leading-5">
                          <span className="font-bold">Abstract: </span>
                          <span>{obj.abstract}</span>
                        </div>
                        <div className="mt-1 mb-1 text-justify text-xs">
                          <span className="font-bold">Human Evaluation: </span>
                          <span>{obj.human_evaluation}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Models;
