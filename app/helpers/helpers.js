exports.queryTypes = {
    gt: 'gt',
    gte: 'gte',
    lt: 'lt',
    lte: 'lte',
    in: 'in',
    or: 'or',
    and: 'and'
};

exports.createQuery = arr => {
    console.log(arr);
    const params = [];
    arr.forEach(param => {
        const hasLat = param.indexOf('Lat') > -1;
        const hasLng = param.indexOf('Lng') > -1;
        const hasName = param.indexOf('Name') > -1;
        console.log(hasName)
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
        } else if(hasName) {
            nameArr = param.split(':');
            const regex = new RegExp(nameArr[1], 'i');
            params.push({ Name: regex });
            
        } else {
            params.push(_stringToObject(param));
        }
    })
    console.log('prams', params)
   return params;
}


_stringToObject = str => {
    console.log('gimme', str)
    const obj = {};
    const arr = str.split(':');
    obj[arr[0]] = arr[1];
    return obj

}