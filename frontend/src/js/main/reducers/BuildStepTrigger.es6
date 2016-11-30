import {OPEN_TRIGGER_DIALOG, CLOSE_TRIGGER_DIALOG} from "actions/BuildStepTriggerActions.es6";
import R from "ramda";

export default (oldState = {}, action) => {
    switch(action.type){
        case OPEN_TRIGGER_DIALOG:
            return R.merge(oldState, {showTrigger: true, url: action.url, parameter: action.parameter, triggerName: action.triggerName});
        case CLOSE_TRIGGER_DIALOG:
            return R.merge(oldState, {showTrigger: false});
        default:
            return oldState;
    }
};