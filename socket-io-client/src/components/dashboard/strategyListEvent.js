import React, { Component } from "react";
import PortfolioTable from './portfolioTable';
import QuoteTable from './quoteTable';
import CommentTable from './commentTable';
import Graph from './graph';
//import BarTable from './barTable';
import OrderTable from './orderTable';
import PositionTable from './positionTable';
import SignalTable from './signalTable';

class StrategyListEvent extends Component {
    constructor (props) {
      super(props);
      //initalise current state
      this.state = {
        quote: [],
        position:[],
        commentary:[],
        signal:[],
        analytics:[],
        bar:[],
        perfdata:[],
        order:[],
        currenturl:this.props.url,
      }
      //console.log(this.props.url);
      //open eventsource base on current url
      this.eventSource = new EventSource("http://localhost:2222/service/"+this.props.url);
    }
   //on change 
    change =(event)=>{
      //close current eventsource
      this.eventSource.close();
      //set current state to default and initalise currenturl to changed event
       this.setState({
        quote: [],
        position:[],
        commentary:[],
        signal:[],
        bar:[],
        order:[],
        analytics:[],
        currenturl:event.target.value,
                     });
      //open eventsource base on new event 
      this.eventSource = new EventSource("http://localhost:2222/service/"+event.target.value);
      console.log(event.target.value);
      //set eventlistener to current event
      this.allEvent();
     }

     //all the eventlisteners for current events
     allEvent=()=>{
       this.eventSource.addEventListener('quote', quote => this.setState({quote:JSON.parse(quote.data)}));
       this.eventSource.addEventListener('commentary', commentary => this.setState({commentary:JSON.parse(commentary.data)}));
       //this.eventSource.addEventListener('portfolio', portfolio => this.setState({portfolio:JSON.parse(portfolio.data)}));
       this.eventSource.addEventListener('position', position => this.setState({position:JSON.parse(position.data)}));
       this.eventSource.addEventListener('order', order => this.setState({order:JSON.parse(order.data)}));
       this.eventSource.addEventListener('bar', bar => this.setState({bar:JSON.parse(bar.data)}));
       this.eventSource.addEventListener('signal', signal => this.setState({signal:JSON.parse(signal.data)}));
     }
     //when component mount initalise 
    componentDidMount () {
      this.allEvent();
      this.fetchPerfURL();
   
    }
    //fetch list of current strategy
    fetchPerfURL(){
      const perfURL ='http://localhost:2222/service/strategy/performances';
      fetch(perfURL)
     .then(response => response.json())
     .then(perfdata => this.setState({ perfdata }));
    }
    //render DOM set all the components here
    render () {
       const{signal}=this.state;
       const{quote}=this.state;
       const{position}=this.state;
       const{order}=this.state;
       const{bar}=this.state;
       const{currenturl} =this.state;
       const{commentary} =this.state;
       const dropdown = this.state.perfdata.map((object,i)=>
          <option key={i} value={object.id}>{object.id}</option>
         )
      
      return (  
        <div className="small">  
        <div className="row">
         <div className="col-md-12 small">
         <h6>List of Stock</h6>  
         </div>
         </div>
        
         <div className="row ">
       
            <div className="col-md-6">
            
              <Graph bardata={bar} currentStrat={currenturl}></Graph>
           </div>
          
           <PortfolioTable></PortfolioTable>
       
          

         </div>
         <div className="row">
         <div className="col-md-12 small">
              <h6>List of Portfolio</h6>
              <select id="lang" onChange={this.change}>
              {dropdown}
              </select>
            </div>
            </div>
          <div className="row ">
           
            <PositionTable className="container " type={position} currentStrat={currenturl} >position</PositionTable>
            <QuoteTable className="container " type={quote} currentStrat={currenturl}>quote</QuoteTable>
          </div>

          <div className="row ">
            <OrderTable className="container" type={order} currentStrat={currenturl} >order</OrderTable>
            <SignalTable className="container" type={signal} currentStrat={currenturl}>signal</SignalTable>
            <CommentTable className="container" type={commentary} currentStrat={currenturl}>Comment</CommentTable>
          </div>
        </div>
            );
      }
    }
  
  export default StrategyListEvent;