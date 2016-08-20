import { createStore } from 'redux'

const initialState = {
  builds: [
    { id: 1,
      state: "success"
    },
    { id: 2,
      state: "failed"}
  ]
}

const rootReducer = (oldState=initialState, action) => {
   return initialState;
}

let appState = createStore(rootReducer);

export default appState;
