import {
  PERFORMANCE_ENDPOINT,
  STATUSES_ENDPOINT,
  SCHEMA_ENDPOINT,
  STRATEGY_CREATION_ENDPOINT,
} from "../constants/index";

//return a deepcopy
function getDeepCopy(item) {
  return JSON.parse(JSON.stringify(item));
}

//return value after regex removal based pattern
function regexValueFormatter(pattern, value) {
  const result = value.match(pattern);
  const finalValue = result.join("");
  return finalValue;
}

export const util = {
  getDeepCopy,
  regexValueFormatter,
};

function urlMerge(host, port, endpoints) {
  return "http://" + host + ":" + port + "/" + endpoints;
}

function getStreamingData(host, port, strategyName) {
  return "http://" + host + ":" + port + "/service/" + strategyName;
}

function getPerfomance(host, port) {
  return urlMerge(host, port, PERFORMANCE_ENDPOINT);
}
function getStatuses(host, port) {
  return urlMerge(host, port, STATUSES_ENDPOINT);
}

function getSchema(host, port) {
  return urlMerge(host, port, SCHEMA_ENDPOINT);
}

function getStrategyCreation(host, port) {
  return urlMerge(host, port, STRATEGY_CREATION_ENDPOINT);
}

export const URL = {
  getStreamingData,
  getPerfomance,
  getStatuses,
  getSchema,
  getStrategyCreation,
};
