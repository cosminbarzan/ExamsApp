import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { examsReducer } from "./reducers/exams";


const rootReducer = combineReducers({
    exams: examsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
