import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/quickDetails.sass";
import R from "ramda";
import QuickStep from "../details/QuickStep.es6";
import * as Actions from "../actions/BuildStepActions.es6";
import * as Utils from "../Utils.es6";
import TransitionGroup from "react-addons-css-transition-group";

const ScrollInfo = () => {

    return <div className="quickDetails__scrollInfo">
        <div className="quickDetails__scrollInfo__icon fa-stack fa">
            <i className="fa fa-arrows-h fa-stack-2x"></i>
            <i className="fa fa-hand-grab-o fa-stack-1x"></i>
        </div>
        <span className="quickDetails__scrollInfo__text">Grab & Scroll</span>
    </div>;
};


export class QuickDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    expandAllLink() {
            return <span className="quickDetails__expand-all link" onClick={this.props.expandAllFn}
                         title="Open all steps">
                <i className="fa fa-plus-square-o"></i>
            </span>;
    }

    collapseAllLink() {
            return <span className="quickDetails__collapse-all link" onClick={this.props.collapseAllFn}
                         title="Close all steps">
                <i className="fa fa-minus-square-o"></i>
            </span>;
    }

    followLink() {
            const followIcon = this.props.isFollow ? "fa-check-square-o" : "fa-square-o";

            return <span className="quickDetails__follow link" onClick={this.props.followFn}
                         title="Follow active steps">
                <i className={`fa ${followIcon}`}></i> follow
            </span>;
    }

    render() {
        const {steps, buildId, maxDepth, showScrollInfo} = this.props;

        return <div className="quickDetails">
            <div className="quickTitle">Quick
                Access {this.expandAllLink()} {this.collapseAllLink()} {this.followLink()} </div>
            {R.map(step => <QuickStep key={step.stepId} curDepth={1} maxDepth={maxDepth} buildId={buildId}
                                      step={step}/>)(steps)}

            <TransitionGroup
                transitionName="quickDetails__scrollInfo--fade"
                transitionEnterTimeout={200}
                transitionAppear={true}
                transitionAppearTimeout={200}
                transitionLeaveTimeout={200}>
                { showScrollInfo && <ScrollInfo/> }
            </TransitionGroup>

        </div>;
    }
}

QuickDetails.propTypes = {
    buildId: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    maxDepth: PropTypes.number,
    expandAllFn: PropTypes.func.isRequired,
    collapseAllFn: PropTypes.func.isRequired,
    followFn: PropTypes.func.isRequired,
    isFollow: PropTypes.bool,
    showScrollInfo: PropTypes.bool
};

export const mapStateToProps = (state, ownProps) => {
    const details = R.propOr({}, ownProps.buildId)(state.buildDetails);
    const steps = R.propOr([], "steps")(details);
    const stepIds = R.pipe(Utils.flatSteps, R.map(R.prop("stepId")))(details);
    const isFollow = R.pathOr(true, ["showSubsteps", ownProps.buildId, "follow"])(state);

    const stateProps = {
        steps: steps,
        stepIds: stepIds,
        isFollow: isFollow,
        showScrollInfo: R.path([ownProps.buildId, "showScrollInfo"], state.showSubsteps)
    };

    return R.mergeAll([ownProps, stateProps]);
};

export const mapDispatchToProps = (dispatch, props) => {
    const openStep = (stepId) => dispatch(Actions.openSubsteps(props.buildId, stepId));
    const collapseStep = (stepId) => dispatch(Actions.closeSubsteps(props.buildId, stepId));
    const follow = () => dispatch(Actions.toggleFollow(props.buildId));

    return {
        expandAllFn: (stepIds) => R.forEach(openStep)(stepIds),
        collapseAllFn: (stepIds) => R.forEach(collapseStep)(stepIds),
        followFn: follow
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const curriedExpandAndCollapse = {
        expandAllFn: () => dispatchProps.expandAllFn(stateProps.stepIds),
        collapseAllFn: () => dispatchProps.collapseAllFn(stateProps.stepIds),
    };

    return R.mergeAll([ownProps, stateProps, dispatchProps, curriedExpandAndCollapse]);
};


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(QuickDetails);