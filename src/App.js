import React, { Component } from "react";
import Dashboard from "./components/dashboard/main/Dashboard";
import {
  withStyles,
  TextField,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Snackbar,
} from "@material-ui/core";
import PropTypes from "prop-types";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
// import DoubleGraph from '../src/components/dashboard/graph/doubleCharts';
const LAYOUT_MAPPING = require("../src/components/dashboard/main/layout/layout_map.json");

require("dotenv").config();

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },

      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
})(TextField);

const styles = (theme) => ({
  formgroup: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  appbar: {
    backgroundColor: "#404040",
  },

  textfield: {
    minWidth: "200px",
  },

  button: {
    fontSize: "15px",
    minWidth: "150px",
    color: "white",
    borderColor: "white",
    fontFamily: "TitilliumWeb_Regular",
  },
  settings: {
    color: "white",
    borderColor: "white",
    fontFamily: "TitilliumWeb_Regular",
  },

  labelProps: {
    color: "white",
    fontFamily: "TitilliumWeb_Regular",
  },
  root: {
    overflowX: "hidden",
    overflowY: "hidden",
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initStrat: "",
      connectstatus: "Connect",
      host: process.env.REACT_APP_URL_MAIN,
      port: process.env.REACT_APP_URL_PORT,
      disabled: false,
      initData: false,
      portfolioLayout: [2, 4, 1, 8],
      positionLayout: [5, 2, 4, 7, 3],
      signalLayout: [2, 8, 6, 9],
      open: false,
      snackBarOpen: false,
      snackBarStatus: false,
    };
    this.conStatus = false;
  }

  //when component mount fetch 1st strategy name
  initConnection = (host, port) => {
    const URL = "http://" + host + ":" + port + "/service/strategy/statuses";

    fetch(URL)
      .then((response) => response.json())
      .then((data) =>
        this.setState({ initStrat: data[0].id, initData: true }, () =>
          console.log(this.state.initStrat)
        )
      )
      .catch((err) => {
        if (!err.response) {
          // network error
          this.errorStatus = "Error: Network Error";
        } else {
          this.errorStatus = err.response.data.message;
        }
      });
  };
  handleClickOpen = () => {
    //  console.log('open')
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    // console.log('close')
    this.setState({
      open: false,
    });
  };

  handleSBOpen = (msgstatus) => {
    this.setState({
      snackBarOpen: true,
      snackBarStatus: msgstatus,
    });
  };

  handleSBClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      snackBarOpen: false,
    });
  };

  getAndSetLayout = () => {
    // localStorage.clear();
    let currentLayoutVersion = JSON.parse(
      localStorage.getItem("layoutVersion")
    );

    if (currentLayoutVersion !== process.env.REACT_APP_LAYOUT_VER) {
      console.log("clear cache");
      localStorage.clear();
      localStorage.setItem(
        "layoutVersion",
        JSON.stringify(process.env.REACT_APP_LAYOUT_VER)
      );
    }

    let tempPortfolioLayout = JSON.parse(
      localStorage.getItem("portfolioLayout")
    );
    let tempPositionLayout = JSON.parse(localStorage.getItem("positionLayout"));
    let tempSignalLayout = JSON.parse(localStorage.getItem("signalLayout"));
    // console.log( tempPortfolioLayout,  tempPositionLayout,tempSignalLayout)

    if (tempPortfolioLayout === null) {
      console.log("tempPortfolioLayout does not exist");

      localStorage.setItem(
        "portfolioLayout",
        JSON.stringify(this.state.portfolioLayout)
      );
    } else {
      this.setState({
        portfolioLayout: tempPortfolioLayout,
      });
    }

    if (tempPositionLayout === null) {
      console.log("tempPositionLayout does not exist");

      localStorage.setItem(
        "positionLayout",
        JSON.stringify(this.state.positionLayout)
      );
    } else {
      this.setState({
        positionLayout: tempPositionLayout,
      });
    }

    if (tempSignalLayout === null) {
      console.log("tempSignalLayout does not exist");

      localStorage.setItem(
        "signalLayout",
        JSON.stringify(this.state.signalLayout)
      );
    } else {
      this.setState({
        signalLayout: tempSignalLayout,
      });
    }
  };

  setLocalStorage = (itemName, data) => {
    localStorage.setItem(itemName, JSON.stringify(data));
    let results = JSON.parse(localStorage.getItem(itemName));
    console.log(results, data);
    console.log(String(results) === String(data));

    if (String(results) === String(data)) {
      console.log(itemName, "was stored successfully");
      this.handleSBOpen(true);
    } else {
      this.handleSBOpen(false);
      console.log(itemName, "storage failed");
    }
  };

  componentDidMount() {
    this.getAndSetLayout();
  }

  //when clicked connection
  handleConnection = () => {
    //when host and port is not empty
    if (this.state.host !== "" && this.state.port !== "") {
      //when the status button is connect
      if (this.state.connectstatus === "Connect") {
        //call initial connection
        this.initConnection(this.state.host, this.state.port);

        //setstate of button and textbox
        this.setState({
          connectstatus: "Disconnect",
          disabled: true,
        });
        //set connect status
        this.conStatus = true;
        //when the status button is disconnect
      } else if (this.state.connectstatus === "Disconnect") {
        //set connection to false
        this.conStatus = false;
        //set state
        this.setState({
          connectstatus: "Connect",
          disabled: false,
          initData: false,
        });
      } else {
        //when fields are empty
        alert("Please Enter the Host And Port");
      }
    }
  };
  //change the textfields state
  connectionInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  keyPress = (e) => {
    if (e.keyCode === 13) {
      //  console.log('value', e.target.value);
      // submit connection
      this.handleConnection();
    }
  };

  handleChange = (event) => {
    const id = event.target.id;
    const name = event.target.name;
    let tempArr = [];

    if (name === "portfolioLayout") {
      tempArr = this.state.portfolioLayout;
      tempArr[id] = parseInt(event.target.value);
    } else if (name === "positionLayout") {
      tempArr = this.state.positionLayout;
      tempArr[id] = parseInt(event.target.value);
    } else if (name === "signalLayout") {
      tempArr = this.state.signalLayout;
      tempArr[id] = parseInt(event.target.value);
    }

    if (tempArr.length > 0) {
      this.setState(
        {
          [name]: tempArr,
        },
        () => this.setLocalStorage(name, tempArr)
      );
    }

    // this.tempArr[type][id] = parseInt(event.target.value)

    // console.log(this.tempArr)
    // console.log(this.state.portfolioLayout)
  };

  //send first strategy to Strategy list when rendering DOM
  render() {
    const { initStrat } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const { initData } = this.state;
    const { portfolioLayout } = this.state;
    const { positionLayout } = this.state;
    const { signalLayout } = this.state;
    const { classes } = this.props;

    const allComponent = Object.keys(LAYOUT_MAPPING).map((item, index) => (
      <option key={index} value={item}>
        {LAYOUT_MAPPING[item]}
      </option>
    ));

    const currentPortfolioLayout = this.state.portfolioLayout.map(
      (item, index) => {
        if (
          this.state.portfolioLayout.length === index + 1 &&
          (index + 1) % 2 === 1
        ) {
          return (
            <Grid item xs={12} key={index}>
              <select
                id={index}
                name="portfolioLayout"
                onChange={this.handleChange}
                value={item}
              >
                {allComponent}
              </select>
            </Grid>
          );
        } else {
          return (
            <Grid item xs={6} key={index}>
              <select
                id={index}
                name="portfolioLayout"
                onChange={this.handleChange}
                value={item}
              >
                {allComponent}
              </select>
            </Grid>
          );
        }
      }
    );

    const currentPositionLayout = this.state.positionLayout.map(
      (item, index) => {
        if (
          this.state.positionLayout.length === index + 1 &&
          (index + 1) % 2 === 1
        ) {
          return (
            <Grid item xs={6} key={index}>
              <select
                id={index}
                name="positionLayout"
                onChange={this.handleChange}
                value={item}
              >
                {allComponent}
              </select>
            </Grid>
          );
        } else {
          if (index <= 1) {
            return (
              <Grid item xs={3} key={index}>
                <select
                  id={index}
                  name="positionLayout"
                  onChange={this.handleChange}
                  value={item}
                >
                  {allComponent}
                </select>
              </Grid>
            );
          }

          return (
            <Grid item xs={6} key={index}>
              <select
                id={index}
                name="positionLayout"
                onChange={this.handleChange}
                value={item}
              >
                {allComponent}
              </select>
            </Grid>
          );
        }
      }
    );

    const currentSignalLayout = this.state.signalLayout.map((item, index) => {
      if (
        this.state.signalLayout.length === index + 1 &&
        (index + 1) % 2 === 1
      ) {
        return (
          <Grid item xs={12} key={index}>
            <select
              id={index}
              name="signalLayout"
              onChange={this.handleChange}
              value={item}
            >
              {allComponent}
            </select>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={6} key={index}>
            <select
              id={index}
              name="signalLayout"
              onChange={this.handleChange}
              value={item}
            >
              {allComponent}
            </select>
          </Grid>
        );
      }
    });

    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar
              position="static"
              color="inherit"
              className={classes.appbar}
            >
              <Toolbar variant="dense">
                {/* First Row - input fields and buttons */}
                <Grid
                  container
                  spacing={2}
                  className={classes.formgroup}
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                >
                  {/* The local host text field */}
                  <Grid item>
                    <CssTextField
                      required
                      id="host-required"
                      label="Hostname"
                      variant="outlined"
                      name="host"
                      value={this.state.host}
                      onChange={this.connectionInput}
                      disabled={this.state.disabled}
                      InputLabelProps={{
                        shrink: true,
                        className: classes.labelProps,
                      }}
                      onKeyDown={this.keyPress}
                      InputProps={{
                        style: {
                          fontSize: 18,
                          color: "white",
                          padding: "0px",
                          fontFamily: "TitilliumWeb_Regular",
                        },
                      }}
                    />
                  </Grid>

                  {/* The port text field */}
                  <Grid item>
                    <CssTextField
                      required
                      id="port-required"
                      label="Port"
                      name="port"
                      variant="outlined"
                      value={this.state.port}
                      onChange={this.connectionInput}
                      disabled={this.state.disabled}
                      InputLabelProps={{
                        shrink: true,
                        className: classes.labelProps,
                      }}
                      onKeyDown={this.keyPress}
                      InputProps={{
                        style: {
                          fontSize: 18,
                          color: "white",
                          padding: "0px",
                          fontFamily: "TitilliumWeb_Regular",
                        },
                      }}
                    />
                  </Grid>

                  {/* Connect Button */}
                  <Grid item>
                    <Button
                      fullWidth
                      size="large"
                      className={classes.button}
                      variant="outlined"
                      color="inherit"
                      onClick={this.handleConnection}
                    >
                      {this.state.connectstatus}
                    </Button>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    {/* settings buttons */}
                    <IconButton
                      className={classes.settings}
                      aria-label="settings"
                      component="span"
                      onClick={this.handleClickOpen}
                    >
                      <SettingsIcon disabled={this.state.disabled} />
                    </IconButton>
                    {/* pop up dialog box with the form */}
                    <Dialog
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">Settings</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Change the layout of the dashboard ,empty spaces are
                          collapsed.
                        </DialogContentText>
                        Portfolio
                        <Grid container spacing={4}>
                          {currentPortfolioLayout}
                        </Grid>
                        Position
                        <Grid container spacing={4}>
                          {currentPositionLayout}
                        </Grid>
                        Signal
                        <Grid container spacing={4}>
                          {currentSignalLayout}
                        </Grid>
                      </DialogContent>
                    </Dialog>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Grid>

          {/* Second Row - Main Body */}
          <Grid item xs={12}>
            <div>
              {initData ? (
                <Dashboard
                  portfolioLayout={portfolioLayout}
                  positionLayout={positionLayout}
                  signalLayout={signalLayout}
                  url={initStrat}
                  host={host}
                  port={port}
                />
              ) : null}
            </div>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          message={
            this.state.snackBarStatus
              ? "Sucessfully edited layout"
              : "Failed to edit layout"
          }
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSBClose}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSBClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        ></Snackbar>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
