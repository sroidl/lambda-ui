import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {requestOutput} from "../actions/BackendActions.es6";
import "../../../sass/buildStepOutput.sass";
import {hideBuildOutput} from "actions/OutputActions.es6";
import DevToggles from "DevToggles.es6";
import * as Utils from "../Utils.es6";

const ConnectionState = ({connection}) => <span><span> Connection State: </span><span>{connection}</span></span>;
ConnectionState.propTypes = {connection: PropTypes.string};

const ConnectionState_stateMapping = state => {
    return {
        connection: R.view(R.lensPath(["output", "connectionState"]))(state)
    };
};
const ConnectionStateRedux = connect(ConnectionState_stateMapping)(ConnectionState);

export class BuildStepOutput extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const element = this.layerText;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    outputLines() {
        const {buildId, requestFn, stepId} = this.props;
        let {output} = this.props;
        if (!output) {
            requestFn(buildId, stepId);
            output = ["No output."];
        }

        const formattingLine = line => line.replace(/ /g, "\u00a0");
        const lineKey = index => "line-" + index;
        const mapIndexed = R.addIndex(R.map);


        return (mapIndexed((line, index) => <div key={lineKey(index)} className="outputLine">
            {formattingLine(line)}</div>)(output));
    }


    closeOnEscClick() {
        document.onkeydown = (evt) => {
            evt = evt || window.event;
            let isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                this.props.closeLayerFn();
            }
        };
    }

    render() {
        const {buildId, stepName, showOutput, closeLayerFn} = this.props;

        if (!showOutput) {
            document.body.style.overflowY = "auto";
            return null;
        }

        document.body.style.overflowY = "hidden";
        this.closeOnEscClick();

        const connectionState = DevToggles.showConnectionState ? <ConnectionStateRedux/> : "";

        return <div className="buildStepOutput ">
            <div onClick={closeLayerFn} className="layerShadow"/>
            <div id="outputContent" className="layer open">
                <div id="outputHeader" className="layerTitle">
                    <span>Build: </span>
                    <span id="outputHeader__buildId">{buildId}</span>
                    <span> - Step: </span>
                    <span id="outputHeader__stepName">{stepName}</span>
                    {connectionState}
                </div>
                <div className="layerClose" onClick={closeLayerFn}><span className="buildStepOutput__exit-info">(Press [ESC] to exit) </span><i
                    className="fa fa-times" aria-hidden="true"></i>
                </div>
                <div ref={(div) => {
                    this.layerText = div;
                }} className="layerText">{this.outputLines()}</div>
            </div>
        </div>;
    }
}

BuildStepOutput.propTypes = {
    buildId: PropTypes.any,
    stepName: PropTypes.string,
    output: PropTypes.array,
    showOutput: PropTypes.bool,
    requestFn: PropTypes.func,
    stepId: PropTypes.any,
    closeLayerFn: PropTypes.func,
    fontColor: PropTypes.any
};


const outputHiddenProps = {showOutput: false};

const outputVisibleProps = (state) => {
    const buildId = state.output.buildId;
    const stepId = state.output.stepId;

    const flatSteps = Utils.flatSteps(R.path(["buildDetails", buildId], state));
    const step = R.find(step => step.stepId === stepId)(flatSteps);


    const stepName = R.propOr("", "name") (step);
    const output = R.path(["content", buildId, stepId])(state.output);


    return {
        buildId: buildId,
        stepId: stepId,
        showOutput: true,
        stepName: stepName,
        output: output
    };





};

export const mapStateToProps = (state) => {
    const {showOutput} = state.output;
    if (showOutput) {
        return outputVisibleProps(state);
    }
    return outputHiddenProps;
};

export const mapDispatchToProps = (dispatch) => {
    return {
        requestFn: (buildId, stepId) => dispatch(requestOutput(buildId, stepId)),
        closeLayerFn: () => dispatch(hideBuildOutput())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildStepOutput);
