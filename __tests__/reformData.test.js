const reform = require("../db/util/formatData");
const data = require("../db/data/test-data/index");

describe("reform", () => {
  it("should return the formatted values for topicData", () => {
    const topics = data.topicData;
    const columns = Object.keys(data.topicData[0]);
    console.log(format(topics, columns));
    expect(format(topics, columns)).toBe(
      "('The man, the Mitch, the legend', 'mitch', ''), ('Not dogs', 'cats', ''), ('what books are made of', 'paper', '')",
    );
  });
});
