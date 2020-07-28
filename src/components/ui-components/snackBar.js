import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Snackbar,
  SnackbarContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  root: {
    background: "red",
  },
});
class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackBarOpen: false,
      snackBarStatus: null,
      snackBarMsg: "",
    };
  }

  handleSBOpen = (msgobject) => {
    console.log(msgobject);
    let color = "red";
    if (msgobject.status === true) {
      color = "green";
    }
    this.setState({
      snackBarOpen: true,
      snackBarMsg: msgobject.msg,
      snackBarStatus: color,
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

  componentDidUpdate(prevProps) {
    if (prevProps.snackBarObj === this.props.snackBarObj) {
      return;
    }
    this.handleSBOpen(this.props.snackBarObj);
  }

  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSBClose}
          key={this.props.snackBarObj.key}
        >
          <SnackbarContent
            style={{
              backgroundColor: this.state.snackBarStatus,
            }}
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
            message={<span id="client-snackbar">{this.state.snackBarMsg}</span>}
          />
        </Snackbar>
      </div>
    );
  }
}

SnackBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SnackBar);
