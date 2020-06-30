import React, { Component } from "react";
import CommentTable from "../table/commentTable";
import CandleStickGraph from "../graph/candleStickGraph";
import OrderTable from "../table/orderTable";
import PositionTable from "../table/positionTable";
import SignalTable from "../table/signalTable";
import OrderPositionTable from "../table/orderPositionTable";
import StackedBarGraph from "../graph/stackBarGraph";
import PnLPanel from "./Panel/PnlPanel";
import SignalLineGraph from '../graph/signalLineGraph';
import AnalyticsTable from '../table/analyticsTable';
// import Draggable from "../main/Draggable/draggable";
// import Droppable from "../main/Droppable/droppable";
// import DoubleGraph from '../graph/doubleCharts';
import BarChart from '../graph/BarChart';
import {withStyles,Tabs,Grid,Tab,AppBar, Typography,Collapse,} from '@material-ui/core';
import PropTypes from 'prop-types';
const LAYOUT_MAPPING = require('../main/layout/layout_map.json');

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
      analytic: [],
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
      allPositions:[],
      allBarSignals:[],
      portfolioTabLayout:this.props.portfolioLayout,
      positionTabLayout:this.props.positionLayout,
      
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
    this.currentPositions = new Map();
  }

  getOrCreateRef(id,ref=null) {
    if (!this.securitychild.hasOwnProperty(id)) {
        this.securitychild[id] = ref
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
      analytic: [],
      currenturl: event.target.value,
      securityList: [],
      allPositions:[],
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
      let ref = this.getOrCreateRef(key);
      ref.changeSecurity(this.selectedSecurity);
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
      let inputPosition = JSON.parse(position.data);
      inputPosition.unrealizedPnl = Number(inputPosition.unrealizedPnl).toFixed(2);
      inputPosition.realizedPnl = Number(inputPosition.realizedPnl).toFixed(2);

      this.setState({ position: inputPosition },()=>this.positionBuffer(this.state.position));
    });
    this.eventSource.addEventListener("order", order =>
      this.setState({ order: JSON.parse(order.data) })
    );
    this.eventSource.addEventListener("bar", bar => 
   
    this.setState({ bar: JSON.parse(bar.data) },()=>this.addSecurity(this.state.bar.symbol))
   
    
    );

    this.eventSource.addEventListener("signal", signal =>
      this.setState({ signal: JSON.parse(signal.data)})
    );

    this.eventSource.addEventListener("analytic", analytic =>
    this.setState({ analytic: JSON.parse(analytic.data)})
  );
  };
 
  positionBuffer=(data)=>{
    if(data !== undefined){
     
      let tempPos = [].concat(this.state.allPositions);
       
      let pt = tempPos.findIndex(i => i.symbol === data.symbol);
 

      if (pt >= 0) {

        tempPos[pt]['position'] = data.position;
        
      } else {

        let item = {
          symbol: data.symbol,
          position: data.position
        }

        tempPos.push(item)
      }
      this.setState({
        allPositions:tempPos
      })
    }
 
    
  }
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
    this.getComponent();
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
  


  getComponent = (componentType)=>{
    let item = LAYOUT_MAPPING[componentType]
    let component;
    switch(item){
      case LAYOUT_MAPPING[1] :
        // comment table
        component = <CommentTable
        type={this.state.commentary}
        currentStrat={this.state.currenturl}
        height={this.COMPONENT_HEIGHT}
      />
        break;
      case LAYOUT_MAPPING[2] :
        // console.log(csid)
        // console.log(csid)
        // candle stick graph
        component = <div>
                    {this.state.bar
                    ?<CandleStickGraph 
                    onRef={(id,ref) => (this.getOrCreateRef(id,ref))}
                    height={this.COMPONENT_HEIGHT} 
                    bardata={this.state.bar} 
                    currentStrat={this.state.currenturl} 
                    />
                    :null
                    }
                    </div>

        break;
      case LAYOUT_MAPPING[3] :
        // order table
        component = <OrderTable
                      height={this.COMPONENT_HEIGHT}
                      isMobile={this.isMobile}
                      type={this.state.order}
                      currentStrat={this.state.currenturl}
                    />
        break;
      case LAYOUT_MAPPING[4] :
        // position table
        component =  <PositionTable
                      height={this.COMPONENT_HEIGHT}
                      isMobile={this.isMobile}
                      type={this.state.position}
                      currentStrat={this.state.currenturl}
                    />
        break;       
      case LAYOUT_MAPPING[5] :
        // stacked bar graph

        component = <BarChart id="barChart" 
                    data ={this.state.allPositions} 
                     height={this.COMPONENT_HEIGHT}/>
        // component = <StackedBarGraph
        //             type={this.state.position}
        //             currentStrat={this.state.currenturl}
        //             height={this.COMPONENT_HEIGHT}
              
        //             />
        break;
      case LAYOUT_MAPPING[6] :
        // signal line graph

        component = <SignalLineGraph 
                    height={this.COMPONENT_HEIGHT} 
                    signaldata={this.state.signal} 
                    currentStrat={this.state.currenturl}/>
        break;
      case LAYOUT_MAPPING[7] :
        // order position table
      component =   <OrderPositionTable
                    isMobile={this.isMobile}
                    type={this.state.order}
                    currentStrat={this.state.currenturl}
                    height={this.COMPONENT_HEIGHT}
                    />
        break;
      case LAYOUT_MAPPING[8] :
        // signal table
        component =  <SignalTable 
                      height={this.COMPONENT_HEIGHT}
                      isMobile={this.isMobile}
                      type={this.state.signal} 
                      currentStrat={this.state.currenturl}
                      />
        break;
        case LAYOUT_MAPPING[9] :
          // signal table
          component =  <AnalyticsTable 
                        height={this.COMPONENT_HEIGHT}
                        isMobile={this.isMobile}
                        type={this.state.analytic} 
                        currentStrat={this.state.currenturl}
                        />
          break;


        
      default:
        // console.log(item,'out of range')
        component = undefined
          
    }
    return component
  }


  //render DOM set all the components here
  render() {
    const { portfolio } = this.state;
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

    const portfolioLayout = this.state.portfolioTabLayout.map((item,index)=>{

      if(this.state.portfolioTabLayout.length ===index+1 && (index+1) % 2 === 1){
        return( <Grid item xs={12} key = {index}>
         {this.getComponent(item)}
       </Grid>)
       }else{
        return( <Grid item sm={6} xs={12} key = {index}>
          {this.getComponent(item)}
        </Grid>)
       }


      }
    )

    const positionLayout = this.state.positionTabLayout.map((item,index)=>{
 
      if(this.state.positionTabLayout.length === index+1 && (index+1) % 2 === 1){
        return( <Grid item xs={12} key ={index}>
         {this.getComponent(item)}
       </Grid>)
       }else{
        return( <Grid item sm={6} xs={12} key = {index}>
          {this.getComponent(item)}
        </Grid>)
       }


      }
    )

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
               
              <Grid container spacing={1} >
                
                {portfolioLayout}
              </Grid>
            </div>
           
        </Collapse>
                     
          {/* Second position tab */}
          <Collapse in={positionTab}>
           
              <div className={classes.tab}>
              <br/>
                <Grid container spacing={1}>
                {positionLayout}
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
