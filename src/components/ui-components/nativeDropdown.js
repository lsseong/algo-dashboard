import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, FormControl, InputLabel, Select } from "@material-ui/core";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});

class NativeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <FormControl required className={classes.formControl}>
        <InputLabel htmlFor={`${this.props.name}-native-simple`}>
          {this.props.name.toUpperCase()}
        </InputLabel>
        <Select
          native
          value={this.props.value}
          onChange={this.props.changeAction}
          required
          inputProps={{
            name: `${this.props.name}`,
            id: `${this.props.name}-native-simple`,
          }}
        >
          {this.props.children}
        </Select>
      </FormControl>
    );
  }
}

NativeDropdown.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NativeDropdown);
