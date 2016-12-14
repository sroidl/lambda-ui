import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/quickDetails.sass";
import R from "ramda";
import QuickStep from "../details/QuickStep.es6";

export class QuickDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {steps, buildId, maxDepth} = this.props;

        return <div className="quickDetails">
            <div className="quickTitle">Quick Access</div>
            {R.map(step => <QuickStep key={step.stepId} curDepth={1} maxDepth={maxDepth} buildId={buildId} step={step} />)(steps)}
        </div>;
    }
}

QuickDetails.propTypes = {
    buildId: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    maxDepth: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
    const steps = state.buildDetails[ownProps.buildId].steps;

    return {
        buildId: ownProps.buildId,
        steps: steps,
        maxDepth: ownProps.maxDepth
    };
};

export default connect(mapStateToProps)(QuickDetails);