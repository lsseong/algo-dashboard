import { ADD_ARTICLE, STORE_COMMENTARIES } from "../constants/action-types";
import { COMMENTARIES_LIMIT } from "../constants";
const forbiddenWords = ["spam", "money"];

export function checkIfDataLimitExceeded({ dispatch, getState }) {
  console.log("dispatch", getState());
  return function (next) {
    return function (action) {
      // do your stuff
      console.log("action", action);
      if (action.type === STORE_COMMENTARIES) {
        if (getState().allComments.length >= COMMENTARIES_LIMIT - 1) {
          action.limitExceed = true;
        }
      }
      return next(action);
    };
  };
}
