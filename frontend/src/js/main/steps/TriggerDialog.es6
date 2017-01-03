import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import "../../../sass/buildStepTrigger.sass";
import R from "ramda";
import App from "../App.es6";

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
        const inputValues = R.pipe(R.map((param) => R.assoc(param.key, document.getElementById(param.key).value, {})), R.mergeAll);


        let urlParameter = "";
        if (this.hasParameter()){
            urlParameter = inputValues(parameter);
        }

        App.backend().triggerStep(url, urlParameter);
    }

    renderInputs() {
        if(!this.hasParameter()){
            return null;
        }
        const mapInputFields = R.map((prop) => {
            return  <div key={prop.key}>
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
            return null;
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