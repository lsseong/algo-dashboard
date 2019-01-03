import React, { Component } from "react";
import StrategyList from './components/dashboard/strategyListEvent';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      initStrat:""
   };
  }
  //when component mount fetch 1st strategy name
  componentDidMount(){
    const URL ='http://localhost:2222/service/strategy/performances';
    fetch(URL)
   .then(response => response.json())
   .then(data => this.setState({ initStrat:data[0].id },()=>console.log(data[0].id)));
  }
  //send first strategy to Strategy list when rendering DOM
  render(){ 
    const{initStrat} =this.state;
    return (
      <div className="App">
      {this.state.initStrat &&
        <StrategyList url ={initStrat}></StrategyList>
      }
      
      </div>

    );

 
  }
}
export default App;