import React, { Component } from "react";
import Dashboard from "./components/dashboard/Dashboard";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initStrat: "",
      connectstatus: "Connect",
      host: "",
      port: "",
      disabled: false,
      initData: false
    };
    this.conStatus = false;
  }

  //when component mount fetch 1st strategy name
  initConnection(host, port) {
    const URL =
      "http://" + host + ":" + port + "/service/strategy/performances";
    fetch(URL)
      .then(response => response.json())
      .then(data => this.setState({ initStrat: data[0].id, initData: true }));
  }

  //when clicked connection
  handleConnection = event => {
    //when host and port is not empty
    if (this.state.host !== "" && this.state.port !== "") {
      //when the status button is connect
      if (this.state.connectstatus === "Connect") {
        //call initial connection
        this.initConnection(this.state.host, this.state.port);

        //setstate of button and textbox
        this.setState({
          connectstatus: "Disconnect",
          disabled: true
        });
        //set connect status
        this.conStatus = true;
        //send the host ,port,status to server side
        fetch("http://localhost:4001/url", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            host: this.state.host,
            port: this.state.port,
            status: this.conStatus
          })
        });

        //when the status button is disconnect
      } else if (this.state.connectstatus === "Disconnect") {
        //set connection to false
        this.conStatus = false;
        //set state
        this.setState({
          connectstatus: "Connect",
          disabled: false,
          initData: false
        });

        //send connection info to server side
        fetch("http://localhost:4001/url", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            host: this.state.host,
            port: this.state.port,
            status: this.conStatus
          })
        });
      }
    } else {
      //when fields are empty
      alert("Please Enter the Host And Port");
    }

    event.preventDefault();
  };

  //change the textfields state
  connectionInput = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  //send first strategy to Strategy list when rendering DOM
  render() {
    const { initStrat } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const { initData } = this.state;
    return (
      <div className="App col-md-12">
        <div className="row">
          <div className="col-md-4">
            <form
              onSubmit={this.handleConnection.bind(this)}
              className="form-control-sm"
            >
              <div className="form-row">
                <div className="col">
                  <input
                    type="text"
                    name="host"
                    className="form-control form-control-sm"
                    placeholder="Hostname"
                    value={this.state.host}
                    onChange={this.connectionInput}
                    disabled={this.state.disabled ? "disabled" : ""}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="port"
                    className="form-control form-control-sm"
                    placeholder="Port"
                    value={this.state.port}
                    onChange={this.connectionInput}
                    disabled={this.state.disabled ? "disabled" : ""}
                    required
                  />
                </div>
                <div className="col">
                  <button
                    type="submit"
                    className="btn btn-outline-primary btn-sm btn-block"
                    value={this.state.connectstatus}
                  >
                    {this.state.connectstatus}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-md-12">
            {initData ? (
              <Dashboard url={initStrat} host={host} port={port} />
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default App;
