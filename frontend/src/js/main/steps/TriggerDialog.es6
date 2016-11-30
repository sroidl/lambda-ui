import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import "../../../sass/buildStepTrigger.sass";
import R from "ramda";

export class TriggerDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    checkValidInput(){
        const getValues = R.map(param => document.getElementById(param.key).value);

        const inputValues = getValues(this.props.parameter);
        const filterValidValues = R.filter(value => value && value !== "");

        return inputValues.length === filterValidValues(inputValues).length;
    }

    executeTrigger(closeTriggerDialog,parameter, url) {
        const inputValues = R.map((param) => param.key + "=" + document.getElementById(param.key).value);
        const formatToUrlParm = R.pipe(inputValues, R.toString,R.replace("\", \"", "&"), R.replace("[\"", ""), R.replace("\"]", ""));

        const urlParameter = formatToUrlParm(parameter);
        /* eslint-disable */
        console.log("Request URL: " + url + "?" + urlParameter);
        /* eslint-enable */

        // TODO: execute

        closeTriggerDialog();
    }

    renderInputs() {
        const {parameter} = this.props;
        const mapInputFields = R.map((prop) => {
            return  <div>
                <label htmlFor={prop.key}>{prop.name}</label>
                <input type="text" name={prop.key} id={prop.key}/>
            </div>;
        });
        return mapInputFields(parameter);
    }

    render() {
        const {showTrigger, closeTriggerDialog, parameter, url} = this.props;

        if (!showTrigger) {
            return null;
        }

        if(!parameter || parameter.length === 0){
            this.executeTrigger(closeTriggerDialog, parameter, url);
            return null;
        }

        const clickExecute = () => {
            if(this.checkValidInput()){
                this.executeTrigger(closeTriggerDialog, parameter, url);
            } else{
                document.getElementById("triggerFailure").innerHTML = "No valid input!";
            }
        };

        return <div className="triggerDialog">
            <div className="triggerShadow" onClick={closeTriggerDialog}></div>
            <div className="triggerContent">
                <div className="triggerTitle"></div>
                <div id="triggerFailure"></div>
                {this.renderInputs()}
                <button onClick={clickExecute}>Start Trigger</button>
            </div>
        </div>;
    }
}

TriggerDialog.propTypes = {
    parameter: PropTypes.array,
    url: PropTypes.string,
    closeTriggerDialog: PropTypes.func.isRequired,
    showTrigger: PropTypes.bool
};

const mapStateToProps = (state) => {
    return state.triggerDialog;
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeTriggerDialog: () => dispatch(closeTriggerDialog())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TriggerDialog);