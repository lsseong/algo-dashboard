import React, { Component } from "react";
// import PortfolioTable from "./portfolioTable";
// import QuoteTable from "./quoteTable";
import CommentTable from "./commentTable";
import Graph from "./graph";
import OrderTable from "./orderTable";
import PositionTable from "./positionTable";
import SignalTable from "./signalTable";
import OrderPositionTable from "./orderPositionTable";
import StackedBarGraph from "./statckBarGraph";
import PositionCSGraph from "./positionCandleStick";
import PnLPanel from "./PnlPanel";

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
    };

    //open eventsource base on current url
    this.eventSource = new EventSource(
      "http://" + this.props.host + ":" + this.props.port + "/service/" + this.props.url
    );
  }

  //on drop down change
  change = event => {
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
      currenturl: event.target.value
    });
    //open eventsource base on new event
    this.eventSource = new EventSource(
      "http://" + this.props.host + ":" + this.props.port + "/service/" + event.target.value
    );
    console.log(event.target.value);
    //set eventlistener to current event
    this.allEvent();
   
  };

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
    this.eventSource.addEventListener("bar", bar => this.setState({ bar: JSON.parse(bar.data) }));
    this.eventSource.addEventListener("signal", signal =>
      this.setState({ signal: JSON.parse(signal.data) })
    );
  };
  //when component mount initalise
  componentDidMount() {
    this.fetchPerfURL();
    this.allEvent();
  }
  //fetch list of current strategy
  fetchPerfURL() {
    const perfURL =
      "http://" + this.props.host + ":" + this.props.port + "/service/strategy/performances";
    fetch(perfURL)
      .then(response => response.json())
      .then(perfdata => this.setState({ perfdata }));
  }

  clearEventListener() {
    this.eventSource.removeEventListener(null, null);
  }
  componentWillUnmount() {
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

    return (
      <div className={classes.root}>
       

        {/* First row */}
        <Grid container spacing={0} justify="space-between"  className={classes.firstrow}>
          <Grid item xs={6} >
        
            <Grid container spacing={0} className={classes.text}>

              <Grid item xs={12}>
              <Typography variant="h6" className={classes.typography}>
                List of Strategies
              </Typography>

              </Grid>

               
              <Grid item xs={12}>

                <Grid container spacing={8}>
                <Grid item xs={4}>
                <select onChange={this.change}>{dropdown}</select>
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
        >
          <Tab label="portfolio" value="portfolioTab" />
          <Tab label="position" value="positionTab" />
        </Tabs>
      </AppBar>
      
     
        {/* First summary tab */}
          <Collapse in={portfolioTab} style = {{transitionDelay:portfolioTab ? '2000ms':'0ms'}}>
         
               <div className={classes.tab}>
               <br/>
              <Grid container spacing={2} >
          
                <Grid item xs={6}>
                  <Grid container spacing={1}>

                    <Grid item xs={12}>
                      <Graph bardata={bar} currentStrat={currenturl} />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <OrderTable
                      
                        type={order}
                        currentStrat={currenturl}
                        numofRows={10}
                      />
                    </Grid>

                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <PositionTable
                        
                        type={position}
                        currentStrat={currenturl}
                        numofRows={3}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <SignalTable 
                      
                      type={signal} 
                      currentStrat={currenturl}
                      numofRows={4}
                      />
                    </Grid>

                    <Grid item xs={12}>
                    <CommentTable
                   
                      type={commentary}
                      currentStrat={currenturl}
                      numofRows={4}
                      height="29vh"
                    />
                    </Grid>

                  </Grid>
                </Grid>

              </Grid>
              </div>
           
        </Collapse>

          {/* Second position tab */}
          <Collapse in={positionTab} style = {{transitionDelay:positionTab ? '2000ms':'0ms'}}>
           
              <div className={classes.tab}>
              <br/>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                        <PositionTable
                          type={position}
                          currentStrat={currenturl}
                          numofRows={5}
                        />
                        </Grid>

                        <Grid item xs={12}>
                        <CommentTable
                              type={commentary}
                              currentStrat={currenturl}
                              numofRows={10}
                              height="55vh"
                            />
                        </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <StackedBarGraph
                              type={position}
                              currentStrat={currenturl}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <PositionCSGraph bardata={bar} currentStrat={currenturl} />
                          </Grid>
                      </Grid>
                  </Grid>

                  <Grid item xs={12}>
                      <Grid container spacing={1}>
                          <Grid item xs={12}>
                              <OrderPositionTable
                              type={order}
                              currentStrat={currenturl}
                              numofRows={5}
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
