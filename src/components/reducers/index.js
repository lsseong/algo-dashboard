import {
  ADD_ARTICLE,
  STORE_FORM_DATA,
  STORE_COMMENTARIES,
  SET_SCHEMA_HOST,
  SET_SCHEMA_PORT,
} from "../constants/action-types";

const initialState = {
  articles: [],
  remoteArticles: [],
  formData: [],
  allComments: [],
  schemaHost: "",
  schemaPort: "",
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload),
    });
  }

  if (action.type === "DATA_LOADED") {
    return Object.assign({}, state, {
      remoteArticles: state.remoteArticles.concat(action.payload),
    });
  }

  if (action.type === SET_SCHEMA_HOST) {
    return Object.assign({}, state, {
      schemaHost: action.payload,
    });
  }

  if (action.type === SET_SCHEMA_PORT) {
    return Object.assign({}, state, {
      schemaPort: action.payload,
    });
  }

  if (action.type === STORE_FORM_DATA) {
    return Object.assign({}, state, {
      formData: action.payload,
    });
  }

  if (action.type === STORE_COMMENTARIES) {
    if (action.limitExceeded) {
      return Object.assign({}, state, {
        remoteArticles: state.remoteArticles.concat(action.payload).shift(),
      });
    }
  } else {
    return Object.assign({}, state, {
      remoteArticles: state.remoteArticles.concat(action.payload),
    });
  }

  return state;
}

export default rootReducer;
