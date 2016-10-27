import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {requestOutput} from "actions/BackendActions.es6";
import "../../sass/buildStepOutput.sass";
import {hideBuildOutput} from "actions/OutputActions.es6";

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

    componentDidUpdate(){
        const element = this.layerText;
        element.scrollTop = element.scrollHeight;
    }

    outputLines() {
        const {buildId, requestFn, stepId} = this.props;
        let {output} = this.props;
        if (!output) {
            requestFn(buildId, stepId);
            output = ["Requesting Output from Server"];
        }

        const lineKey = index => "line-" + index;
        const mapIndexed = R.addIndex(R.map);
        return (mapIndexed((line, index) => <div key={lineKey(index)}
                                                 className="outputLine">{line}</div>)(output));
    }

    render() {
        const {buildId, stepName, showOutput, stepId, closeLayerFn} = this.props;

        if (!showOutput) {
            return null;
        }

        return <div className="buildStepOutput ">
            <div className="layerShadow"/>
            <div id="outputContent" className="layer open">
                <div id="outputHeader" className="layerTitle">
                    <span>Output of Build </span>
                    <span id="outputHeader__buildId">{buildId}</span>
                    <span> Step </span>
                    <span id="outputHeader__stepName">{stepName} ({stepId})</span>
                    <ConnectionStateRedux/>
                </div>
                <div className="layerClose" onClick={closeLayerFn}><i className="fa fa-times" aria-hidden="true"></i>
                </div>
                <div ref={(div) => {this.layerText = div;}} className="layerText">{this.outputLines()}</div>
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
    closeLayerFn: PropTypes.func
};

const outputHiddenProps = {showOutput: false};

const outputVisibleProps = (state) => {
    const buildId = state.output.buildId;
    const stepId = state.output.stepId;
    const stepNameLens = R.lensPath(["buildDetails", buildId, stepId, "name"]);
    const outputLens = R.lensPath(["output", "content", buildId, stepId]);

    return {
        buildId: buildId,
        stepId: stepId,
        showOutput: true,
        stepName: R.view(stepNameLens, state),
        output: R.view(outputLens, state),
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
