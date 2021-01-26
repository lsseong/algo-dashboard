import React, { Component } from "react";
import {
  Grid,
  Button,
  TextField,
  Typography,
  withStyles,
  Paper,
} from "@material-ui/core";
import PropTypes from "prop-types";
import ListForm from "../../commons/listForm";
import { util } from "../../../util";
import SnackBar from "../../commons/snackBar";
import SecurityField from "../field/securityField";

const styles = (theme) => ({
  title: {
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    backgroundColor: "white",
  },
  mandatory: {
    color: "red",
  },
  orangeTextField: {
    "& input:invalid + fieldset": {
      borderColor: "orange",
      borderWidth: 2,
    },
  },
});

class StrategyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackBarObj: [],
      formData: [],
      formSchema: new Map(),
      baseData: new Map(),
      min: new Map(),
      max: new Map(),
      description: new Map(),
      mandatory: new Map(),
      name: new Map(),
      type: new Map(),
      decimalPlaces: new Map(),
      complexDecimalMap: new Map(),
      validated: new Map(),
      isBlank: new Map(),
      finalObj: new Map(),
      strategyName: "",
    };
  }
  componentDidMount() {
    this.init();
  }

  init = () => {
    console.log(this.props.type, this.props.parameters);

    let minMap = new Map();
    let maxMap = new Map();
    let nameMap = new Map();
    let descriptionMap = new Map();
    let typeMap = new Map();
    let mandatoryMap = new Map();
    let decimalPlacesMap = new Map();
    let formSchemaMap = new Map();
    let baseDataMap = new Map();
    let template = [];

    let tempObj = this.props.parameters;
    let obj = {};
    let finalObj = this.state.finalObj;

    tempObj.forEach((item, index) => {
      let value = this.getDefaultValue(item.min, item.type, item.decimalPlaces);
      obj[item.name] = value;
      baseDataMap.set(
        item.name,
        this.getDefaultValue(item.min, item.type, item.decimalPlaces)
      );
      finalObj.set(item.name, value);
      formSchemaMap.set(item.name, item);
      minMap.set(item.name, item.min);
      maxMap.set(item.name, item.max);
      nameMap.set(item.name, item.name);
      descriptionMap.set(item.name, item.description);
      typeMap.set(item.name, item.type);
      mandatoryMap.set(item.name, item.mandatory);
      if (item.decimalPlaces !== undefined) {
        decimalPlacesMap.set(item.name, item.decimalPlaces);
      }
    });
    console.log("Default Value", obj);
    template.push(obj);

    this.setState(
      {
        formSchema: formSchemaMap,
        baseData: obj,
        formData: template,
        min: minMap,
        max: maxMap,
        type: typeMap,
        description: descriptionMap,
        decimalPlaces: decimalPlacesMap,
        mandatory: mandatoryMap,
        name: nameMap,
        finalObj: finalObj,
      },
      () => this.valuesValidator(this.state.formData)
    );
  };

  mapData = (data) => {
    data.map((item, index) => {
      return Object.entries(item).map(([innerkey, innervalue], innerindex) => {
        console.log(innerkey, innervalue);
      });
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.parameters !== prevProps.parameters) {
      console.log(this.props.parameters);
      console.log("type", this.props.type);
      this.setState({
        strategyName: "",
      });
      this.init();
    }
  }

  addObjectToForm = (name, value) => {
    console.log(name, value);
    let tempObj = this.state.formData;
    tempObj.set(name, value);
    this.setState(
      {
        formData: tempObj,
      },
      () => console.log(this.state.formData)
    );
  };

  getDefaultValue = (min, type, decimalPlaces = 0) => {
    if (type === "integer") {
      return min;
    } else if (type === "security") {
      return "";
    } else if (type === "decimal") {
      let value = parseFloat(min).toFixed(decimalPlaces);
      return value;
    } else if (type === "complex") {
      // console.log(min, type, decimalPlaces);
    }
    return undefined;
  };
  getInputType = (type) => {
    if (type === "decimal" || type === "integer") {
      return "number";
    } else {
      return "";
    }
  };

  getMinMaxText = (min, max) => {
    if (min === max) {
      return "";
    } else {
      return "Min: " + min + " Max: " + max;
    }
  };

  securityChange = (name, index, value) => {
    let list = util.getDeepCopy(this.state.formData);
    let listKeys = Object.keys(list[0]);
    this.state.name.forEach((objKey, objValue) => {
      if (listKeys.includes(objKey) === false) {
        list[0][objKey] = undefined;
      }
    });

    list[index][name] = value;
    let finalObj = this.state.finalObj;
    finalObj.set(name, value);
    this.setState(
      {
        formData: list,
        finalObj: finalObj,
      },
      () => this.valuesValidator(this.state.formData)
    );
  };

  handleParamsChange = (e, index) => {
    const { id, value } = e.target;
    // console.log(this.state.formData);
    // console.log([...this.state.name]);

    let list = util.getDeepCopy(this.state.formData);
    let listKeys = Object.keys(list[0]);
    this.state.name.forEach((objKey, objValue) => {
      if (listKeys.includes(objKey) === false) {
        list[0][objKey] = undefined;
      }
    });

    list[index][id] = value;
    let finalObj = this.state.finalObj;
    finalObj.set(id, value);

    this.setState(
      {
        formData: list,
        finalObj: finalObj,
      },
      () => this.valuesValidator(this.state.formData)
    );
  };

  handleChange = (e) => {
    const { id, value } = e.target;

    this.setState({
      [id]: value,
    });
  };

  handleParamsBlur = (e, index) => {
    const { id, value } = e.target;
    let decimalPlaces = this.state.decimalPlaces.get(id);
    if (decimalPlaces === undefined || value === "") {
      return;
    }
    let list = util.getDeepCopy(this.state.formData);
    let listKeys = Object.keys(list[0]);
    this.state.name.forEach((objKey, objValue) => {
      if (listKeys.includes(objKey) === false) {
        list[0][objKey] = undefined;
      }
    });
    let newValue = parseFloat(value).toFixed(decimalPlaces);
    list[index][id] = newValue;
    let finalObj = this.state.finalObj;
    finalObj.set(id, newValue);
    this.setState(
      {
        formData: list,
        finalObj: finalObj,
      },
      () => this.valuesValidator(this.state.formData)
    );
  };

  checkValue = (min, max, value, type) => {
    let valid = false;
    if (type === "security") {
      if (value.length >= min) {
        valid = true;
      }
    } else if (type === "integer" || type === "decimal") {
      if (value <= max && value >= min) {
        valid = true;
      }
    }
    console.log(type, valid);
    return valid;
  };

  valuesValidator = (data) => {
    let tempValidated = [];
    let tempBlank = new Map();
    data.forEach((item) => {
      Object.entries(item).forEach(([key, value], index) => {
        if (
          this.state.type.get(key) !== "complex" &&
          this.state.type.get(key) !== "list"
        ) {
          let checked = this.checkValue(
            this.state.min.get(key),
            this.state.max.get(key),
            value,
            this.state.type.get(key)
          );
          tempValidated.push({ [key]: checked });
          if (value === "") {
            tempBlank.set(key, true);
          } else {
            tempBlank.set(key, false);
          }
        }
      });
    });

    this.mandatoryValidator(tempValidated, tempBlank);
  };

  mandatoryValidator = (validated, blanks) => {
    let allValid = this.state.validated;
    validated.forEach((item) => {
      Object.entries(item).forEach(([key, value], index) => {
        if (this.state.mandatory.get(key) === true) {
          if (value === true) {
            allValid.set(key, true);
          } else {
            allValid.set(key, false);
          }
        } else {
          if (value === true || blanks.get(key) === true) {
            allValid.set(key, true);
          } else {
            allValid.set(key, false);
          }
        }
      });
    });
    this.setState({
      validated: allValid,
    });
  };

  handleChildValidation = (headerName, object, validated) => {
    let tempFinal = this.state.finalObj;
    let tempValidated = this.state.validated;
    let tempBlank = this.state.isBlank;
    tempValidated.set(headerName, validated);
    if (validated === true) {
      tempFinal.set(headerName, object);
      tempBlank.set(headerName, false);
    } else {
      tempFinal.set(headerName, null);
      tempBlank.set(headerName, true);
    }
    this.setState(
      {
        validated: tempValidated,
        finalObj: tempFinal,
        isBlank: tempBlank,
      }
      // () => console.log(this.state.finalObj, this.state.validated)
    );
  };

  removeEmptyIfNotMandatory = (values) => {
    let tempValues = values;
    values.forEach((value, key) => {
      if (this.state.mandatory.get(key) === false && value === "") {
        tempValues.delete(key);
      }
    });
    return tempValues;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const finalValues = this.removeEmptyIfNotMandatory(this.state.finalObj);
    let paramsFinalObject = Object.fromEntries(finalValues);

    const finalObj = {
      type: this.props.type,
      version: this.props.version,
      name: this.state.strategyName.trim(),
      parameters: paramsFinalObject,
    };
    console.log(finalObj);
    let invalidObj = [];
    let allValues = [];
    let nameIsInvalid = true;
    if (this.state.strategyName.trim() === "") {
      invalidObj.push("Strategy Name");
    } else {
      nameIsInvalid = false;
    }
    console.log("validity", this.state.validated);
    this.state.validated.forEach((value, key) => {
      if (value === false) {
        invalidObj.push(key);
      }
      allValues.push(value);
    });
    let message = "Invalid Field(s): " + invalidObj.toString();
    let isInvalid = allValues.some((item) => item === false);
    if (isInvalid || nameIsInvalid) {
      console.log(message);
      this.props.handleSnackBarMessage(false, message);
    } else {
      this.props.handleSnackBarMessage(
        true,
        "Success \n" + JSON.stringify(finalObj)
      );
    }
  };

  render() {
    const { classes } = this.props;
    const parameters = this.state.formData.map((item, index) => {
      let tempObj = [];
      Object.entries(item).map(([innerkey, innervalue], innerindex) => {
        let objKey = `data-${innerindex}`;
        let listkey = `level1-item-${innerindex}`;
        // console.log("inner key", innerkey);
        return tempObj.push(
          this.state.type.get(innerkey) !== "list" &&
            this.state.type.get(innerkey) !== "complex" ? (
            <Grid item key={objKey} xs={3}>
              <Typography
                className={classes.title}
                variant="subtitle1"
                display="block"
              >
                {innerkey}
                <b className={classes.mandatory}>
                  {" "}
                  {this.state.mandatory.get(innerkey) ? "*" : null}
                </b>
              </Typography>
              {innerkey !== "Security" ? (
                <TextField
                  className={
                    this.state.validated.get(innerkey)
                      ? null
                      : classes.orangeTextField
                  }
                  required={this.state.mandatory.get(innerkey)}
                  id={innerkey}
                  name={innerkey}
                  label={`${innerkey} ${index + 1}`}
                  value={innervalue}
                  autoComplete={"off"}
                  fullWidth={true}
                  type={this.getInputType(this.state.type.get(innerkey))}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin={"dense"}
                  onBlur={(e) => this.handleParamsBlur(e, index)}
                  error={
                    this.state.mandatory.get(innerkey)
                      ? !this.checkValue(
                          this.state.min.get(innerkey),
                          this.state.max.get(innerkey),
                          innervalue,
                          this.state.type.get(innerkey)
                        )
                      : null
                  }
                  InputProps={{
                    inputProps: {
                      min: this.state.min.get(innerkey),
                      max: this.state.max.get(innerkey),
                    },
                  }}
                  helperText={
                    <React.Fragment>
                      <br />
                      Description:{this.state.description.get(innerkey)}
                      <br />
                      Type:{this.state.type.get(innerkey)}
                      <br />
                      {this.getMinMaxText(
                        this.state.min.get(innerkey),
                        this.state.max.get(innerkey)
                      )}
                      <br />
                      {this.state.decimalPlaces.get(innerkey) !== undefined
                        ? ` Decimal Places:${this.state.decimalPlaces.get(
                            innerkey
                          )}`
                        : null}
                    </React.Fragment>
                  }
                  onChange={(e) => this.handleParamsChange(e, index)}
                />
              ) : (
                <SecurityField
                  className={
                    this.state.validated.get(innerkey)
                      ? null
                      : classes.orangeTextField
                  }
                  formType={this.props.type}
                  required={this.state.mandatory.get(innerkey)}
                  id={innerkey}
                  name={innerkey}
                  label={`${innerkey} ${index + 1}`}
                  type={this.getInputType(this.state.type.get(innerkey))}
                  index={index}
                  error={
                    this.state.mandatory.get(innerkey)
                      ? !this.checkValue(
                          this.state.min.get(innerkey),
                          this.state.max.get(innerkey),
                          innervalue,
                          this.state.type.get(innerkey)
                        )
                      : null
                  }
                  helperText={
                    <React.Fragment>
                      <br />
                      Description:{this.state.description.get(innerkey)}
                      <br />
                      Type:{this.state.type.get(innerkey)}
                      <br />
                      {this.getMinMaxText(
                        this.state.min.get(innerkey),
                        this.state.max.get(innerkey)
                      )}
                      <br />
                      {this.state.decimalPlaces.get(innerkey) !== undefined
                        ? ` Decimal Places:${this.state.decimalPlaces.get(
                            innerkey
                          )}`
                        : null}
                    </React.Fragment>
                  }
                  securityChange={this.securityChange}
                ></SecurityField>
              )}
            </Grid>
          ) : this.state.type.get(innerkey) === "complex" ? (
            <React.Fragment key={objKey}>
              <Grid item xs={12}>
                <Typography
                  className={classes.title}
                  variant="subtitle1"
                  display="block"
                >
                  {innerkey}
                  <b className={classes.mandatory}>
                    {" "}
                    {this.state.mandatory.get(innerkey) ? "*" : null}
                  </b>
                </Typography>
                <Typography
                  className={classes.title}
                  variant="subtitle2"
                  display="block"
                >
                  Description: {this.state.description.get(innerkey)}
                </Typography>
              </Grid>

              <ListForm
                formType={this.props.type}
                key={listkey}
                data={this.state.formSchema.get(innerkey).parameters}
                type={this.state.type.get(innerkey)}
                headerName={innerkey}
                max={this.state.max.get(innerkey)}
                min={this.state.min.get(innerkey)}
                valuesValidator={this.handleChildValidation}
                fieldMandatory={this.state.mandatory.get(innerkey)}
              ></ListForm>
            </React.Fragment>
          ) : (
            <React.Fragment key={objKey}>
              <Grid item xs={12}>
                <Typography
                  className={classes.title}
                  variant="subtitle1"
                  display="block"
                >
                  {innerkey}
                  <b className={classes.mandatory}>
                    {" "}
                    {this.state.mandatory.get(innerkey) ? "*" : null}
                  </b>
                </Typography>
                <Typography
                  className={classes.title}
                  variant="subtitle2"
                  display="block"
                >
                  Description: {this.state.description.get(innerkey)}
                </Typography>
                <Typography
                  className={classes.title}
                  variant="subtitle2"
                  display="block"
                >
                  Min: {this.state.min.get(innerkey)} Max:{" "}
                  {this.state.max.get(innerkey)}
                </Typography>
              </Grid>
              <ListForm
                formType={this.props.type}
                key={listkey}
                data={
                  this.state.formSchema.get(innerkey).listType.parameters ===
                  undefined
                    ? [this.state.formSchema.get(innerkey).listType]
                    : this.state.formSchema.get(innerkey).listType.parameters
                }
                type={this.state.type.get(innerkey)}
                headerName={innerkey}
                max={this.state.max.get(innerkey)}
                min={this.state.min.get(innerkey)}
                valuesValidator={this.handleChildValidation}
                fieldMandatory={this.state.mandatory.get(innerkey)}
              ></ListForm>
            </React.Fragment>
          )
        );
      });
      return tempObj;
    });

    return (
      <React.Fragment>
        {parameters ? (
          <Grid container spacing={2} className={classes.root}>
            <Grid item xs={12}>
              <Typography
                className={classes.title}
                variant="subtitle1"
                display="block"
              >
                Parameters
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                className={classes.title}
                variant="subtitle1"
                display="block"
              >
                Strategy Name
                <b className={classes.mandatory}>*</b>
              </Typography>
              <TextField
                id="strategyName"
                label="Strategy Name"
                type="text"
                required
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.handleChange}
                value={this.state.strategyName}
                margin={"dense"}
                variant="outlined"
                error={this.state.strategyName.trim() === ""}
              />
            </Grid>

            {parameters}
            <br />
            <Grid item xs={12}>
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : null}
      </React.Fragment>
    );
  }
}

StrategyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StrategyForm);
