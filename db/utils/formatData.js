const format = require("pg-format");

function dataFormat(dataArr, columns) {
  const values = dataArr.map((dataObj) =>
    columns.map((column) => dataObj[column]),
  );
  return format("%L", values);
}

module.exports = dataFormat;
