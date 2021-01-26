import React, { Component } from "react";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { util } from "../../util";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import SecurityField from "../complex/field/securityField";

const styles = (theme) => ({
  title: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    backgroundColor: "white",
  },
  orangeTextField: {
    "& input:invalid + fieldset": {
      borderColor: "orange",
      borderWidth: 2,
    },
  },
});
class ListForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: [],
      baseData: [],
      name: new Map(),
      min: new Map(),
      max: new Map(),
      type: new Map(),
      decimalPlaces: new Map(),
      mandatory: new Map(),
      description: new Map(),
      buttonGrpSpacing: 12,
      disabled: false,
      validated: [],
      afterValidation: false,
      isBlank: [],
    };
  }
  componentDidMount() {
    // console.log(this.props.data);
    console.log(this.props.headerName, this.props.fieldMandatory);
    this.init();
  }

  init = () => {
    let minMap = new Map();
    let maxMap = new Map();
    let nameMap = new Map();
    let descriptionMap = new Map();
    let typeMap = new Map();
    let mandatoryMap = new Map();
    let decimalPlacesMap = new Map();

    let template = [];
    let tempObj = this.props.data;
    let obj = {};
    tempObj.forEach((item, index) => {
      obj[item.name] = this.getDefaultValue(
        item.mandatory,
        item.min,
        item.type,
        item.decimalPlaces
      );

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

    Array(this.props.min)
      .fill()
      .forEach((_, i) => template.push(obj));

    this.setState(
      {
        baseData: obj,
        formData: template,
        min: minMap,
        max: maxMap,
        type: typeMap,
        description: descriptionMap,
        decimalPlaces: decimalPlacesMap,
        mandatory: mandatoryMap,
        name: nameMap,
      },
      () => {
        this.getButtonSpace(Object.keys(this.state.baseData).length);
        this.validator(this.state.formData);
      }
    );
  };

  componentDidUpdate(prevProps) {
    if (prevProps.formType !== this.props.formType) {
      this.init();
    }
  }

  getDefaultValue = (mandatory, min, type, decimalPlaces = 0) => {
    if (mandatory === false) {
      return "";
    }
    if (type === "integer") {
      return min;
    } else if (type === "security") {
      return "";
    } else if (type === "decimal") {
      let value = parseFloat(min).toFixed(decimalPlaces);
      return value;
    }
  };

  getInputType = (type) => {
    if (type === "decimal" || type === "integer") {
      return "number";
    } else {
      return "text";
    }
  };

  getMinMaxText = (min, max) => {
    if (min === max) {
      return "";
    } else {
      return "\n Min: " + min + " Max: " + max;
    }
  };

  countDecimals = (value) => {
    if (Math.round(value) !== value)
      return value.toString().split(".")[1].length || 0;
    return 0;
  };

  //check value
  checkValue = (min, max, value, type, mandatory) => {
    // console.log(min, max, value, type, mandatory);
    //check if value is empty
    if (value === "") {
      if (mandatory) {
        return false;
      }
      return true;
    }
    // if value is not empty do the proper checks
    let valid = false;
    if (type === "security") {
      let spiltValue = value.split("|")[0];
      let noLimit = false;
      if (min === 1 && max === 1) {
        noLimit = true;
      }

      if (noLimit) {
        valid = true;
      } else {
        if (spiltValue.length >= min && spiltValue.length <= max) {
          valid = true;
        }
      }
    } else if (type === "integer" || type === "decimal") {
      if (value <= max && value >= min) {
        valid = true;
      }
    }
    // console.log(type, "isValid", valid);
    return valid;
  };

  handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = util.getDeepCopy(this.state.formData);
    list[index][name] = value;

    this.setState(
      {
        formData: list,
      },
      () => this.validator(this.state.formData)
    );
  };

  securityChange = (name, index, value) => {
    let list = util.getDeepCopy(this.state.formData);
    list[index][name] = value;
    this.setState(
      {
        formData: list,
      },
      () => this.validator(this.state.formData)
    );
  };

  validator = (values) => {
    console.log(this.props.headerName, "values", values);
    let tempArray = [];
    let tempBlank = [];
    values.forEach((item, index) => {
      let tempObj = {};
      let tempBlankObj = {};
      Object.entries(item).forEach(([key, value], index) => {
        let checked = this.checkValue(
          this.state.min.get(key),
          this.state.max.get(key),
          value,
          this.state.type.get(key),
          this.state.mandatory.get(key)
        );
        tempObj[key] = checked;

        if (value === "") {
          tempBlankObj[key] = true;
        } else {
          tempBlankObj[key] = false;
        }
      });
      tempBlank.push(tempBlankObj);
      tempArray.push(tempObj);
    });
    this.setState(
      {
        validated: tempArray,
        isBlank: tempBlank,
      },
      () => this.validateAll(this.state.validated, this.state.isBlank)
    );
  };

  validateAll = (validated, blanks) => {
    // console.log(this.props.headerName, "blanks", blanks);
    // console.log(this.props.headerName, "validated", validated);
    let tempValidated = [];
    let tempBlanks = [];
    validated.forEach((item) => {
      Object.entries(item).forEach(([key, value], index) => {
        tempValidated.push(value);
      });
    });

    blanks.forEach((item) => {
      Object.entries(item).forEach(([key, value], index) => {
        tempBlanks.push(value);
      });
    });

    // console.log(this.props.headerName, "tempBlanks", tempBlanks);
    // console.log(this.props.headerName, "tempValidated", tempValidated);
    let isAllTrue = tempValidated.every((e) => e === true);
    let isAllBlank = tempBlanks.every((e) => e === true);
    let allValid = false;
    if (this.props.fieldMandatory === true) {
      if (isAllTrue === true) {
        allValid = true;
      }
    } else {
      if (isAllTrue === true || isAllBlank === true) {
        allValid = true;
      }
    }

    //set values as empty if all are empty
    let finalData = this.state.formData;

    if (isAllBlank) {
      finalData = "";
    }

    this.setState(
      {
        afterValidation: allValid,
      },
      () =>
        this.props.valuesValidator(
          this.props.headerName,
          finalData,
          this.state.afterValidation
        )
    );
  };

  handleBlur = (e, index) => {
    const { name, value } = e.target;
    let decimalPlaces = this.state.decimalPlaces.get(name);
    if (decimalPlaces === undefined || value === "") {
      return;
    }
    let list = util.getDeepCopy(this.state.formData);
    console.log(value);
    let newValue = parseFloat(value).toFixed(decimalPlaces);

    list[index][name] = newValue;
    this.setState(
      {
        formData: list,
      },
      () => this.validator(this.state.formData)
    );
  };

  handleRemoveClick = (index) => {
    const list = [...this.state.formData];
    list.splice(index, 1);
    this.setState(
      {
        formData: list,
      },
      () => this.validator(this.state.formData)
    );
  };

  handleAddClick = () => {
    //deep copy stringify and parsing
    let tempForm = util.getDeepCopy(this.state.formData);
    let baseForm = util.getDeepCopy(this.state.baseData);
    console.log(baseForm);
    console.log(tempForm);
    tempForm.push(baseForm);
    this.setState(
      {
        formData: tempForm,
      },
      () => this.validator(this.state.formData)
    );
  };

  getButtonSpace = (length) => {
    let spaces = length % 4;

    let result = 12;
    if (spaces > 0) {
      result = (4 - spaces) * 3;
    }
    this.setState({
      buttonGrpSpacing: result,
    });
  };

  render() {
    const { classes } = this.props;
    let textFields = this.state.formData.map((item, index) => {
      //TODO solve unquie key
      let tempObj = [];

      Object.entries(item).map(([innerkey, innervalue], innerindex) => {
        let objKey = `level1-form-${innerindex}`;
        let objId = `${this.props.headerName}-level-form-${innerkey}-${innerindex}`;

        return tempObj.push(
          <Grid item key={objKey} xs={3}>
            {innerkey !== "Security" ? (
              <TextField
                className={
                  this.state.afterValidation ? null : classes.orangeTextField
                }
                required={this.state.mandatory.get(innerkey)}
                id={objId}
                name={innerkey}
                label={`${innerkey} ${index + 1}`}
                value={innervalue}
                error={
                  this.props.fieldMandatory
                    ? !this.checkValue(
                        this.state.min.get(innerkey),
                        this.state.max.get(innerkey),
                        innervalue,
                        this.state.type.get(innerkey),
                        this.state.mandatory.get(innerkey)
                      )
                    : null
                }
                margin={"dense"}
                onBlur={(e) => this.handleBlur(e, index)}
                autoComplete={"off"}
                fullWidth={true}
                type={this.getInputType(this.state.type.get(innerkey))}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
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
                onChange={(e) => this.handleChange(e, index)}
              />
            ) : (
              <SecurityField
                className={
                  this.state.afterValidation ? null : classes.orangeTextField
                }
                formType={this.props.formType}
                required={this.state.mandatory.get(innerkey)}
                id={objId}
                name={innerkey}
                label={`${innerkey} ${innerindex + 1}`}
                type={this.getInputType(this.state.type.get(innerkey))}
                index={index}
                error={
                  this.props.fieldMandatory
                    ? !this.checkValue(
                        this.state.min.get(innerkey),
                        this.state.max.get(innerkey),
                        innervalue,
                        this.state.type.get(innerkey),
                        this.state.mandatory.get(innerkey)
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
        );
      });

      let objKey = `level1-form-butttons${index}`;
      tempObj.push(
        <Grid item key={objKey} xs={this.state.buttonGrpSpacing}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            {this.state.formData.length > 1 ? (
              <Grid item>
                <Fab
                  color="secondary"
                  aria-label="remove"
                  onClick={() => this.handleRemoveClick(index)}
                >
                  <RemoveIcon />
                </Fab>
              </Grid>
            ) : null}

            {this.state.formData.length - 1 === index &&
            this.state.formData.length < this.props.max ? (
              <Grid item>
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={() => this.handleAddClick(index)}
                >
                  <AddIcon />
                </Fab>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      );

      return tempObj;
    });
    return <React.Fragment>{textFields}</React.Fragment>;
  }
}

export default withStyles(styles)(ListForm);
