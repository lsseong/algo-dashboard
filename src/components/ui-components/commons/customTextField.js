import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, TextField } from "@material-ui/core";

const styles = (theme) => ({
  labelProps: {
    color: "white",
    fontFamily: "TitilliumWeb_Regular",
  },
});

const WhiteTextField = withStyles({
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

class CustomTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <WhiteTextField
        required={this.props.required}
        label={this.props.label}
        variant={this.props.variant}
        name={this.props.name}
        id={this.props.id}
        value={this.props.value}
        onChange={this.props.changeAction}
        disabled={this.props.disabled}
        InputLabelProps={{
          shrink: true,
          className: classes.labelProps,
        }}
        onKeyDown={this.props.keydown}
        InputProps={{
          style: {
            fontSize: this.props.fontsize,
            color: "white",
            padding: "0px",
            fontFamily: "TitilliumWeb_Regular",
          },
        }}
      />
    );
  }
}

CustomTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomTextField);
