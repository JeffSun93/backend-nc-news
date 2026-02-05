const format = require("../db/utils/formatData.js");
const data = require("../db/data/test-data/index");
const reformData = require("../db/utils/reformData.js");

describe("format function using test-data", () => {
  it("should return a string", () => {
    const topics = data.topicData;
    const columns = Object.keys(data.topicData[0]);
    expect(typeof format(topics, columns)).toBe("string");
  });
  it("should return the formatted values for topicData", () => {
    const topics = data.topicData;
    const columns = Object.keys(data.topicData[0]);
    //console.log(format(topics, columns));
    expect(format(topics, columns)).toBe(
      "('The man, the Mitch, the legend', 'mitch', ''), ('Not dogs', 'cats', ''), ('what books are made of', 'paper', '')",
    );
  });
});

describe("reformData function indepently rather than using test-data (advised by Rose)", () => {
  it("should correctly transform data by mapping keys and removing the old key", () => {
    const dataArr = [
      { id: 1, name: "Laptop", catId: "A" },
      { id: 2, name: "Apple", catId: "B" },
    ];
    const rowsArr = [
      { code: "A", categoryName: "Electronics" },
      { code: "B", categoryName: "Fruit" },
    ];

    const result = reformData(
      dataArr,
      rowsArr,
      "catId",
      "code",
      "categoryName",
    );

    expect(result).toEqual([
      { id: 1, name: "Laptop", categoryName: "Electronics" },
      { id: 2, name: "Apple", categoryName: "Fruit" },
    ]);

    expect(result[0]).not.toHaveProperty("catId");
  });

  it("should return null for the new key if no match is found in rowsArr", () => {
    const dataArr = [{ id: 1, locId: 999 }];
    const rowsArr = [{ id: 1, cityName: "London" }];

    const result = reformData(dataArr, rowsArr, "locId", "id", "cityName");

    expect(result[0]).toEqual({
      id: 1,
      cityName: null,
    });
  });

  it("should not mutate the original dataArr", () => {
    const dataArr = [{ id: 1, type: "VIP" }];
    const originalClone = JSON.parse(JSON.stringify(dataArr));
    const rowsArr = [{ key: "VIP", label: "Very Important Person" }];

    reformData(dataArr, rowsArr, "type", "key", "label");

    expect(dataArr).toEqual(originalClone);
  });

  it("should return an empty array when input dataArr is empty", () => {
    const result = reformData([], [{ id: 1 }], "any", "any", "any");
    expect(result).toEqual([]);
  });
});
