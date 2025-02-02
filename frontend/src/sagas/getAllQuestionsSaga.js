import {
    takeEvery,
    put,
    call,
} from "redux-saga/effects"
import { GET_QUESTIONS, GET_ALL_QUESTIONS, GET_SOLVED_QUESTIONS, GET_TODAY_QUESTIONS } from "../actions/types"
import { getQuestions } from "../api/getQuestions";
import { groupBy } from '../utils/groupBy'
import { getQuestionsToReviseToday } from "../utils/revisionHelper";

// worker Saga
function* fetchAllQuestions(action) {

    const questionsDataResponse = yield call(getQuestions, action.userId);
    const allQuestions = questionsDataResponse?.data?.data;
    const groupedQuestions = groupBy(allQuestions, question => question.group);
    const questionsGroupNames = Array.from(groupedQuestions.keys());
    const questionWithGroups = {
        groups: questionsGroupNames,
        questions: Object.fromEntries(groupedQuestions),
    }

    // fire action -> reducer to get all questions
    yield put({
        type: GET_ALL_QUESTIONS,
        payload: questionWithGroups,
    })

    // fire action -> reducer to get only solved questions
    const solvedQuestions = allQuestions.filter(question => question.solveCount !== 0);
    yield put({
        type: GET_SOLVED_QUESTIONS,
        payload: solvedQuestions,
    })

    // fire action -> reducer to get only today's reminder questions
    const todoQuestions = getQuestionsToReviseToday(solvedQuestions);

    yield put({
        type: GET_TODAY_QUESTIONS,
        payload: todoQuestions,
    })
}

// Watcher Saga
function* getQuestionsWatcher() {
  yield takeEvery(GET_QUESTIONS, fetchAllQuestions)
}

export {
    getQuestionsWatcher,
};