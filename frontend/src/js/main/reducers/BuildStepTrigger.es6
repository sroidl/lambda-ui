import * as Actions from "../actions/BuildStepTriggerActions.es6";
import R from "ramda";

export default (oldState = {}, action) => {
    switch (action.type) {
        case Actions.OPEN_TRIGGER_DIALOG: {
            return R.merge(oldState, {
                showTrigger: true,
                url: action.url,
                parameter: action.parameter,
                triggerName: action.triggerName
            });
        }
        case Actions.CLOSE_TRIGGER_DIALOG: {
            return R.merge(oldState, {showTrigger: false});
        }
        case Actions.KILLED_STEP: {
            const lens = R.lensPath(["killedSteps", action.buildId]);
            return R.over(lens, R.append(action.stepId))(oldState);
        }
        default:
            return oldState;
    }
};