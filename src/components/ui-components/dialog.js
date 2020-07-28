import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    background: "red",
  },
});

class DialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOpen: false,
    };
  }

  handleClickOpenSettings = () => {
    this.setState({
      settingsOpen: true,
    });
  };

  handleCloseSettings = () => {
    // console.log('close')
    this.setState({
      settingsOpen: false,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.actionObj === prevProps.actionObj) {
      return;
    }

    if (this.props.actionObj.value === true) {
      this.handleClickOpenSettings();
    }
  }

  render() {
    return (
      <Dialog
        open={this.state.settingsOpen}
        onClose={this.handleCloseSettings}
        aria-labelledby="form-dialog-title"
        fullWidth={this.props.fullWidth}
        maxWidth={this.props.maxWidth}
      >
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.dialogContextText}</DialogContentText>
          {this.props.children}
        </DialogContent>
      </Dialog>
    );
  }
}

DialogContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DialogContainer);
