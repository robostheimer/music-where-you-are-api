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
  if (reqParams.indexOf("Lat") > -1) {
    const regexLat = exports.getLat(reqParams);
    const latStr = regexLat.split(":")[1];
    const lowerLat = parseFloat(latStr) - 0.05;
    const upperLat = parseFloat(latStr) + 0.05;
    var latGT = { Lat: { $gte: lowerLat } };
    var latLT = { Lat: { $lte: upperLat } };
    reqParams = reqParams
      .replace(regexLat.replace(/_/g, ""), "")
      .replace(/_/g, "");
  }

  if (reqParams.indexOf("Lng") > -1) {
    const regexLng = exports.getLng(reqParams);
    const lngStr = regexLng.split(":")[1];
    const lowerLng = parseFloat(lngStr) - 0.05;
    const upperLng = parseFloat(lngStr) + 0.05;
    var lngGT = { Lng: { $gte: lowerLng } };
    var lngLT = { Lng: { $lte: upperLng } };
    reqParams = reqParams.replace(regexLng.replace(/_/g, ""), "");
    //.replace(/_/g, "");
  }

  let conj = reqParams.split("~")[0];
  let innerConj =
    reqParams.split("(").length > 1
      ? reqParams.split("(")[1].split("~")[0]
      : undefined;
  let finalParams = {};
  let innerParamsFinal = {};

  console.log(reqParams);
  const innerParams = innerConj
    ? exports.arrayToObj(
        reqParams
          .split(`${innerConj}~`)[1]
          .replace(")", "")
          .split("_")
      )
    : "";
  let params = innerConj
    ? exports.arrayToObj(
        reqParams
          .split("~")[1]
          .slice(0, reqParams.split("~")[1].indexOf("("))
          .split("_")
      )
    : exports.arrayToObj(reqParams.split("~")[1].split("_"));
  params = params.map(item => exports.removeValue(item, ""));

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
  const tmpArr = arr.filter(item => {
    return item[key].indexOf(val) > -1;
  });
  return tmpArr;
};

exports.getLat = str => {
  const index = str.indexOf("Lat");
  const latHalf = str.substr(index, str.length);
  const regex = latHalf.split("_")[0] || latHalf;

  return regex;
};

exports.getLng = str => {
  const index = str.indexOf("Lng");
  const lngHalf = str.substr(index, str.length);
  const regex = lngHalf.split("_")[0] || lngHalf;

  return regex;
};
