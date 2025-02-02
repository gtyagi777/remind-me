import {
    takeEvery,
    put,
    call,
} from "redux-saga/effects"
import {
    GET_QUESTIONS,
    MARK_QUESTION_AS_DONE,
} from "../actions/types"
import { setQuestionAsDone } from "../api/setQuestionAsDone";
import { getQuestions } from "../actions/actions";

// worker Saga
function* handleQuestionDone(action) {
    
    try {
        yield call(setQuestionAsDone, action.payload);
        yield put(getQuestions(action.payload.userId));
    } catch (error) {
        console.log("Error: ", action);
    }
}

function* markQuestionAsDoneWatcher() {
  yield takeEvery(MARK_QUESTION_AS_DONE, handleQuestionDone)
}

export {
    markQuestionAsDoneWatcher,
};