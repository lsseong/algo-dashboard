import React, { Component } from "react";
import PortfolioTable from "./portfolioTable";
import QuoteTable from "./quoteTable";
import CommentTable from "./commentTable";
import Graph from "./graph";
import OrderTable from "./orderTable";
import PositionTable from "./positionTable";
import SignalTable from "./signalTable";
import OrderPositionTable from "./orderPositionTable";
import StackedBarGraph from "./statckBarGraph";
import PositionCSGraph from "./positionCandleStick";
import PnLPanel from "./PnlPanel";

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
      currenttab: "portfolio"
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
      "http://" +
        this.props.host +
        ":" +
        this.props.port +
        "/service/" +
        event.target.value
    );
    console.log(event.target.value);
    //set eventlistener to current event
    this.allEvent();
  };

  allEvent = () => {
    //when eventsource open
    this.eventSource.onopen = function(e) {
      console.log("EventSource started.");
      this.setState({
        serverconnect: true
      });
    }.bind(this);

    //when eventsource have error
    this.eventSource.onerror = function(e) {
      console.log("EventSource failed.");
      this.setState({
        serverconnect: false
      });
    }.bind(this);

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
    this.eventSource.addEventListener("position", position =>
      this.setState({ position: JSON.parse(position.data) })
    );
    this.eventSource.addEventListener("order", order =>
      this.setState({ order: JSON.parse(order.data) })
    );
    this.eventSource.addEventListener("bar", bar =>
      this.setState({ bar: JSON.parse(bar.data) })
    );
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
      "http://" +
      this.props.host +
      ":" +
      this.props.port +
      "/service/strategy/performances";
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
  checkSelectedTab = event => {
    this.setState({
      currenttab: event.target.name
    });
  };

  //render DOM set all the components here
  render() {
    const { signal } = this.state;
    const { quote } = this.state;
    const { position } = this.state;
    const { order } = this.state;
    const { portfolio } = this.state;
    const { bar } = this.state;
    const { currenturl } = this.state;
    const { commentary } = this.state;
    const { serverconnect } = this.state;
    const { currenttab } = this.state;
    const dropdown = this.state.perfdata.map((object, i) => (
      <option key={i} value={object.id}>
        {object.id}
      </option>
    ));

    return (
      <div className="small container-fluid ">
        <div className="row">
          <div className="col-md-12">
            <div className="row ">
              <div className="col-md-12 small" />
            </div>
          </div>
        </div>

        {/* First row */}
        <div className="row small">
          <div className="col-md-12">
            <div className="row justify-content-between">
              <div className="col-md-2">
                <h6>List of Strategies</h6>
                <select onChange={this.change}>{dropdown}</select>
              </div>
              <div className="col-md-2">
                {serverconnect ? (
                  <div>
                    Connection Status :{" "}
                    <span style={{ color: "#03c03c" }}>Connected</span>{" "}
                  </div>
                ) : (
                  <div>
                    Connection Status :{" "}
                    <span style={{ color: "red" }}>Disconnected</span>
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <PnLPanel data={portfolio} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-toggle="tab"
              href="#portfolio"
              name="portfolio"
              onClick={this.checkSelectedTab}
            >
              Portfolio
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-toggle="tab"
              href="#position"
              name="position"
              onClick={this.checkSelectedTab}
            >
              Positions
            </a>
          </li>
        </ul>

        {/* First summary tab */}
        <div className="tab-content">
          <div className="tab-pane active" id="portfolio">
            {currenttab === "portfolio" ? (
              <div>
                <br />
                <div className="row">
                  <div className="col-md-6">
                    <Graph bardata={bar} currentStrat={currenturl} />
                    <OrderTable
                      className="container"
                      type={order}
                      currentStrat={currenturl}
                      numofRows={10}
                    />
                  </div>

                  <div className="col-md-6">
                    <PositionTable
                      className="container"
                      type={position}
                      currentStrat={currenturl}
                      numofRows={3}
                    />
                    <SignalTable
                      className="container"
                      type={signal}
                      currentStrat={currenturl}
                    />
                    <CommentTable
                      className="container"
                      type={commentary}
                      currentStrat={currenturl}
                      numofRows={3}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Second position tab */}
          <div className="tab-pane" id="position">
            {currenttab === "position" ? (
              <div>
                <br />
                <div className="row">
                  <div className="col-md-4 ">
                    <PositionTable
                      className="container"
                      type={position}
                      currentStrat={currenturl}
                      numofRows={5}
                    />
                    <OrderPositionTable
                      className="container"
                      type={order}
                      currentStrat={currenturl}
                      numofRows={5}
                    />
                  </div>
                  <div className="col-md-4 small">
                    <StackedBarGraph
                      className="container"
                      type={position}
                      currentStrat={currenturl}
                    />
                    <PositionCSGraph bardata={bar} currentStrat={currenturl} />
                  </div>
                  <div className="col-md-4">
                    <CommentTable
                      className="container"
                      type={commentary}
                      currentStrat={currenturl}
                      numofRows={10}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
