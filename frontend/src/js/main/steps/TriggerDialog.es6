import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import "../../../sass/buildStepTrigger.sass";
import R from "ramda";

export class TriggerDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    postExecute(closeTriggerDialog) {
        //const inputValues = R.map((param) => param.key + "=" + document.getElementById(param.key).value);
        //const concatValues = R.concat(R.lensIndex(1), R.lensIndex(2));
        //const getParameterValues = R.pipe(inputValues, concatValues);

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
        const {showTrigger, closeTriggerDialog, parameter} = this.props;

        if (!showTrigger) {
            return null;
        }

        if(!parameter || parameter.length === 0){
            this.postExecute(closeTriggerDialog);
            return null;
        }

        return <div className="triggerDialog">
            <div className="triggerShadow" onClick={closeTriggerDialog}></div>
            <div className="triggerContent">
                {this.renderInputs()}
                <button onClick={() => this.postExecute(closeTriggerDialog)}>Start Trigger</button>
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