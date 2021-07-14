import React from 'react';
import '../assets/main.css';
import questions_list from './config/questions.json'
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";


class Questions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_container: "", //container1
        }
    }

    set_container = (id)=>{
        const {selected_container} = this.state;
        const container_id = selected_container===id?"":id
        this.setState({
            selected_container: container_id
        })
    }

    openView = (lst, question, q_id) => {
    this.props.setSubMetrics(lst, question, q_id)
    }

    render() {
        const {selected_container} = this.state;
        const select_models_button_style = "w-full  align-center my-1 rounded text-sm px-3 py-1 py-0 font-normal " +
            "bg-blue-800 text-white hover:bg-red-700 focus:outline-none";
        return (
            <div className="bg-white w-full mt-2 rounded-lg shadow-xl mx-auto border border-gray-200">
                <ul className="shadow-box">
                    {questions_list.map(q=>{
                        return <li className="relative border-b border-gray-200 focus:outline-none">
                                <button type="button" onClick={()=>{this.set_container(q.id)}}
                                        className="w-full px-8 py-6 text-left text-blue-800 focus:outline-none hover:bg-gray-100" >
                                    <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-bold">{q.heading}
                                              <span className={q.badge_style + " ml-3 flex-shrink-0 py-0.5 text-xxs font-medium rounded-full"}>
                                                  {q.badge}
                                              </span>
                                          </div>
                                            <div>{q.question}</div>
                                        </div>
                                        <span className="inline float-right">
                                            {selected_container===q.id? <MinusIcon />: <PlusIcon />}
                                       </span>
                                    </div>

                                </button>
                                {selected_container===q.id?
                                <div className="relative overflow-hidden transition-all max-h-0 duration-700">
                                    <div className="px-8 py-4 flex">
                                        <div className="w-1/4 mr-3  text-sm" >
                                            {q.desc}
                                            <button className={select_models_button_style}
                                                    onClick={()=>{this.openView(q.metrics_subset, q.question, q.id)}}
                                            > Select Models </button>
                                        </div>
                                        <div className="w-3/4" >
                                            <img src={q.image_path} className="m-auto w-11/12"/>
                                        </div>
                                    </div>
                                </div>:null}
                            </li>
                    })}

                        </ul>
            </div>
        )
    }
}

export default Questions;