import React, { Component } from "react";
import CommentTable from "../table/commentTable";
// import CandleStickGraph from "../graph/candleStickGraph";
import OrderTable from "../table/orderTable";
import PositionTable from "../table/positionTable";
import SignalTable from "../table/signalTable";
import OrderPositionTable from "../table/orderPositionTable";
// import StackedBarGraph from "../graph/stackBarGraph";
import TradingChart from "../graph/TradingChart";
import PnLPanel from "./Panel/PnlPanel";
// import SignalLineGraph from "../graph/signalLineGraph";
import AnalyticsLineChart from "../graph/AnalyticsLineGraph";
import AnalyticsTable from "../table/analyticsTable";
import ConfigTable from "../table/configTable";
import DialogContainer from "../../ui-components/dialog";
import NativeDropdown from "../../ui-components/nativeDropdown";
// import Draggable from "../main/Draggable/draggable";
// import Droppable from "../main/Droppable/droppable";
// import DoubleGraph from '../graph/doubleCharts';

import BarChart from "../graph/BarChart";
import {
  withStyles,
  Tabs,
  Grid,
  Tab,
  AppBar,
  Typography,
  Collapse,
  Toolbar,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import PropTypes from "prop-types";

const LAYOUT_MAPPING = require("../main/layout/layout_map.json");

const styles = (theme) => ({
  root: {
    width: "98%",
    fontSize: "12px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  appbar: {
    backgroundColor: "#484848",
  },
  firstrow: {
    width: "98%",
    color: "white",
    fontFamily: "TitilliumWeb_Regular",
  },
  text: {
    marginLeft: "8px",
  },
  tab: {
    backgroundColor: "#383838",
  },
  tabGroup: {
    flexGrow: 1,
  },
  configButton: {
    maxwidth: "150px",
  },
  typography: {
    fontFamily: "TitilliumWeb_Regular",
  },
  droppable: {
    width: "100%",
    height: "100%",
  },
  wrapper: {
    width: "100%",
    padding: "32px",
    backgroundColor: "yellow",
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
      analytic: [],

      perfdata: [],
      statsdata: [],
      order: [],
      portfolio: {},
      currenturl: this.props.url,
      serverconnect: true,
      currenttab: "portfolioTab",
      portfolioTab: true,
      positionTab: false,
      signalTab: false,
      configTab: false,
      currentPriceTab: "stackedBar",
      stackedBar: true,
      priceBar: false,
      securityList: [],
      allPositions: [],
      currentBar: [],
      currentSignal: [],
      currentAnalytic: [],
      currentAnalyticsView: [],
      securityAnalyticsConfigSelection: null,
      analyticsIsOpen: false,
      portfolioTabLayout: this.props.portfolioLayout,
      positionTabLayout: this.props.positionLayout,
      signalTabLayout: this.props.signalLayout,
    };

    //open eventsource base on current url
    this.eventSource = new EventSource(
      "http://" +
        this.props.host +
        ":" +
        this.props.port +
        "/service/" +
        this.props.url
    );

    this.tabVariant = "standard";
    this.isMobile = false;
    this.COMPONENT_HEIGHT = "400px";
    this.selectedSecurity = "";
    this.securitychild = {};
    this.MAX_DATA_POINT = 50;
    this.allBars = new Map();
    this.allSignals = new Map();
    this.allAnalytics = new Map();
    this.analyticsView = new Map();
  }

  getOrCreateRef(id, ref = null) {
    if (!this.securitychild.hasOwnProperty(id)) {
      this.securitychild[id] = ref;
    }
    return this.securitychild[id];
  }

  //on drop down change
  changeStrategy = (event) => {
    //close current eventsource
    this.eventSource.close();
    //set current state to default and initalise currenturl to changed event
    this.setState({
      quote: [],
      position: [],
      commentary: [],
      signal: [],

      order: [],
      portfolio: {},
      analytic: [],
      currenturl: event.target.value,
      securityList: [],
      allPositions: [],
      currentBar: [],
      currentSignal: [],
      currentAnalytic: [],
    });
    this.allBars = new Map();
    this.allSignals = new Map();
    this.allAnalytics = new Map();
    //open eventsource base on new event
    this.eventSource = new EventSource(
      "http://" +
        this.props.host +
        ":" +
        this.props.port +
        "/service/" +
        event.target.value
    );

    //set eventlistener to current event
    this.allEvent();
  };

  changeSecurity = (event) => {
    this.selectedSecurity = event.target.value;
    console.log("change", this.selectedSecurity);
    Object.entries(this.securitychild).forEach(([key, value]) => {
      let ref = this.getOrCreateRef(key);
      ref.changeSecurity(this.selectedSecurity);
    });

    this.setState({
      currentBar: this.allBars.get(event.target.value),
      currentAnalytic: this.allAnalytics.get(event.target.value),
      currentSignal: this.allSignals.get(event.target.value),
    });
  };

  allEvent = () => {
    //when eventsource open
    this.eventSource.onopen = (e) => {
      console.log("EventSource started.");
      this.setState({
        serverconnect: true,
      });
    };

    //when eventsource have error
    this.eventSource.onerror = (e) => {
      console.log("EventSource failed.");
      this.setState({
        serverconnect: false,
      });
    };

    //all the eventlisteners for current events
    this.eventSource.addEventListener("quote", (quote) =>
      this.setState({ quote: JSON.parse(quote.data) })
    );
    this.eventSource.addEventListener("commentary", (commentary) =>
      this.setState({ commentary: JSON.parse(commentary.data) })
    );
    this.eventSource.addEventListener("portfolio", (portfolio) =>
      this.setState({ portfolio: JSON.parse(portfolio.data) })
    );
    this.eventSource.addEventListener("position", (position) => {
      let inputPosition = JSON.parse(position.data);
      inputPosition.unrealizedPnl = Number(inputPosition.unrealizedPnl).toFixed(
        2
      );
      inputPosition.realizedPnl = Number(inputPosition.realizedPnl).toFixed(2);

      this.setState({ position: inputPosition }, () =>
        this.positionBuffer(this.state.position)
      );
    });
    this.eventSource.addEventListener("order", (order) =>
      this.setState({ order: JSON.parse(order.data) })
    );
    this.eventSource.addEventListener("bar", (bar) => {
      let newBar = JSON.parse(bar.data);
      this.securityBuffer(newBar);
    });

    this.eventSource.addEventListener("signal", (signal) =>
      this.setState({ signal: JSON.parse(signal.data) }, () =>
        this.signalBuffer(this.state.signal)
      )
    );

    this.eventSource.addEventListener("analytic", (analytic) =>
      this.setState({ analytic: JSON.parse(analytic.data) }, () =>
        this.analyticsBuffer(this.state.analytic)
      )
    );
  };

  positionBuffer = (data) => {
    if (data !== undefined) {
      let tempPos = [].concat(this.state.allPositions);

      let pt = tempPos.findIndex((i) => i.symbol === data.symbol);

      if (pt >= 0) {
        tempPos[pt]["position"] = data.position;
      } else {
        let item = {
          symbol: data.symbol,
          position: data.position,
        };

        tempPos.push(item);
      }
      this.setState({
        allPositions: tempPos,
      });
    }
  };

  analyticsBuffer = (data) => {
    if (data !== undefined) {
      let symbol = data.key;
      let hasKey = this.allAnalytics.has(symbol);

      let spiltTime = data.time.split(":");
      let newDate = new Date();
      newDate.setHours(spiltTime[0]);
      newDate.setMinutes(spiltTime[1]);
      newDate.setSeconds(spiltTime[2]);

      let analytic = {
        time: newDate,
        key: data.key,
        name: data.name,
        value: data.value,
      };

      // console.log(data.time)
      if (hasKey === false) {
        let newAnalytic = new Map();
        let analyticsView = new Map();

        newAnalytic.set(data.name, [analytic]);
        analyticsView.set(data.name, true);
        this.allAnalytics.set(symbol, newAnalytic);
        //controller to control which analytics to display on the chart
        this.analyticsView.set(symbol, analyticsView);

        if (this.allAnalytics.size === 1) {
          this.setState({
            currentAnalytic: newAnalytic,
            currentAnalyticsView: analyticsView,
          });
        }
      } else {
        let currentAnalytics = this.allAnalytics.get(symbol);
        let currentAnalyticsView = this.analyticsView.get(symbol);
        let hasAnalytics = currentAnalytics.has(data.name);
        if (hasAnalytics === false) {
          currentAnalytics.set(data.name, [analytic]);
          currentAnalyticsView.set(data.name, true);
        } else {
          let singleAnalytics = currentAnalytics.get(data.name);
          let tempAnalytics = [].concat(singleAnalytics);
          tempAnalytics.push(analytic);

          if (tempAnalytics.length > this.MAX_DATA_POINT) {
            tempAnalytics.shift();
          }

          currentAnalytics.set(data.name, tempAnalytics);
        }

        this.allAnalytics.set(symbol, currentAnalytics);
      }

      if (symbol === this.selectedSecurity) {
        let newobj = this.allAnalytics.get(this.selectedSecurity);
        let showableAnalytics = this.analyticsView.get(this.selectedSecurity);
        // console.log(showableAnalytics);
        let tempArray = [];
        showableAnalytics.forEach((item, key) => {
          if (item === true) {
            tempArray.push(key);
          }
        });
        let finalobj = new Map();
        tempArray.forEach((analytics) => {
          let tempObj = newobj.get(analytics);

          finalobj.set(analytics, tempObj);
        });

        this.setState(
          {
            currentAnalytic: finalobj,
          },
          () => console.log(this.state.currentAnalytic)
        );
      }
      // console.log(this.state.currentAnalyticsView);
    }
  };
  handleCheckBoxChanges = (event) => {
    let value = event.target.checked;
    let name = event.target.name;
    let security = this.state.securityAnalyticsConfigSelection;

    let tempAnalyticsConfig = this.analyticsView.get(security);
    console.log(value, name, security, tempAnalyticsConfig);
    tempAnalyticsConfig.set(name, value);
    this.analyticsView.set(security, tempAnalyticsConfig);
  };
  handleOpenAnalyticsSettings = () => {
    let newObj = {
      key: new Date(),
      value: true,
    };
    this.setState({
      analyticsIsOpen: newObj,
    });
  };

  handleCloseAnalyticsSettings = () => {
    let newObj = {
      key: new Date(),
      value: false,
    };
    this.setState({
      analyticsIsOpen: newObj,
    });
  };
  handleChangeSecurityAnalyticsConfigSelection = (event) => {
    let value = event.target.value;
    this.setState({
      securityAnalyticsConfigSelection: value,
    });
  };

  signalBuffer = (data) => {
    if (data !== undefined) {
      let symbol = data.symbol;
      let hasKey = this.allSignals.has(symbol);

      let spiltTime = data.time.split(":");
      let newDate = new Date();
      newDate.setHours(spiltTime[0]);
      newDate.setMinutes(spiltTime[1]);
      newDate.setSeconds(spiltTime[2]);

      let signal = {
        time: newDate,
        symbol: data.symbol,
        signal: data.signal,
      };

      if (hasKey === false) {
        this.allSignals.set(symbol, [signal]);

        if (this.allSignals.size === 1) {
          this.setState({
            currentSignal: [signal],
          });
        }
      } else {
        let currentSignals = this.allSignals.get(symbol);
        let tempSignals = [].concat(currentSignals);
        tempSignals.push(signal);
        if (tempSignals.length > this.MAX_DATA_POINT) {
          tempSignals.shift();
        }

        this.allSignals.set(symbol, tempSignals);
      }

      if (symbol === this.selectedSecurity) {
        let newobj = this.allSignals.get(this.selectedSecurity);
        this.setState(
          {
            currentSignal: newobj,
          }
          // () => console.log(this.state.currentSignal)
        );
      }
    }
  };

  securityBuffer = (data) => {
    if (data !== undefined) {
      let symbol = data.symbol;

      this.addSecurity(symbol);

      let hasKey = this.allBars.has(symbol);
      data.time = new Date(data.time);
      if (hasKey === false) {
        this.allBars.set(symbol, [data]);

        if (this.allBars.size === 1) {
          this.setState({
            currentBar: [data],
          });
        }
      } else {
        let currentBars = this.allBars.get(symbol);
        let tempBars = [].concat(currentBars);
        tempBars.push(data);
        if (tempBars.length > this.MAX_DATA_POINT) {
          tempBars.shift();
        }
        this.allBars.set(symbol, tempBars);
      }

      if (symbol === this.selectedSecurity) {
        let newobj = this.allBars.get(this.selectedSecurity);
        this.setState({
          currentBar: newobj,
        });
      }
    }
  };

  addSecurity = (name) => {
    if (name === undefined) {
      console.log("name is null");
    }
    if (this.state.securityList.includes(name) === false) {
      let tempList = this.state.securityList;
      tempList.push(name);
      this.setState({
        securityList: tempList,
      });

      if (this.state.securityList.length === 1) {
        this.selectedSecurity = this.state.securityList[0];
        this.setState({
          securityAnalyticsConfigSelection: this.state.securityList[0],
        });
      }
    }
  };

  //when component mount initalise
  componentDidMount() {
    this.fetchStatusesURL();
    this.allEvent();
    this.detectmob();
    this.getComponent();
  }

  //fetch list of current strategy
  fetchStatusesURL() {
    const statsURL =
      "http://" +
      this.props.host +
      ":" +
      this.props.port +
      "/service/strategy/statuses";

    fetch(statsURL)
      .then((response) => response.json())
      .then((statsdata) =>
        this.setState({ statsdata }, () => console.log(this.state.statsdata))
      )
      .catch((err) => {
        console.log(err);
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
  checkSelectedTab = (event, newValue) => {
    if (newValue === "portfolioTab") {
      this.setState({
        portfolioTab: true,
        positionTab: false,
        signalTab: false,
        configTab: false,
      });
    } else if (newValue === "positionTab") {
      this.setState({
        portfolioTab: false,
        positionTab: true,
        signalTab: false,
        configTab: false,
      });
    } else if (newValue === "signalTab") {
      this.setState({
        portfolioTab: false,
        positionTab: false,
        signalTab: true,
        configTab: false,
      });
    } else if (newValue === "configTab") {
      this.setState({
        portfolioTab: false,
        positionTab: false,
        signalTab: false,
        configTab: true,
      });
    }
    this.setState({
      currenttab: newValue,
    });
  };

  checkSelectedPositionTab = (event, newValue) => {
    if (newValue === "stackedBar") {
      this.setState({
        stackedBar: true,
        priceBar: false,
      });
    } else if (newValue === "priceBar") {
      this.setState({
        stackedBar: false,
        priceBar: true,
      });
    }
    this.setState({
      currentPriceTab: newValue,
    });
  };
  detectmob = () => {
    this.isMobile = window.orientation > -1;
    if (this.isMobile) {
      this.tabVariant = "fullWidth";
    } else {
      this.tabVariant = "standard";
    }
  };

  getComponent = (componentType) => {
    let item = LAYOUT_MAPPING[componentType];
    let component;
    switch (item) {
      case LAYOUT_MAPPING[1]:
        // comment table
        component = (
          <CommentTable
            type={this.state.commentary}
            currentStrat={this.state.currenturl}
            height={this.COMPONENT_HEIGHT}
          />
        );
        break;
      case LAYOUT_MAPPING[2]:
        // candle stick graph
        // component = (
        //   <div>
        //     {this.state.bar ? (
        //       <CandleStickGraph
        //         onRef={(id, ref) => this.getOrCreateRef(id, ref)}
        //         height={this.COMPONENT_HEIGHT}
        //         bardata={this.state.bar}
        //         currentStrat={this.state.currenturl}
        //       />
        //     ) : null}
        //   </div>
        // );

        component = (
          <TradingChart
            height={this.COMPONENT_HEIGHT}
            data={this.state.currentBar}
            signalData={this.state.currentSignal}
          ></TradingChart>
        );

        break;
      case LAYOUT_MAPPING[3]:
        // order table
        component = (
          <OrderTable
            height={this.COMPONENT_HEIGHT}
            isMobile={this.isMobile}
            type={this.state.order}
            currentStrat={this.state.currenturl}
          />
        );
        break;
      case LAYOUT_MAPPING[4]:
        // position table
        component = (
          <PositionTable
            height={this.COMPONENT_HEIGHT}
            isMobile={this.isMobile}
            type={this.state.position}
            currentStrat={this.state.currenturl}
          />
        );
        break;
      case LAYOUT_MAPPING[5]:
        // stacked bar graph

        component = (
          <BarChart
            data={this.state.allPositions}
            height={this.COMPONENT_HEIGHT}
          />
        );
        // component = <StackedBarGraph
        //             type={this.state.position}
        //             currentStrat={this.state.currenturl}
        //             height={this.COMPONENT_HEIGHT}

        //             />
        break;
      case LAYOUT_MAPPING[6]:
        // signal line graph

        // component = (
        //   <SignalLineGraph
        //     height={this.COMPONENT_HEIGHT}
        //     signaldata={this.state.signal}
        //     currentStrat={this.state.currenturl}
        //   />
        // );

        component = (
          <AnalyticsLineChart
            height={this.COMPONENT_HEIGHT}
            analytics={this.state.currentAnalytic}
          ></AnalyticsLineChart>
        );

        break;
      case LAYOUT_MAPPING[7]:
        // order position table
        component = (
          <OrderPositionTable
            isMobile={this.isMobile}
            type={this.state.order}
            currentStrat={this.state.currenturl}
            height={this.COMPONENT_HEIGHT}
          />
        );
        break;
      case LAYOUT_MAPPING[8]:
        // signal table
        component = (
          <SignalTable
            height={this.COMPONENT_HEIGHT}
            isMobile={this.isMobile}
            type={this.state.signal}
            currentStrat={this.state.currenturl}
          />
        );
        break;
      case LAYOUT_MAPPING[9]:
        // signal table
        component = (
          <AnalyticsTable
            height={this.COMPONENT_HEIGHT}
            isMobile={this.isMobile}
            type={this.state.analytic}
            currentStrat={this.state.currenturl}
          />
        );
        break;

      default:
        // console.log(item,'out of range')
        component = undefined;
    }
    return component;
  };

  //render DOM set all the components here
  render() {
    const { classes } = this.props;
    const { portfolio } = this.state;
    const { serverconnect } = this.state;
    const { currenttab } = this.state;
    const { currentPriceTab } = this.state;

    const { positionTab } = this.state;
    const { portfolioTab } = this.state;
    const { signalTab } = this.state;
    const { configTab } = this.state;
    const { stackedBar } = this.state;
    const { priceBar } = this.state;

    const secdropdown = this.state.securityList.map((object, i) => (
      <option key={i} value={object}>
        {object}
      </option>
    ));
    const analyticsViewKeys = [...this.state.currentAnalyticsView.keys()];
    const analyticsList = analyticsViewKeys.map((key) => (
      <FormControlLabel
        key={key}
        control={
          <Checkbox
            checked={this.state.currentAnalyticsView.get(key)}
            onChange={this.handleCheckBoxChanges}
            name={key}
          />
        }
        label={key.toUpperCase()}
      />
    ));

    const portfolioLayout = this.state.portfolioTabLayout.map((item, index) => {
      return (
        <Grid item sm={6} xs={12} key={index}>
          {this.getComponent(item)}
        </Grid>
      );
    });

    const positionLayout = this.state.positionTabLayout.map((item, index) => {
      if (index === 0) {
        return (
          <Grid item sm={6} xs={12} key={index}>
            <AppBar position="static" className={classes.appbar}>
              <Tabs
                value={currentPriceTab}
                onChange={this.checkSelectedPositionTab}
                textColor="inherit"
                centered={this.isMobile}
                variant={this.tabVariant}
              >
                <Tab label="Position Chart" value="stackedBar" />
                <Tab label="Price Chart" value="priceBar" />
              </Tabs>
            </AppBar>

            <Collapse in={stackedBar}>
              <div className={classes.tab}>
                <Grid item>{this.getComponent(item)}</Grid>
              </div>
            </Collapse>

            <Collapse in={priceBar}>
              <div className={classes.tab}>
                <Grid item>
                  {this.getComponent(this.state.positionTabLayout[index + 1])}
                </Grid>
              </div>
            </Collapse>
          </Grid>
        );
      } else if (index > 1) {
        return (
          <Grid item sm={6} xs={12} key={index}>
            {this.getComponent(item)}
          </Grid>
        );
      } else {
        return null;
      }
    });

    const signalLayout = this.state.signalTabLayout.map((item, index) => {
      return (
        <Grid item sm={6} xs={12} key={index}>
          {this.getComponent(item)}
        </Grid>
      );
    });

    return (
      <div className={classes.root}>
        {/* First row */}
        <Grid container spacing={0} className={classes.firstrow}>
          <Grid item xs={6}>
            <Grid container spacing={0} className={classes.text}>
              <Grid item xs={4}>
                <Typography variant="h6" className={classes.typography}>
                  Strategy
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
                    <Typography
                      variant="subtitle2"
                      className={classes.typography}
                    >
                      {this.props.url}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <select onChange={this.changeSecurity}>
                      {secdropdown}
                    </select>
                  </Grid>
                  <Grid item>
                    {serverconnect ? (
                      <Typography
                        variant="caption"
                        className={classes.typography}
                      >
                        Connection Status :{" "}
                        <span style={{ color: "#03c03c" }}>Connected</span>{" "}
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        className={classes.typography}
                      >
                        Connection Status :{" "}
                        <span style={{ color: "red" }}>Disconnected</span>
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
                <PnLPanel data={portfolio} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <br />
        {/* Tabs */}
        <AppBar position="static" className={classes.appbar}>
          <Toolbar variant="dense">
            <Tabs
              value={currenttab}
              onChange={this.checkSelectedTab}
              textColor="inherit"
              centered={this.isMobile}
              variant={this.tabVariant}
              className={classes.tabGroup}
            >
              <Tab label="portfolio" value="portfolioTab" />
              <Tab label="position" value="positionTab" />
              <Tab label="signal" value="signalTab" />
              <Tab label="config" value="configTab" />
            </Tabs>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="analytics config"
                onClick={this.handleOpenAnalyticsSettings}
              >
                <ShowChartIcon />
              </IconButton>
            </Grid>
          </Toolbar>
        </AppBar>

        <DialogContainer
          dialogContextText="Choose the Analytics to show"
          title="Analytics Settings"
          actionObj={this.state.analyticsIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          {this.state.securityAnalyticsConfigSelection !== null ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <NativeDropdown
                  name="Security"
                  value={this.state.securityAnalyticsConfigSelection}
                  changeAction={
                    this.handleChangeSecurityAnalyticsConfigSelection
                  }
                >
                  {secdropdown}
                </NativeDropdown>
              </Grid>
              {this.state.currentAnalyticsView.length !== 0 ? (
                <Grid item>{analyticsList}</Grid>
              ) : (
                <Grid item>
                  <Typography variant="overline" className={classes.typography}>
                    No Analytics
                  </Typography>
                </Grid>
              )}
            </Grid>
          ) : null}
        </DialogContainer>

        {/* First portfolio tab */}
        <Collapse in={portfolioTab}>
          <div className={classes.tab}>
            <Grid container spacing={1}>
              {portfolioLayout}
            </Grid>
          </div>
        </Collapse>

        {/* Second position tab */}
        <Collapse in={positionTab}>
          <div className={classes.tab}>
            <Grid container spacing={1}>
              {positionLayout}
            </Grid>
          </div>
        </Collapse>
        {/* Third signal tab */}
        <Collapse in={signalTab}>
          <div className={classes.tab}>
            <Grid container spacing={1}>
              {signalLayout}
            </Grid>
          </div>
        </Collapse>

        <Collapse in={configTab}>
          <div className={classes.tab}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <ConfigTable
                  currentStrat={this.state.currenturl}
                  height={this.COMPONENT_HEIGHT}
                  isMobile={this.isMobile}
                  type={this.state.statsdata}
                />
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
