function reformData(dataArr, rowsArr, dataKey, rowKey, newKey) {
  return dataArr.map((dataObj) => {
    const dataToChange = rowsArr.find(
      (row) => row[rowKey] === dataObj[dataKey],
    );
    const { [dataKey]: _, ...rest } = dataObj;
    return { ...rest, [newKey]: dataToChange ? dataToChange[newKey] : null };
  });
}
module.exports = reformData;
