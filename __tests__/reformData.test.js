const reformData = require("../db/util/reformData.js");

describe("reformData function", () => {
  // Test Case 1: Standard functionality
  test("should correctly transform data by mapping keys and removing the old key", () => {
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

    // Verify the old dataKey is removed
    expect(result[0]).not.toHaveProperty("catId");
  });

  // Test Case 2: Null protection
  test("should return null for the new key if no match is found in rowsArr", () => {
    const dataArr = [{ id: 1, locId: 999 }];
    const rowsArr = [{ id: 1, cityName: "London" }]; // ID 999 does not exist here

    const result = reformData(dataArr, rowsArr, "locId", "id", "cityName");

    expect(result[0]).toEqual({
      id: 1,
      cityName: null, // Protected from crashing
    });
  });

  // Test Case 3: Immutability (Pure Function check)
  test("should not mutate the original dataArr", () => {
    const dataArr = [{ id: 1, type: "VIP" }];
    const originalClone = JSON.parse(JSON.stringify(dataArr));
    const rowsArr = [{ key: "VIP", label: "Very Important Person" }];

    reformData(dataArr, rowsArr, "type", "key", "label");

    // The original dataArr should remain unchanged because of the { ...rest } logic
    expect(dataArr).toEqual(originalClone);
  });

  // Test Case 4: Empty arrays
  test("should return an empty array when input dataArr is empty", () => {
    const result = reformData([], [{ id: 1 }], "any", "any", "any");
    expect(result).toEqual([]);
  });
});
