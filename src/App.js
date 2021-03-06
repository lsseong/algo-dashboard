import React, { Component } from "react";
import Dashboard from "./components/dashboard/main/Dashboard";
import {
  withStyles,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import PropTypes from "prop-types";
import SnackBar from "./components/ui-components/commons/snackBar";
import DialogContainer from "./components/ui-components/commons/dialog";
import DialogWithActionContainer from "./components/ui-components/commons/dialogWithActions";
import CustomButton from "./components/ui-components/commons/button";
import WhiteTextField from "./components/ui-components/commons/customTextField";
import MenuIcon from "@material-ui/icons/Menu";
import NativeDropdown from "./components/ui-components/commons/nativeDropdown";
import CreateStrategyForm from "./components/ui-components/complex/form/createNewStrategyForm";
import PermDataSettingIcon from "@material-ui/icons/PermDataSetting";

const LAYOUT_MAPPING = require("../src/components/dashboard/main/layout/layout_map.json");

require("dotenv").config();

const styles = (theme) => ({
  formgroup: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  appbar: {
    backgroundColor: "#404040",
  },
  title: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  menuButton: {
    color: "white",
  },

  root: {
    overflowX: "hidden",
    overflowY: "hidden",
  },
  list: {
    width: 250,
    maxWidth: 360,

    backgroundColor: theme.palette.background.paper,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectstatus: "Connect",
      host: process.env.REACT_APP_URL_MAIN,
      port: process.env.REACT_APP_URL_PORT,
      txtDisabled: false,
      buttonDisabled: false,
      haveData: false,
      portfolioLayout: [2, 4, 1, 8],
      positionLayout: [5, 2, 4, 7, 3],
      signalLayout: [2, 8, 6, 9],
      snackBarObj: [],
      settingsOpen: false,
      stratSettingsOpen: false,
      allStrategy: [],
      currentStrategy: "",
      drawerIsOpen: false,
      schemaDialogOpen: [],
    };
  }

  //when component mount fetch 1st strategy name
  initConnection = (host, port) => {
    const URL = "http://" + host + ":" + port + "/service/strategy/statuses";

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP status" + response.status);
        }

        return response.json();
      })
      .then((data) =>
        this.setState(
          {
            allStrategy: data,
            currentStrategy: data[0].id,
          },
          () => this.isConnected()
        )
      )
      .catch((err) => {
        if (!err.response) {
          // network error
          this.errorStatus = "Error: Network Error";
        } else {
          this.errorStatus = err.response.data.message;
          console.log(this.errorStatus);
        }
        this.handleSnackBarMessage(
          false,
          host + ":" + port + " " + String(err)
        );
        this.setState({
          allStrategy: [],
          currentStrategy: "",
          connectstatus: "Connect",
          txtDisabled: false,
          buttonDisabled: false,
        });
      });
  };

  handleClickOpenSettings = () => {
    let newObj = {
      key: new Date(),
      value: true,
    };

    this.setState({
      settingsOpen: newObj,
    });
  };

  setConnection = () => {
    //setstate of button and textbox

    if (this.state.currentStrategy.length !== 0) {
      let stratObj = {
        key: new Date(),
        value: false,
      };
      this.setState(
        {
          haveData: true,
          stratSettingsOpen: stratObj,
          connectstatus: "Disconnect",
          txtDisabled: true,
          buttonDisabled: false,
        },
        () => this.handleSnackBarMessage(true, "Connected Successfully")
      );
    }
  };

  handleClickOpenSelectStrategy = () => {
    //when host and port is not empty
    if (this.state.host !== "" && this.state.port !== "") {
      if (this.state.connectstatus === "Connect") {
        this.initConnection(this.state.host, this.state.port);
        this.setState({
          connectstatus: "Connecting..",
          txtDisabled: true,
          buttonDisabled: true,
        });
      } else if (this.state.connectstatus === "Disconnect") {
        //set state
        this.setState(
          {
            connectstatus: "Connect",
            txtDisabled: false,
            buttonDisabled: false,
            haveData: false,
          },
          () => this.handleSnackBarMessage(false, "Disconnected")
        );
      }
    } else {
      //when fields are empty
      alert("Please Enter the Host And Port");
    }
  };

  isConnected = () => {
    let newObj = {
      key: new Date(),
      value: true,
    };

    this.setState({
      stratSettingsOpen: newObj,
    });
  };

  handleCloseSelectStrategy = () => {
    // console.log('close')

    let newObj = {
      key: new Date(),
      value: false,
    };
    this.setState({
      stratSettingsOpen: newObj,
      connectstatus: "Connect",
      txtDisabled: false,
      buttonDisabled: false,
      haveData: false,
    });
  };
  handleCloseLayoutDialog = () => {
    let newObj = {
      key: new Date(),
      value: false,
    };

    this.setState({
      settingsOpen: newObj,
    });
  };

  handleSnackBarMessage = (msgstatus, msg) => {
    let newSnackBarObj = {
      key: new Date(),
      status: msgstatus,
      msg: msg,
    };

    this.setState({
      snackBarObj: newSnackBarObj,
    });
  };
  handleDrawerToggle = (e, open) => {
    this.setState({
      drawerIsOpen: open,
    });
  };

  handleOpenSchemaConfig = () => {
    let newobj = {
      key: new Date(),
      value: true,
    };

    this.setState({
      schemaDialogOpen: newobj,
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
      this.setState(
        {
          signalLayout: tempSignalLayout,
        },
        () => console.log(this.state.signalLayout)
      );
    }
  };

  setLocalStorage = (itemName, data) => {
    localStorage.setItem(itemName, JSON.stringify(data));
    let results = JSON.parse(localStorage.getItem(itemName));
    console.log(results);
    if (String(results) === String(data)) {
      console.log(itemName, "was stored successfully");
      this.handleSnackBarMessage(true, "Layout changed Successfully");
    } else {
      this.handleSnackBarMessage(false, "Layout changes failed");
      console.log(itemName, "storage failed");
    }
  };

  componentDidMount() {
    this.getAndSetLayout();
  }

  //when clicked connection

  //change the textfields state
  handleChangeState = (event) => {
    console.log(event.target.id);
    this.setState({
      [event.target.id]: event.target.value,
    });
  };
  keyPress = (e) => {
    if (e.keyCode === 13) {
      //  console.log('value', e.target.value);
      // submit connection
      this.handleClickOpenSelectStrategy();
    }
  };

  handleChangeTab = (event, index) => {
    const name = event.target.name;
    let tempArr = [];
    console.log(event.target);
    console.log(index, name, event.target.value);
    if (name === "portfolioLayout") {
      tempArr = this.state.portfolioLayout;
      tempArr[index] = parseInt(event.target.value);
    } else if (name === "positionLayout") {
      tempArr = this.state.positionLayout;
      tempArr[index] = parseInt(event.target.value);
    } else if (name === "signalLayout") {
      tempArr = this.state.signalLayout;
      tempArr[index] = parseInt(event.target.value);
    }
    console.log(this.state);
    if (tempArr.length > 0) {
      this.setState(
        {
          [name]: tempArr,
        },
        () => this.setLocalStorage(name, tempArr)
      );
    }
  };

  //send first strategy to Strategy list when rendering DOM
  render() {
    const { currentStrategy } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const { haveData } = this.state;
    const { portfolioLayout } = this.state;
    const { positionLayout } = this.state;
    const { signalLayout } = this.state;
    const { classes } = this.props;

    const dropdown = this.state.allStrategy.map((object, i) => (
      <option key={i} value={object.id}>
        {object.id}
      </option>
    ));

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
              <NativeDropdown
                name="portfolioLayout"
                value={item}
                changeAction={(e) => this.handleChangeTab(e, index)}
              >
                {allComponent}
              </NativeDropdown>
            </Grid>
          );
        } else {
          return (
            <Grid item xs={6} key={index}>
              <NativeDropdown
                name="portfolioLayout"
                value={item}
                changeAction={(e) => this.handleChangeTab(e, index)}
              >
                {allComponent}
              </NativeDropdown>
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
              <NativeDropdown
                name="positionLayout"
                value={item}
                changeAction={(e) => this.handleChangeTab(e, index)}
              >
                {allComponent}
              </NativeDropdown>
            </Grid>
          );
        } else {
          if (index <= 1) {
            return (
              <Grid item xs={3} key={index}>
                <NativeDropdown
                  name="positionLayout"
                  value={item}
                  changeAction={(e) => this.handleChangeTab(e, index)}
                >
                  {allComponent}
                </NativeDropdown>
              </Grid>
            );
          }

          return (
            <Grid item xs={6} key={index}>
              <NativeDropdown
                name="positionLayout"
                value={item}
                changeAction={(e) => this.handleChangeTab(e, index)}
              >
                {allComponent}
              </NativeDropdown>
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
            <NativeDropdown
              name="signalLayout"
              value={item}
              changeAction={(e) => this.handleChangeTab(e, index)}
            >
              {allComponent}
            </NativeDropdown>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={6} key={index}>
            <NativeDropdown
              name="signalLayout"
              value={item}
              changeAction={(e) => this.handleChangeTab(e, index)}
            >
              {allComponent}
            </NativeDropdown>
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
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={(e) => this.handleDrawerToggle(e, true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor="left"
                    open={this.state.drawerIsOpen}
                    onClose={(e) => this.handleDrawerToggle(e, false)}
                  >
                    <div className={classes.list}>
                      <List component="nav" aria-label="Settings">
                        <ListItem button onClick={this.handleOpenSchemaConfig}>
                          <ListItemIcon>
                            <PermDataSettingIcon />
                          </ListItemIcon>
                          <ListItemText primary="Create Strategy" />
                        </ListItem>
                      </List>
                    </div>
                  </Drawer>

                  <CreateStrategyForm
                    schemaDialogOpen={this.state.schemaDialogOpen}
                  ></CreateStrategyForm>

                  {/* The local host text field */}
                  <Grid item>
                    <WhiteTextField
                      required={true}
                      label="Hostname"
                      variant="outlined"
                      name="host"
                      id="host"
                      value={this.state.host}
                      changeAction={this.handleChangeState}
                      disabled={this.state.txtDisabled}
                      keydown={this.keyPress}
                      fontsize={18}
                    ></WhiteTextField>
                  </Grid>

                  {/* The port text field */}
                  <Grid item>
                    <WhiteTextField
                      required={true}
                      label="Port"
                      variant="outlined"
                      name="port"
                      id="port"
                      value={this.state.port}
                      changeAction={this.handleChangeState}
                      disabled={this.state.txtDisabled}
                      keydown={this.keyPress}
                      fontsize={18}
                    ></WhiteTextField>
                  </Grid>

                  {/* Connect Button */}
                  <Grid item>
                    <CustomButton
                      id="connect-button"
                      buttonName={this.state.connectstatus}
                      clickAction={this.handleClickOpenSelectStrategy}
                      disabled={this.state.buttonDisabled}
                    ></CustomButton>
                  </Grid>
                </Grid>
                {/* start of connect dialog */}
                <DialogWithActionContainer
                  title="Settings"
                  dialogContextText="Choose the Strategy to connect to :"
                  actionObj={this.state.stratSettingsOpen}
                  fullWidth={true}
                  maxWidth="xs"
                  cancelName="Cancel"
                  cancelAction={this.handleCloseSelectStrategy}
                  submitName="Connect"
                  submitAction={this.setConnection}
                >
                  <NativeDropdown
                    name="Strategy"
                    id="currentStrategy"
                    value={this.state.currentStrategy}
                    changeAction={this.handleChangeState}
                  >
                    {dropdown}
                  </NativeDropdown>
                </DialogWithActionContainer>
                {/* end of connect dialog */}
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    {/* settings buttons */}

                    <CustomButton
                      buttonName="LAYOUT SETTINGS"
                      id="settings"
                      clickAction={this.handleClickOpenSettings}
                    ></CustomButton>

                    <DialogContainer
                      dialogContextText="Change the layout of the dashboard"
                      title="Settings"
                      actionObj={this.state.settingsOpen}
                      fullWidth={true}
                      maxWidth="md"
                      cancelAction={this.handleCloseLayoutDialog}
                    >
                      <Typography
                        className={classes.title}
                        variant="h6"
                        gutterBottom
                      >
                        Portfolio
                      </Typography>
                      <Grid container spacing={4}>
                        {currentPortfolioLayout}
                      </Grid>
                      <Typography
                        className={classes.title}
                        variant="h6"
                        gutterBottom
                      >
                        Position
                      </Typography>
                      <Grid container spacing={4}>
                        {currentPositionLayout}
                      </Grid>
                      <Typography
                        className={classes.title}
                        variant="h6"
                        gutterBottom
                      >
                        Signal
                      </Typography>
                      <Grid container spacing={4}>
                        {currentSignalLayout}
                      </Grid>
                    </DialogContainer>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Grid>

          {/* Second Row - Main Body */}
          <Grid item xs={12}>
            <div>
              {haveData ? (
                <Dashboard
                  portfolioLayout={portfolioLayout}
                  positionLayout={positionLayout}
                  signalLayout={signalLayout}
                  url={currentStrategy}
                  host={host}
                  port={port}
                />
              ) : null}
            </div>
          </Grid>
        </Grid>
        <SnackBar snackBarObj={this.state.snackBarObj}></SnackBar>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
