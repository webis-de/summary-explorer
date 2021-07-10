import React from 'react';
import axios from 'axios';
import './assets/main.css';
import SingleGroupView from "./components/SingleGroupView";
import LoadingIcon from "./assets/images/loading.svg";
import ModelsScores from "./components/ModelsScores";
import AllModelsView from "./components/AllModelsView";
import MainView from "./components/MainView";
import Questions from "./components/Questions";
import Models from "./components/Models";
import Resolve from "./components/Resolve";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset_id: null,
            path: ""
        };
    }

    componentDidMount() {
      const query = new URLSearchParams(window.location.search);
      //console.log(window.location.pathname)
      const token = query.get('dataset')
      this.setState({
          dataset_id: parseInt(token),
          path: window.location.pathname
      })
      if(token!==null)
          this.loadSModelsList(token);
    }

    loadSModelsList = (dataset_id)=>{
        const url = '../api/dataset/'+dataset_id+"/models";
        axios.get(url)
        .then(res => {
          this.setState({
              all_models_loaded: true,
              all_models: res.data,
          });
      });
    };

  render() {
      const {dataset_id, path} = this.state;
      return (
          <div>
              <div className="App">
                  {path==="/main"?
                      <MainView dataset_id={dataset_id} />:null
                  }
                  {path==="/models"?
                      <Models/>:null
                  }
                  {path==="/article"?
                      <Resolve/>:null
                  }
              </div>
          </div>
    );
  }
}

export default App;
