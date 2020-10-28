import React, { Component } from "react";
import {
  Grid,
  Button,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import NativeDropdown from "../../commons/nativeDropdown";
import DialogContainer from "../../commons/dialog";
import SchemaTable from "../../../dashboard/table/schemaTable";
import StrategyForm from "./StrategyForm";

import SnackBar from "../../commons/snackBar";
import PropTypes from "prop-types";

require("dotenv").config();

const styles = (theme) => ({
  title: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});

class CreateNewStrategyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schemaDialogOpen: [],
      schemaHost: process.env.REACT_APP_URL_MAIN,
      schemaPort: process.env.REACT_APP_URL_PORT,
      schemaData: [],
      currentSchema: [],
      currentSchemaStrategy: "",
      snackBarObj: [],
      disabled: false,
    };
  }

  handleResetTextField = () => {
    this.setState({
      schemaHost: "",
      schemaPort: "",
      schemaData: [],
      currentSchema: [],
      currentSchemaStrategy: "",
      disabled: false,
    });
  };

  handleCloseSchemaConfig = () => {
    let newobj = {
      key: new Date(),
      value: false,
    };

    this.setState(
      {
        schemaDialogOpen: newobj,
      },
      () => this.handleResetTextField()
    );
  };

  schemaConnection = (host, port) => {
    const URL = "http://" + host + ":" + port + "/service/strategy/schemas";

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
            schemaData: data,
            currentSchemaStrategy: data[0].type,
            currentSchema: [data[0]],
            disabled: true,
          },
          () => this.setInitSchema(this.state.currentSchema)
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
        this.handleSnackBarMessage(false, String(err));
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

  handleChangeSchemaType = (event) => {
    console.log(event.target.value);

    let obj = null;
    this.state.schemaData.forEach((item) => {
      if (item.type === event.target.value) {
        obj = item;
      }
    });

    this.setState(
      {
        currentSchema: [obj],
        currentSchemaStrategy: event.target.value,
      },
      () => console.log(this.state.currentSchema)
    );
  };

  setInitSchema = (schema) => {
    console.log(schema);
    if (schema.length !== 0) {
      this.handleSnackBarMessage(true, "Schema Retrieved");
    } else {
      console.log("schema empty");
    }
  };

  handleSubmitSchema = () => {
    //when host and port is not empty
    if (this.state.schemaHost !== "" && this.state.schemaPort !== "") {
      this.schemaConnection(this.state.schemaHost, this.state.schemaPort);
    } else {
      //when fields are empty
      alert("Please Enter the Host And Port");
    }
  };

  handleChangeState = (event) => {
    console.log(event.target.id);
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleOpenSchemaConfig = (newobj) => {
    this.setState({
      schemaDialogOpen: newobj,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.schemaDialogOpen === prevProps.schemaDialogOpen) {
      return;
    }

    if (this.props.schemaDialogOpen.value === true) {
      this.handleOpenSchemaConfig(this.props.schemaDialogOpen);
    }
  }

  render() {
    const { classes } = this.props;

    const strategySchema = this.state.schemaData.map((object, i) => (
      <option key={i} value={object.type} id={i}>
        {object.type}
      </option>
    ));

    return (
      <div>
        <DialogContainer
          dialogContextText="Connect to the the respective host and port to create your strategy"
          title="Create Strategy"
          actionObj={this.state.schemaDialogOpen}
          fullWidth={true}
          maxWidth="lg"
          cancelAction={this.handleCloseSchemaConfig}
        >
          <Grid container spacing={2}>
            <Grid item>
              <TextField
                required={true}
                label="Hostname"
                variant="outlined"
                name="schemaHost"
                id="schemaHost"
                value={this.state.schemaHost}
                onChange={this.handleChangeState}
                fontSize={18}
                size="small"
                disabled={this.state.disabled}
              ></TextField>
            </Grid>
            <Grid item>
              <TextField
                required={true}
                label="Port"
                variant="outlined"
                name="schemaPort"
                id="schemaPort"
                value={this.state.schemaPort}
                onChange={this.handleChangeState}
                fontSize={18}
                size="small"
                disabled={this.state.disabled}
              ></TextField>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={this.handleSubmitSchema}
                disabled={this.state.disabled}
              >
                Get Form
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={this.handleResetTextField}
              >
                Reset
              </Button>
            </Grid>
            {this.state.currentSchema.length !== 0 ? (
              <React.Fragment>
                <Grid item xs={12}>
                  <NativeDropdown
                    name="Strategy"
                    id="StrategySchema"
                    value={this.state.currentSchemaStrategy}
                    changeAction={this.handleChangeSchemaType}
                  >
                    {strategySchema}
                  </NativeDropdown>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    className={classes.title}
                    variant="body1"
                    display="block"
                  >
                    Type : {this.state.currentSchema[0].type}
                  </Typography>

                  <Typography
                    className={classes.title}
                    variant="body1"
                    display="block"
                  >
                    Version: {this.state.currentSchema[0].version}
                  </Typography>
                  <Typography
                    className={classes.title}
                    variant="body1"
                    display="block"
                  >
                    Description: {this.state.currentSchema[0].description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <StrategyForm
                    parameters={this.state.currentSchema[0].parameters}
                    type={this.state.currentSchema[0].type}
                    handleSnackBarMessage={this.handleSnackBarMessage}
                  ></StrategyForm>
                </Grid>
              </React.Fragment>
            ) : null}
          </Grid>
        </DialogContainer>

        <SnackBar snackBarObj={this.state.snackBarObj}></SnackBar>
      </div>
    );
  }
}

CreateNewStrategyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateNewStrategyForm);
