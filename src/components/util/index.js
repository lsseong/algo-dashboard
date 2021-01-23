//return a deepcopy
function getDeepCopy(item) {
  return JSON.parse(JSON.stringify(item));
}

function regexValueFormatter(pattern, value) {
  const result = value.match(pattern);
  const finalValue = result.join("");
  return finalValue;
}

export const util = {
  getDeepCopy,
  regexValueFormatter,
};
