//return a deepcopy
function getDeepCopy(item) {
  return JSON.parse(JSON.stringify(item));
}

export const util = {
  getDeepCopy,
};
