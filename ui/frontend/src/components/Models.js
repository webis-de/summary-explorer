import React from 'react';
import '../assets/main.css';
import axios from "axios";
import Fuse from 'fuse.js';
import LinkIcon from "./icons/LinkIcon";

class Models extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            smodels: [],
            filtered_results: [],
            selected_container: "",
            search_term: "",
            sorted_by: "name",
            asc: true
        }

    }

    setContainer = (id)=>{
        const {selected_container} = this.state;
        const container_id = selected_container===id?"":id
        this.setState({
            selected_container: container_id
        })
    }

    componentDidMount() {
        this.loadModels()
    }

    search=()=>{
        let search_term = document.getElementById("model_search_field").value;
        let results = this.state.smodels
        if(search_term!=="")
        {
            const fuse = new Fuse(this.state.smodels, {
                keys: ['name', 'title'],
                //minMatchCharLength: 2,
                threshold: 0.2,
                ignoreLocation: true,
                includeScore: true
            });
            results = fuse.search(search_term).map(model => model.item);
        }
        this.setState({
            filtered_results: results,
            search_term: search_term,
            selected_container: "",
            sorted_by: "",
            asc: null
        })
    }

    loadModels = ()=>{
        const url = '../api/smodel/all/';
        axios.get(url)
        .then(res => {
          this.setState({
              smodels: res.data.smodels,
              filtered_results: res.data.smodels,
              search_term: "",
              selected_container: ""
          });
      });
    };

    sortBy = (arr, prop)=> {
         if(prop==="name") // sorting string property
             return arr.sort((a, b) => a[prop].localeCompare(b[prop]));
         else
            return arr.sort((a, b) => a[prop] - b[prop]);
        }

    sortByVal= (v)=>{
        let sorted = this.sortBy(this.state.filtered_results, v)
        let asc = true
        if(this.state.sorted_by===v && this.state.asc!==null){
            if(this.state.asc){
                sorted = sorted.reverse()
                asc = false
            }
        }
        this.setState({
            filtered_results: sorted,
            sorted_by: v,
            asc: asc
        })
    }

    render() {
        const {filtered_results, selected_container} = this.state
        return (
            <div className="w-full p-1 bg-white rounded-lg mt-4 px-4 py-4 justify-end text-sm left-0 text-left">
                <h1 className="text-xl font-bold text-normal mb-0 px-4 py-2 header_font text-justify text-blue-900">
                    <span>
                        Summarization Models
                    </span>
                </h1>
                <div className="bg-white shadow py-2 px-4 mx-4 flex">
                    <span className="w-auto flex justify-end items-center text-gray-500 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input className="w-full rounded p-2 focus:outline-none"
                           id="model_search_field"
                           onChange={()=>{this.search()}}
                           type="text"
                           placeholder="Search Models"
                    />
                        {/*<button className="bg-blue-700 hover:bg-blue-600 rounded text-white p-2 pl-4 pr-4">*/}
                        {/*    <p className="font-semibold text-xs">Search</p>*/}
                        {/*</button>*/}
                </div>
                <div className="mx-4 my-2 ">Found <span className="font-bold text-blue-800">{filtered_results.length}</span> models.</div>
                <div className="px-4 text-sm text-left text-justify leading-relaxed">
                    <ul>
                        <li className="relative border-b border-gray-200">
                            <div  className="w-full px-8 py-3 text-left focus:outline-none bg-gradient-to-r from-blue-900 to-blue-800" >
                                    <div className="flex items-center justify-between">
                                        <span className="w-full flex">
                                            <span className="w-1/6 text-xs article_header font-semibold
                                            text-white cursor-pointer"
                                                  onClick={()=>{this.sortByVal("name")}}>
                                                {this.state.sorted_by==="name"?(
                                                    <span>
                                                    <b>Model Name</b>
                                                    {this.state.asc?

                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>:
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                                  clip-rule="evenodd"/>
                                                        </svg>
                                                    }
                                                    </span>)
                                                    :"Model Name"}
                                            </span>
                                            <span className="w-3/6 font-normal ml-5 text-xs article_header font-semibold
                                            text-white ">Title</span>
                                            <span className="w-2/6" >
                                                <span className="cursor-pointer w-1/5 inline-block ml-5 text-xs article_header font-semibold
                                            text-white"
                                                onClick={()=>{this.sortByVal("rouge1")}}>
                                                    {this.state.sorted_by==="rouge1"?(
                                                    <span>
                                                    <b>Rouge 1</b>
                                                    {this.state.asc?

                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>:
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                                  clip-rule="evenodd"/>
                                                        </svg>
                                                    }
                                                    </span>)
                                                    :"Rouge 1"}
                                                </span>
                                                <span className="cursor-pointer w-1/5 inline-block ml-5 text-xs article_header font-semibold
                                            text-white"
                                                onClick={()=>{this.sortByVal("rouge2")}}>
                                                    {this.state.sorted_by==="rouge2"?(
                                                    <span>
                                                    <b>Rouge 2</b>
                                                    {this.state.asc?

                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>:
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                                  clip-rule="evenodd"/>
                                                        </svg>
                                                    }
                                                    </span>)
                                                    :"Rouge 2"}
                                                </span>
                                                <span className="cursor-pointer w-1/5 inline-block ml-5 text-xs article_header font-semibold
                                            text-white"
                                                onClick={()=>{this.sortByVal("rougel")}}>
                                                    {this.state.sorted_by==="rougel"?(
                                                    <span>
                                                    <b>Rouge L</b>
                                                    {this.state.asc?

                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>:
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                                  clip-rule="evenodd"/>
                                                        </svg>
                                                    }
                                                    </span>)
                                                    :"Rouge L"}

                                                </span>

                                                <span className="cursor-pointer w-1/6 inline-block ml-5 text-xs font-semibold
                                            text-white">
                                                    Paper
                                                </span>
                                            </span>
                                        </span>
                                        <span className="inline float-right">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-0" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                       </span>
                                    </div>
                                </div>
                        </li>
                    {filtered_results.map((obj, ind)=>{
                    return <li className="relative border-b border-gray-200">
                                <button type="button"
                                        className="w-full px-8 py-4 text-left focus:outline-none hover:bg-blue-100" >
                                    <div className="flex items-center justify-between">
                                        <span className="w-full flex">
                                            <span className="w-1/6 uppercase text-xs article_header font-semibold text-blue-800 header_font"
                                            onClick={()=>{this.setContainer("container_"+ind)}}>{obj.name}</span>
                                            <span className="w-3/6 font-normal text-xs text-black ml-5"
                                            onClick={()=>{this.setContainer("container_"+ind)}}>{obj.title}</span>
                                            <span className="w-2/6" >
                                                <span className="w-1/5 inline-block text-xs font-normal text-black ml-5"
                                                onClick={()=>{this.setContainer("container_"+ind)}}>{obj.rouge1.toFixed(2)}</span>
                                                <span className="w-1/5 inline-block text-xs font-normal text-black ml-5"
                                                onClick={()=>{this.setContainer("container_"+ind)}}>{obj.rouge2.toFixed(2)}</span>
                                                <span className="w-1/5 inline-block text-xs  font-normal text-black ml-5"
                                                onClick={()=>{this.setContainer("container_"+ind)}}>{obj.rougel.toFixed(2)}</span>
                                                <span className="cursor-pointer w-1/6 inline-block ml-5 text-xs">
                                                    <a href={obj.url} className="text-blue-800 font-semibold" target="_blank"> <LinkIcon /> </a>
                                                </span>
                                            </span>

                                        </span>

                                        <span className="inline float-right text-blue-800" onClick={()=>{this.setContainer("container_"+ind)}}>
                                            {selected_container===("container_"+ind)?
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>:
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>}

                                       </span>
                                    </div>
                                </button>
                                {selected_container===("container_"+ind)?
                                <div className="relative overflow-hidden transition-all max-h-0 duration-700">
                                    <div className="px-8 py-4">
                                        <div className="mt-1 mb-1 text-xs text-justify"><b>Abstract: </b><span>{obj.abstract}</span></div>
                                        <div className="mt-1 mb-1 text-xs text-justify"><b>Human Evaluation: </b><span>{obj.human_evaluation}</span></div>
                                        <div>
                                          <a href={obj.url} target="_blank" className="inline-block text-xs hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        {obj.url}</a></div>
                                    </div>
                                </div>:null}
                            </li>
                    })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Models;