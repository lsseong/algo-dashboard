import React, { Component } from "react";
// import PortfolioTable from "./portfolioTable";
// import QuoteTable from "./quoteTable";
import CommentTable from "../table/commentTable";
import CandleStickGraph from "../graph/candleStickGraph";
import OrderTable from "../table/orderTable";
import PositionTable from "../table/positionTable";
import SignalTable from "../table/signalTable";
import OrderPositionTable from "../table/orderPositionTable";
import StackedBarGraph from "../graph/stackBarGraph";
import PnLPanel from "./Panel/PnlPanel";
import SignalLineGraph from '../graph/signalLineGraph';
// import Draggable from "../main/Draggable/draggable";
// import Droppable from "../main/Droppable/droppable";

import {withStyles,Tabs,Grid,Tab,AppBar, Typography,Collapse,} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  root:{
    width:"98%",
    fontSize:"12px",
    marginLeft:"auto",
    marginRight:"auto",
  },
  appbar:{
    backgroundColor:"#484848",
  },
  firstrow:{
    width:"98%",
    color:"white",
    fontFamily:"TitilliumWeb_Regular",
  },
  text:{
    marginLeft:"8px",
  },
  tab:{
    backgroundColor:"#383838",
  },
  typography:{
    fontFamily:"TitilliumWeb_Regular",
  },
  droppable:{
    width:"100%",
    height:"100%",
  },
  wrapper:{
    width:"100%",
    padding:"32px",
    backgroundColor:"yellow",
  }
 });

class Dashboard extends Component {
  constructor(props) {
    super(props);
    //initalise current state
    this.state = {
      quote: [],
      position: [],
      commentary: [],
      signal: [],
      analytics: [],
      bar: [],
      perfdata: [],
      order: [],
      portfolio: {},
      currenturl: this.props.url,
      serverconnect: true,
      currenttab: "portfolioTab",
      portfolioTab:true,
      positionTab:false,
      securityList: [],
      
    };

    //open eventsource base on current url
    this.eventSource = new EventSource(
      "http://" + this.props.host + ":" + this.props.port + "/service/" + this.props.url
    );
    this.tabVariant="standard";
    this.isMobile = false;
    this.COMPONENT_HEIGHT = '400px'
    this.selectedSecurity = ""
    this.securitychild = {};
  }

  getOrCreateRef(id) {
    if (!this.securitychild.hasOwnProperty(id)) {
        this.securitychild[id] = React.createRef();
    }
    return this.securitychild[id];
}
  //on drop down change
  changeStrategy = event => {
    //close current eventsource
    this.eventSource.close();
    //set current state to default and initalise currenturl to changed event
    this.setState({
      quote: [],
      position: [],
      commentary: [],
      signal: [],
      bar: [],
      order: [],
      portfolio: {},
      analytics: [],
      currenturl: event.target.value,
      securityList: [],
    });
    //open eventsource base on new event
    this.eventSource = new EventSource(
      "http://" + this.props.host + ":" + this.props.port + "/service/" + event.target.value
    );
    console.log(event.target.value);
    //set eventlistener to current event
    this.allEvent();
    
  };

  changeSecurity = (event)=>{

    this.selectedSecurity = event.target.value
    console.log("change",this.selectedSecurity)
    Object.entries(this.securitychild).forEach(([key,value])=>{
      console.log(`${key}:${value}`)
      let ref = this.getOrCreateRef(key);
      ref.current.changeSecurity(this.selectedSecurity);
    })
  }

  allEvent = () => {
    //when eventsource open
    this.eventSource.onopen = (e)=> {
      console.log("EventSource started.");
      this.setState({
        serverconnect: true
      });
    }

    //when eventsource have error
    this.eventSource.onerror = (e)=> {
      console.log("EventSource failed.");
      this.setState({
        serverconnect: false
      });
    }

    //all the eventlisteners for current events
    this.eventSource.addEventListener("quote", quote =>
      this.setState({ quote: JSON.parse(quote.data) })
    );
    this.eventSource.addEventListener("commentary", commentary =>
      this.setState({ commentary: JSON.parse(commentary.data) })
    );
    this.eventSource.addEventListener("portfolio", portfolio =>
      this.setState({ portfolio: JSON.parse(portfolio.data) })
    );
    this.eventSource.addEventListener("position", position => {
      var inputPosition = JSON.parse(position.data);
      inputPosition.unrealizedPnl = Number(inputPosition.unrealizedPnl).toFixed(2);
      inputPosition.realizedPnl = Number(inputPosition.realizedPnl).toFixed(2);

      this.setState({ position: inputPosition });
    });
    this.eventSource.addEventListener("order", order =>
      this.setState({ order: JSON.parse(order.data) })
    );
    this.eventSource.addEventListener("bar", bar => 
    
    this.setState({ bar: JSON.parse(bar.data) },()=>this.addSecurity(this.state.bar.symbol))
    
    
    );

    this.eventSource.addEventListener("signal", signal =>
      this.setState({ signal: JSON.parse(signal.data) })
    );
  };
  addSecurity=(name)=>{
    if (name === undefined){
      console.log('name is null')
    }
    if (this.state.securityList.includes(name)===false){
      
      let tempList = this.state.securityList
      tempList.push(name)
      this.setState({
        securityList : tempList
      })


    }
    if(this.state.securityList.length === 1){
      this.selectedSecurity = this.state.securityList[0]
    }

    
  }

  //when component mount initalise
  componentDidMount() {
    this.fetchPerfURL();
    this.allEvent();
    this.detectmob();
  }
  //fetch list of current strategy
  fetchPerfURL() {
    const perfURL =
      "http://" + this.props.host + ":" + this.props.port + "/service/strategy/performances";
    fetch(perfURL)
      .then(response => response.json())
      .then(perfdata => this.setState({ perfdata }))
      .catch(err=>{
        console.log(err)
      });
  }

  clearEventListener() {
    this.eventSource.removeEventListener(null, null);
  }
  componentWillUnmount() {
    console.log("EventSource close.");
    this.clearEventListener();
    this.eventSource.close();
  }
  checkSelectedTab =(event,newValue) => {
    if(newValue==="portfolioTab"){
      this.setState({
        portfolioTab:true,
        positionTab:false,
      })
    }else if (newValue === "positionTab"){
      this.setState({
        portfolioTab:false,
        positionTab:true,
      })
    }
    this.setState({
      currenttab: newValue
    });
  };
   detectmob=()=> {
    this.isMobile = window.orientation > -1; 
    if(this.isMobile){
          this.tabVariant="fullWidth"
        }
      else {
          this.tabVariant="standard";

        }
      }


  //render DOM set all the components here
  render() {
    const { signal } = this.state;
    // const { quote } = this.state;
    const { position } = this.state;
    const { order } = this.state;
    const { portfolio } = this.state;
    const { bar } = this.state;
    const { currenturl } = this.state;
    const { commentary } = this.state;
    const { serverconnect } = this.state;
    const { currenttab } = this.state;
    const { classes } = this.props;
    const { positionTab } = this.state;
    const { portfolioTab } = this.state;

    const dropdown = this.state.perfdata.map((object, i) => (
      <option key={i} value={object.id}>
        {object.id}
      </option>
    ));
    const secdropdown = this.state.securityList.map((object, i) => (
      <option key={i} value={object}>
        {object}
      </option>
    ));

    return (
      <div className={classes.root}>
       

        {/* First row */}
        <Grid container spacing={0} className={classes.firstrow}>
          <Grid item xs={6} >
        
            <Grid container spacing={0} className={classes.text}>

              <Grid item xs={4}>

                  <Typography variant="h6" className={classes.typography}>
                    List of Strategies
                  </Typography>
              </Grid>
              <Grid item xs={4}>
                  <Typography variant="h6" className={classes.typography}>
                    List of Securities
              </Typography>
              </Grid>
               
              <Grid item xs={12}>

                <Grid container>
                <Grid item xs={4}>
                <select onChange={this.changeStrategy}>{dropdown}</select>
                </Grid>
                <Grid item xs={4}>
                <select onChange={this.changeSecurity}>  {secdropdown}</select>
                </Grid>
                <Grid item>
             
                    {serverconnect ? (
                      <Typography variant="caption" className={classes.typography}>
                        Connection Status : <span style={{ color: "#03c03c" }}>Connected</span>{" "}
                      </Typography>
                    ) : (
                      <Typography variant="caption" className = {classes.typography}>
                        Connection Status : <span style={{ color: "red" }}>Disconnected</span>
                      </Typography>
                    )}
                
                </Grid>
                </Grid>
               
             
              </Grid>
                      
            </Grid>
        
          </Grid>
         
          
            <Grid item xs={6}>
        
              <Grid container>
                <Grid item xs={12}>
                <PnLPanel data={portfolio}/>
                </Grid>
              </Grid>

          
            </Grid>
     

        </Grid>
      
        <br/>
        {/* Tabs */}
      <AppBar position="static" className={classes.appbar}>
        <Tabs 
        value={currenttab} 
        onChange={this.checkSelectedTab}
        textColor="inherit"
        centered={this.isMobile}
        variant={this.tabVariant}
        >
          <Tab label="portfolio" value="portfolioTab" />
          <Tab label="position" value="positionTab" />
        </Tabs>
      </AppBar>
      
     
        {/* First summary tab */}
          <Collapse in={portfolioTab} >
         
               <div className={classes.tab}>
               <br/>
              <Grid container spacing={1} >
                {/* Left Side */}
                
                <Grid item sm={6} xs={12}>
              
                  <Grid container spacing={1}>

                    <Grid item xs={12}>
                      <CandleStickGraph ref={this.getOrCreateRef("cs1")} height={this.COMPONENT_HEIGHT} id="cs1" bardata={bar} currentStrat={currenturl} />
                    </Grid>

                    <Grid item xs={12}>
                      <SignalLineGraph height={this.COMPONENT_HEIGHT} id ="signalline" signaldata={signal} currentStrat={currenturl}/>

                    
                    </Grid>

                 
                  <Grid item xs={12}>
                      <OrderTable
                        height={this.COMPONENT_HEIGHT}
                        isMobile={this.isMobile}
                        type={order}
                        currentStrat={currenturl}
                       
                      />
                    </Grid>
                  </Grid>
                 
                </Grid>
              
                {/* Right Side */}
               
                <Grid item sm={6} xs={12}>
              
                  <Grid container spacing={1}>
              

              
                    <Grid item xs={12}>
                      <PositionTable
                        height={this.COMPONENT_HEIGHT}
                        isMobile={this.isMobile}
                        type={position}
                        currentStrat={currenturl}
                        
                      />
                    </Grid>
                  
                    <Grid item xs={12}>
                      <SignalTable 
                      height={this.COMPONENT_HEIGHT}
                      isMobile={this.isMobile}
                      type={signal} 
                      currentStrat={currenturl}
                      
                      />
                    </Grid>
                 
                  <Grid item xs={12}>
                    <CommentTable
                      
                      type={commentary}
                      currentStrat={currenturl}
                      
                      height={this.COMPONENT_HEIGHT}
                    />
                  </Grid>
             
                 
                 
                  </Grid>
                </Grid>

             
              </Grid>
            </div>
           
        </Collapse>
                     
          {/* Second position tab */}
          <Collapse in={positionTab}>
           
              <div className={classes.tab}>
              <br/>
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                        <PositionTable
                          isMobile={this.isMobile}
                          type={position}
                          currentStrat={currenturl}
                          height={this.COMPONENT_HEIGHT}
                        />
                        </Grid>

                        <Grid item xs={12}>
                        <CommentTable
                              isMobile={this.isMobile}
                              type={commentary}
                              currentStrat={currenturl}
                              numofRows={10}
                              height={this.COMPONENT_HEIGHT}
                            />
                        </Grid>
                    </Grid>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <StackedBarGraph
                              type={position}
                              currentStrat={currenturl}
                              height={this.COMPONENT_HEIGHT}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <CandleStickGraph ref={this.getOrCreateRef("cs2")}  id="cs2" bardata={bar} currentStrat={currenturl} />
                          </Grid>
                      </Grid>
                  </Grid>

                  <Grid item xs={12}>
                      <Grid container spacing={1}>
                          <Grid item xs={12}>
                              <OrderPositionTable
                              isMobile={this.isMobile}
                              type={order}
                              currentStrat={currenturl}
                              height={this.COMPONENT_HEIGHT}
                              />
                          </Grid>
                      </Grid>
                    </Grid>
                </Grid>
              </div>
              </Collapse>
     
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
