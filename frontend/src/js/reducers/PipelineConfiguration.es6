import {ADD_CONFIGURATION} from '../Actions.es6';

export const PipelineConfigurationReducer = (oldState={}, action) =>{
    switch (action.type) {
      case ADD_CONFIGURATION: return Object.assign({}, action.config);
      default: return oldState;
    }
}
