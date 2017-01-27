import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {requestOutput} from "../actions/BackendActions.es6";
import "../../../sass/buildStepOutput.sass";
import {hideBuildOutput, changeTab} from "../actions/OutputActions.es6";
import DevToggles from "../DevToggles.es6";
import * as Utils from "../Utils.es6";
import StateIcon from "../StateIcon.es6";
import DetailTab from "./DetailTab.es6";

//TODO externalize output class into own module
export class Output extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const element = this.buildStepLayer__text;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    render() {
        const {requestFn} = this.props;
        let {output} = this.props;
        if (!output) {
            requestFn();
            output = ["No output."];
        }

        const formattingLine = line => line.replace(/ /g, "\u00a0");
        const lineKey = index => "line-" + index;
        const mapIndexed = R.addIndex(R.map);


        return <div ref={(div) => {
            this.buildStepLayer__text = div;
        }} className="buildStepLayer__text">

            {mapIndexed((line, index) =>
                <div key={lineKey(index)} className="outputLine">
                    {formattingLine(line)}
                </div>, output) }
        </div>;
    }
}
Output.propTypes = {
    requestFn: PropTypes.func.isRequired,
    output: PropTypes.array
};
export const output_mapStateToProps = (state, initialProps) => {
    const output = R.path(["content", initialProps.buildId, initialProps.stepId])(state.output);

    return {output: output};
};
const output_mapDispatchToProps = (dispatch, initialProps) => {
    return {
        requestFn: () => dispatch(requestOutput(initialProps.buildId, initialProps.stepId))
    };
};

const OutputRedux = connect(output_mapStateToProps, output_mapDispatchToProps)(Output);

/************/

const ConnectionState = ({connection}) => <span><span> Connection State: </span><span>{connection}</span></span>;
ConnectionState.propTypes = {connection: PropTypes.string};

const ConnectionState_stateMapping = state => {
    return {
        connection: R.view(R.lensPath(["output", "connectionState"]))(state)
    };
};
const ConnectionStateRedux = connect(ConnectionState_stateMapping)(ConnectionState);

/************/

export class BuildStepDetailsLayer extends React.Component {

    constructor(props) {
        super(props);
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

    /* eslint-disable */
    TabNavigation(props) {
        const {changeTabFn, activeTab, stepDetailLabels} = props;
        if (DevToggles.showBuildArtifacts) {
            const showLabelFn = (label) => () => changeTabFn(label);
            const showOutputFn = () => changeTabFn("output");

            const cssClasses = (tabName) => {
                if (activeTab === tabName) {
                    return "buildStepLayer__tab buildStepLayer__tab--active";
                }
                return "buildStepLayer__tab";
            }

            const outputButton = <button className={cssClasses("output")} onClick={showOutputFn}>Output</button>;

            return <div className="buildStepLayer__tab-group">
                {outputButton}

                {R.map(label => <button key={label} className={cssClasses(label)} onClick={showLabelFn(label)}>{label}</button>)(stepDetailLabels)}

            </div>;
        }
        return null;
    }

    Tab({buildId, stepId, activeTab}) {
        if (!DevToggles.showBuildArtifacts) {
            return <OutputRedux buildId={buildId} stepId={stepId}/>;
        }
        switch (activeTab) {
            case "output":
                return <OutputRedux buildId={buildId} stepId={stepId}/>;
            default:
                return <DetailTab buildId={buildId} stepId={stepId} rootLabel={activeTab}/>;
        }
        return null;
    }


    render() {
        const {buildId, stepName, showLayer, closeLayerFn, stepState, stepId, activeTab, changeTabFn, stepDetailLabels} = this.props;

        if (!showLayer) {
            document.body.style.overflowY = "auto";
            return null;
        }

        document.body.style.overflowY = "hidden";
        this.closeOnEscClick();

        const connectionState = DevToggles.showConnectionState ? <ConnectionStateRedux/> : "";

        return <div className="buildStepOutput">
            <div onClick={closeLayerFn} className="buildStepLayer__shadow"/>
            <div className="buildStepLayer buildStepLayer--open">
                <div id="buildStepLayer" className="buildStepLayer__title">
                    <span>Build: </span>
                    <span id="buildStepLayer__buildId">{buildId}</span>
                    <span> - Step: </span>
                    <span id="buildStepLayer__stepName">{stepName}</span>
                    {connectionState}
                    <span className="buildStepLayer__stepState">Step State:<StateIcon state={stepState}/></span>
                </div>
                <div className="buildStepLayer__close-button" onClick={closeLayerFn}><span
                    className="buildStepOutput__exit-info">(Press [ESC] to exit) </span>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </div>

                <this.TabNavigation changeTabFn={changeTabFn} activeTab={activeTab} stepDetailLabels={stepDetailLabels}/>
                <this.Tab buildId={buildId} stepId={stepId} activeTab={activeTab}/>

            </div>
        </div>;
    }
}

BuildStepDetailsLayer.propTypes = {
    buildId: PropTypes.any,
    stepName: PropTypes.string,
    stepState: PropTypes.string,
    output: PropTypes.array,
    showLayer: PropTypes.bool,
    requestFn: PropTypes.func,
    stepId: PropTypes.any,
    closeLayerFn: PropTypes.func,
    changeTabFn: PropTypes.func,
    fontColor: PropTypes.any,
    activeTab: PropTypes.string,
    stepDetailLabels: PropTypes.array
};


const outputHiddenProps = {showLayer: false};

const outputVisibleProps = (state) => {
    const buildId = state.output.buildId;
    const stepId = state.output.stepId;
    const flatSteps = Utils.flatSteps(R.path(["buildDetails", buildId], state));
    const step = R.find(step => step.stepId === stepId)(flatSteps);
    const stepName = R.propOr("", "name")(step);
    const stepState = R.propOr("unknown", "state")(step);
    const activeTab = state.output.activeTab;

    const stepDetails = R.defaultTo([], R.propOr([], "details", step));

    const stepDetailLabels = R.pipe(R.map(detail => R.defaultTo(null, detail.label)), R.filter(x => !R.isNil(x)))(stepDetails);

    return {
        buildId: buildId,
        stepId: stepId,
        showLayer: true,
        stepName: stepName,
        stepState: stepState,
        activeTab: activeTab,
        stepDetailLabels: stepDetailLabels
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
        changeTabFn: (activeTab) => dispatch(changeTab(activeTab)),
        closeLayerFn: () => dispatch(hideBuildOutput())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildStepDetailsLayer);
