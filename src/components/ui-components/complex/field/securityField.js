import React, { Component } from "react";
import PropTypes from "prop-types";
import { SECURITY_CLASS, CURRENCIES } from "../../../constants";
import {
  withStyles,
  Grid,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";

const styles = (theme) => ({
  formControl: {
    // marginRight: theme.spacing(1),
    minWidth: "100%",
  },
});

class SecurityField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      securityClass: SECURITY_CLASS[0],
      currency: CURRENCIES[0],
      security: "",
      currentSecurity: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.formType !== this.props.formType) {
      this.setState({
        securityClass: SECURITY_CLASS[0],
        currency: CURRENCIES[0],
        security: "",
        currentSecurity: "",
      });
    }
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    console.log(id, value);
    this.setState(
      {
        [id]: value,
      },
      () => console.log(this.state)
    );

    if (id === "securityClass") {
      this.setState(
        {
          security: "",
        },
        () => this.valueformatter()
      );
    }
  };
  handleSecurityChange = (e) => {
    const value = e.target.value.toUpperCase().trim();
    // const patt = /[A-Za-z0-9]/gi;
    this.setState({ security: value }, () => this.valueformatter());
  };

  valueformatter = () => {
    /*
    Security String Format = SECURITY|class=STOCK|currency=USD
    */
    const separator = "|";
    const security = this.state.security;
    const securityClass = "class=" + this.state.securityClass;
    const currency = "currency=" + this.state.currency;
    const finalValue =
      security + separator + securityClass + separator + currency;
    console.log("finalValue", finalValue);
    if (security === "") {
      this.props.securityChange(this.props.name, this.props.index, security);
    } else {
      this.props.securityChange(this.props.name, this.props.index, finalValue);
    }
  };

  render() {
    const { classes } = this.props;

    const securityClassList = SECURITY_CLASS.sort().map((object, i) => (
      <option key={i} value={object}>
        {object}
      </option>
    ));

    const currenciesList = CURRENCIES.map((object, i) => (
      <option key={i} value={object}>
        {object}
      </option>
    ));

    return (
      <Grid
        container
        spacing={1}
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="uncontrolled-native">Class</InputLabel>
            <Select
              native
              value={this.state.securityClass}
              inputProps={{
                name: "securityClass",
                id: "securityClass",
              }}
              onChange={(e) => this.handleChange(e)}
            >
              {securityClassList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="uncontrolled-native">Currencies</InputLabel>
            <Select
              native
              value={this.state.currency}
              inputProps={{
                name: "currency",
                id: "currency",
              }}
              onChange={(e) => this.handleChange(e)}
            >
              {currenciesList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            id={this.props.id}
            name={this.props.name}
            label={this.props.label}
            className={this.props.className}
            required={this.props.required}
            type={this.props.type}
            variant="outlined"
            margin="dense"
            inputProps={
              this.state.securityClass === "Forex"
                ? {
                    maxLength: 6,
                  }
                : {}
            }
            helperText={this.props.helperText}
            autoComplete={"off"}
            InputLabelProps={{
              shrink: true,
            }}
            error={this.props.error}
            value={this.state.security}
            onChange={this.handleSecurityChange}
          />
        </Grid>
      </Grid>
    );
  }
}

SecurityField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SecurityField);
