import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";

export class TriggerDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {showTrigger, parameter, url, closeTriggerDialog} = this.props;

        if (!showTrigger) {
            return null;
        }

        return <div className="triggerDialog" onClick={closeTriggerDialog}>Parameter: {parameter} URL: {url}</div>;
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