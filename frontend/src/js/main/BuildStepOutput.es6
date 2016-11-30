import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {requestOutput} from "actions/BackendActions.es6";
import "../../sass/buildStepOutput.sass";
import {hideBuildOutput} from "actions/OutputActions.es6";
import DevToggles from "DevToggles.es6";

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
        element.scrollTop = element.scrollHeight;
    }

    ansiCodeToHexCode(ansiCode){
        switch(ansiCode){
            case "0":
                return "rgb(0,0,0)";
            case "1":
                return "rgb(255,0,0)";
            case "2":
                return "rgb(0,255,0)";
            case "3":
                return "rgb(255,255,0)";
            case "4":
                return "rgb(0,0,255)";
            case "5":
                return "rgb(255,0,255)";
            case "6":
                return "rgb(0,255,255)";
            case "7":
                return "rgb(255,255,255)";
            default:
                return "";
        }
    }

    matchAnsiCode(text){
        const changeColorResult = text.match(/\[[0-7]+;[0-7]+m/g);
        if(changeColorResult && changeColorResult.length > 0){
            /* eslint-disable */
            // TODO: Use new color code
            const fontColorCode = this.ansiCodeToHexCode(changeColorResult[0].substring(2,3));
            const backgroundColorCode = this.ansiCodeToHexCode(changeColorResult[0].substring(5,6));
            /* eslint-enable */
            return text.replace(/\[[0-7]+;[0-7]+m/g, "");
        }
        const resetColorResult = text.match(/\[0m/g);
        if(resetColorResult && resetColorResult.length > 0){
            return text.replace(/\[0m/g, "");
        }
        return text;
    }
    outputLines() {
        const {buildId, requestFn, stepId} = this.props;
        let {output} = this.props;
        if (!output) {
            requestFn(buildId, stepId);
            output = ["Requesting Output from Server"];
        }

        const formattingLine = line => line.replace(/ /g, "\u00a0");
        const lineKey = index => "line-" + index;
        const mapIndexed = R.addIndex(R.map);


        return (mapIndexed((line, index) => {
            let formatLine;
            if(DevToggles.useAnsiCodeColors){
                formatLine = formattingLine(this.matchAnsiCode(line));
            } else{
                formatLine = formattingLine(line);
            }

            return <div key={lineKey(index)}
                        className="outputLine">{formatLine}</div>;
        })(output));
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
                <div className="layerClose" onClick={closeLayerFn}><i className="fa fa-times" aria-hidden="true"></i>
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
    const stepNameLens = R.lensPath(["buildDetails", buildId, "steps", stepId, "name"]);
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