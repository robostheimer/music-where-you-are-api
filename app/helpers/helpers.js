exports.createQuery = arr => {
  // add sorting capability (by popularity)
  const params = [];
  arr.forEach(param => {
    const hasLat = param.indexOf("Lat") > -1;
    const hasLng = param.indexOf("Lng") > -1;
    if (hasLat || hasLng) {
      const numArr = param.split(":");
      const upperObj = {};
      const lowerObj = {};
      const lowerNum = parseFloat(numArr[1]) - 0.05;
      const upperNum = parseFloat(numArr[1]) + 0.05;

      lowerObj[numArr[0]] = { $lte: upperNum };
      upperObj[numArr[0]] = { $gte: lowerNum };
      params.push(lowerObj);
      params.push(upperObj);
    } else {
      params.push(exports.stringToObject(param));
    }
  });
  return params;
};

exports.createAggregateQuery = reqParams => {
  let conj = reqParams.split("~")[0];
  let innerConj =
    reqParams.split("(").length > 1
      ? reqParams.split("(")[1].split("~")[0]
      : undefined;
  let finalParams = {};
  let innerParamsFinal = {};

  const innerParams = innerConj
    ? exports.arrayToObj(
        reqParams
          .split(`${innerConj}~`)[1]
          .replace(")", "")
          .split("_")
      )
    : "";
  const params = innerConj
    ? exports.arrayToObj(
        reqParams
          .split("~")[1]
          .slice(0, reqParams.split("~")[1].indexOf("("))
          .split("_")
      )
    : exports.arrayToObj(reqParams.split("~")[1].split("_"));

  conj = `$${conj}`;
  if (innerConj) {
    innerConj = `$${innerConj}`;
    innerParamsFinal[innerConj] = innerParams;
    params.push(innerParamsFinal);
  }
  finalParams[conj] = params;

  return finalParams;
};

exports.stringToObject = str => {
  str = str.toString() || str;
  const obj = {};
  const arr = str.split(":");
  const regex = new RegExp(arr[1], "i");
  obj[arr[0]] = regex;
  return obj;
};

exports.arrayToObj = arr => {
  return arr.map(item => {
    return exports.stringToObject(item);
  });
};

exports.filterArr = (arr, key, val) => {
  const tmpArr = arr.filter(item => {
    return item[key].indexOf(val) > -1;
  });
  return tmpArr;
};
