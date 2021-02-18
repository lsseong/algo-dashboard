import {
  ADD_ARTICLE,
  STORE_FORM_DATA,
  STORE_COMMENTARIES,
  SET_SCHEMA_HOST,
  SET_SCHEMA_PORT,
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function setSchemaHost(payload) {
  return { type: SET_SCHEMA_HOST, payload };
}

export function setSchemaPort(payload) {
  return { type: SET_SCHEMA_PORT, payload };
}

export function storeFormData(payload) {
  return { type: STORE_FORM_DATA, payload, limitExceed: false };
}

export function storeAllComments(payload) {
  return { type: STORE_COMMENTARIES, payload, limitExceed: false };
}

export function getData() {
  return { type: "DATA_REQUESTED", limitExceed: false };
}
