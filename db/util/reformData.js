function reformData(dataArr, rowsArr, dataKey, rowKey, newKey) {
  return dataArr.map((dataObj) => {
    const dataToChange = rowsArr.find(
      (row) => row[rowKey] === dataObj[dataKey],
    );
    delete dataObj[dataKey];

    return { ...dataObj, [newKey]: dataToChange[newKey] };
  });
}
module.exports = reformData;
