exports.createQuery = arr => {
    // add sorting capability (by popularity)
    const params = [];
    arr.forEach(param => {
        const hasLat = param.indexOf('Lat') > -1;
        const hasLng = param.indexOf('Lng') > -1
        if (hasLat || hasLng) {
            const numArr = param.split(':');
            const upperObj = {};
            const  lowerObj = {};
            const lowerNum = parseFloat(numArr[1]) - .05;
            const upperNum = parseFloat(numArr[1]) + .05
           
            lowerObj[numArr[0]] = { $lte: upperNum };
            upperObj[numArr[0]] = { $gte: lowerNum };
            params.push(lowerObj);
            params.push(upperObj);
            
        } else {
            params.push(_stringToObject(param));
        }
    })
   return params;
}


_stringToObject = str => {
    const obj = {};
    const arr = str.split(':');
    const regex = new RegExp(arr[1], 'i')
    obj[arr[0]] = regex
    return obj

}


exports.filterArr= (arr, key, val) =>  {
    const tmpArr = arr.filter(item => {
        return item[key].indexOf(val) > -1;
    });
    return tmpArr;
}
