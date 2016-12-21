import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/quickDetails.sass";
import R from "ramda";
import QuickStep from "../details/QuickStep.es6";
import DevToggles from "DevToggles.es6";

export class QuickDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    expandAllLink() {
        if (DevToggles.quickDetails_expandCollapse) {
            return <a href="#" className="quickDetails__expand-all" onClick={this.props.expandAllFn}>Expand All</a>;
        }
        return null;
    }

    collapseAllLink() {
        if (DevToggles.quickDetails_expandCollapse) {
            return <a href="#" className="quickDetails__collapse-all" onClick={this.props.collapseAllFn}>Collapse All</a>;
        }
        return null;
    }

    render(){
        const {steps, buildId, maxDepth} = this.props;

        return <div className="quickDetails">
            <div className="quickTitle">Quick Access {this.expandAllLink()} {this.collapseAllLink()} </div>
            {R.map(step => <QuickStep key={step.stepId} curDepth={1} maxDepth={maxDepth} buildId={buildId} step={step} />)(steps)}
        </div>;
    }
}

QuickDetails.propTypes = {
    buildId: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    maxDepth: PropTypes.number,
    expandAllFn: PropTypes.func.isRequired,
    collapseAllFn: PropTypes.func.isRequired
};

export const mapStateToProps = (state, ownProps) => {
    const steps = {steps: R.pathOr([], [ownProps.buildId, "steps"])(state.buildDetails)};
    return R.mergeAll([ownProps, steps]);
};

export const mapDispatchToProps = (dispatch) => {
    return {
        expandAllFn: () => dispatch(),
        collapseAllFn: () => dispatch()
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickDetails);