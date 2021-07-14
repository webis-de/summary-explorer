import React from 'react';
import '../assets/main.css';
import questions_list from './config/questions.json'
import SingleGroupView from "./SingleGroupView";
import SingleGroupViewHalucination from "./SingleGroupViewHalucination";
import SingleGroupViewEntity from "./SingleGroupViewEntity";
import SingleGroupViewRelations from "./SingleGroupViewRelations";
import SingleGroupViewArticleHM from "./SingleGroupViewArticleHM";
import DataSetBlock from "./DataSetBlock";


class Resolve extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataset_id: null,
            article_id: null,
            question_id: null,
            models: null,
            current_question: null
        }
    }

    componentDidMount() {
        const query = new URLSearchParams(window.location.search);
        const dataset_id = query.get('ds')
        const article_id = query.get('a')
        const models= query.get('m')
        const question_id = query.get('s')
        let current_question = questions_list.filter(q => parseInt(q.id)==question_id)
        current_question = current_question.length > 0?current_question[0].question: null
        this.setState({
            dataset_id: parseInt(dataset_id),
            article_id: parseInt(article_id),
            question_id: parseInt(question_id),
            models: models.split(","),
            current_question: current_question
        })

    }

    render() {
        const {dataset_id, article_id, question_id, models, current_question} = this.state
        return (
            <div className="w-full p-1 pl-0 justify-end left-0 text-left ">
                        <DataSetBlock dataset_id={dataset_id} />
                        <h1 className="header_font font-semibold ml-1 text-blue-800">{current_question}</h1>
                        {question_id===1?
                            <SingleGroupView key="ModelGroupView"
                                     dataset_id={dataset_id}
                                     article_id={article_id}
                                     selected_models={models}
                                     />:null
                        }
                        {question_id===2?
                            <SingleGroupViewHalucination key="ModelGroupViewHalucination"
                                     dataset_id={dataset_id}
                                     article_id={article_id}
                                     selected_models={models}
                                     />:null
                        }
                        {question_id===3?
                            <SingleGroupViewEntity key="SingleGroupViewEntity"
                                     dataset_id={dataset_id}
                                     article_id={article_id}
                                     selected_models={models}
                                     />:null
                        }
                        {question_id===4?
                            <SingleGroupViewRelations key="SingleGroupViewRelations"
                                     dataset_id={dataset_id}
                                     article_id={article_id}
                                     selected_models={models}
                                     />:null
                        }
                        {question_id===5?
                            <SingleGroupViewArticleHM key="SingleGroupViewArticleHM"
                                     dataset_id={dataset_id}
                                     article_id={article_id}
                                     selected_models={models}
                                     />:null
                        }
                    </div>
        )
    }
}

export default Resolve;