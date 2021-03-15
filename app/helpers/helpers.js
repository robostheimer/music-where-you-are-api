exports.createQuery = (arr) => {
  // add sorting capability (by popularity)
  const params = [];
  arr.forEach((param) => {
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

exports.createAggregateQuery = (reqParams) => {
  console.log(reqParams);
  const splitParams = reqParams.split("_");
  const shouldRegEx = splitParams.indexOf("noRegEx") === -1;
  let newParams = splitParams
    .filter((item) => {
      return item.indexOf("noRegEx") === -1;
    })
    .join("_");
  console.log(newParams);
  console.log(shouldRegEx);
  let params = [];
  if (newParams.indexOf("Lat") > -1) {
    const regexLat = exports.getLat(newParams);
    const latStr = regexLat.split(":")[1];
    const lowerLat = parseFloat(latStr) - 0.15;
    const upperLat = parseFloat(latStr) + 0.15;
    var latGT = { Lat: { $gte: lowerLat } };
    var latLT = { Lat: { $lte: upperLat } };
    newParams = newParams.replace(regexLat.replace(/_/g, ""), "");
    //.replace(/_/g, "");
  }

  if (newParams.indexOf("Lng") > -1) {
    const regexLng = exports.getLng(newParams);
    const lngStr = regexLng.split(":")[1];
    const lowerLng = parseFloat(lngStr) - 0.15;
    const upperLng = parseFloat(lngStr) + 0.15;
    var lngGT = { Lng: { $gte: lowerLng } };
    var lngLT = { Lng: { $lte: upperLng } };
    newParams = newParams.replace(regexLng.replace(/_/g, ""), "");
  }

  let conj = newParams.split("~")[0];
  let innerConj =
    newParams.split("(").length > 1
      ? newParams.split("(")[1].split("~")[0]
      : undefined;
  let finalParams = {};
  let innerParamsFinal = {};

  const innerParams = innerConj
    ? exports.arrayToObj(
        newParams.split(`${innerConj}~`)[1].replace(")", "").split("_"),
        shouldRegEx
      )
    : "";
  let paramsArr = innerConj
    ? exports.arrayToObj(
        newParams
          .split("~")[1]
          .slice(0, newParams.split("~")[1].indexOf("("))
          .split("_"),
        shouldRegEx
      )
    : exports.arrayToObj(newParams.split("~")[1].split("_"), shouldRegEx);
  console.log(paramsArr);
  // need to fix empy values being added here
  paramsArr.forEach((item) => {
    newObj = {};
    for (p in item) {
      if (p !== "") {
        newObj[p] = item[p];
        params.push(newObj);
      }
    }
  });

  conj = `$${conj}`;
  if (latGT) {
    params.push(latGT);
    params.push(latLT);
  }

  if (lngGT) {
    params.push(lngGT);
    params.push(lngLT);
  }
  if (innerConj) {
    innerConj = `$${innerConj}`;
    innerParamsFinal[innerConj] = innerParams;
    params.push(innerParamsFinal);
  }

  finalParams[conj] = params;
  console.log(finalParams);
  return finalParams;
};

exports.stringToObject = (str, shouldRegEx = true) => {
  str = str.toString() || str;
  const obj = {};
  const arr = str.split(":");
  const regex = shouldRegEx ? new RegExp(arr[1], "i") : arr[1];
  obj[arr[0]] = regex;
  return obj;
};

exports.arrayToObj = (arr, shouldRegEx = true) => {
  console.log(shouldRegEx);
  return arr.map((item) => {
    return exports.stringToObject(item, shouldRegEx);
  });
};

exports.removeValue = (obj, val) => {
  newObj = {};
  for (p in obj) {
    if (p !== val) {
      newObj[p] = obj[p];
    }
  }
  return newObj;
};

exports.filterArr = (arr, key, val) => {
  const tmpArr = arr.filter((item) => {
    return item[key].indexOf(val) > -1;
  });
  return tmpArr;
};

exports.getLat = (str) => {
  const index = str.indexOf("Lat");
  const latHalf = str.substr(index, str.length);
  const regex = latHalf.split("_")[0] || latHalf;

  return regex;
};

exports.getLng = (str) => {
  const index = str.indexOf("Lng");
  const lngHalf = str.substr(index, str.length);
  const regex = lngHalf.split("_")[0] || lngHalf;

  return regex;
};
