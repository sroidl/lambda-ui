import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import "../../../sass/buildStepTrigger.sass";
import R from "ramda";

export class TriggerDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    hasParameter(){
        const {parameter} = this.props;
        return parameter && parameter.length > 0;
    }

    closeOnEscClick(){
        document.onkeydown = (evt) => {
            evt = evt || window.event;
            let isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                this.props.closeTriggerDialog();
            }
        };
    }

    checkValidInput(){
        const getValues = R.map(param => document.getElementById(param.key).value);

        const inputValues = getValues(this.props.parameter);
        const filterValidValues = R.filter(value => value && value !== "");

        return inputValues.length === filterValidValues(inputValues).length;
    }

    executeTrigger(parameter, url) {
        const inputValues = R.map((param) => param.key + "=" + document.getElementById(param.key).value);
        const formatToUrlParm = R.pipe(inputValues, R.toString,R.replace("\", \"", "&"), R.replace("[\"", ""), R.replace("\"]", ""));

        let urlParameter = "";
        if (this.hasParameter()){
            urlParameter = formatToUrlParm(parameter);
        }
        /* eslint-disable */
        console.log("Request URL: " + url + "?" + urlParameter);
        /* eslint-enable */

        // TODO: execute
    }

    renderInputs() {
        if(!this.hasParameter()){
            return null;
        }
        const mapInputFields = R.map((prop) => {
            return  <div>
                <label htmlFor={prop.key}>{prop.name}</label>
                <input type="text" name={prop.key} id={prop.key}/>
            </div>;
        });
        return mapInputFields(this.props.parameter);
    }

    renderButton() {
        const {parameter, url, closeTriggerDialog} = this.props;

        if(!this.hasParameter()){
            return null;
        }

        const clickExecute = () => {
            if(this.checkValidInput()){
                this.executeTrigger(parameter, url);
                closeTriggerDialog();
            } else{
                document.getElementById("triggerFailure").innerHTML = "No valid input!";
            }
        };

        return <button className="triggerBtn" onClick={clickExecute}>Start Trigger</button>;
    }

    render() {
        const {showTrigger, closeTriggerDialog, parameter, url, triggerName} = this.props;

        if (!showTrigger) {
            document.body.style.overflowY = "auto";
            return null;
        }

        this.closeOnEscClick();
        document.body.style.overflowY = "hidden";

        const triggerDialog = (titleText) => <div className="triggerDialog">
            <div className="triggerShadow" onClick={closeTriggerDialog}></div>
            <div className="triggerContent">
                <div className="triggerTitle">{titleText}</div>
                <div id="triggerFailure"></div>
                {this.renderInputs()}
                {this.renderButton()}
            </div>
        </div>;

        if(!parameter || parameter.length === 0){
            this.executeTrigger(parameter, url);
            return <div>
                {triggerDialog("Start: " + triggerName + " ...")}
                {setTimeout(closeTriggerDialog, 2000)}
            </div>;
        }

        return triggerDialog(triggerName);
    }
}

TriggerDialog.propTypes = {
    parameter: PropTypes.array,
    url: PropTypes.string,
    closeTriggerDialog: PropTypes.func.isRequired,
    showTrigger: PropTypes.bool,
    triggerName: PropTypes.string
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