import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button } from "@material-ui/core";

const styles = (theme) => ({
  button: {
    fontSize: "15px",
    minWidth: "150px",
    color: "white",
    borderColor: "white",
    fontFamily: "TitilliumWeb_Regular",
  },
});

class WhiteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <Button
        id={this.props.id}
        fullWidth
        size="large"
        className={classes.button}
        variant="outlined"
        color="inherit"
        onClick={this.props.clickAction}
        disabled={this.props.disabled}
      >
        {this.props.buttonName}
      </Button>
    );
  }
}

WhiteButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WhiteButton);
