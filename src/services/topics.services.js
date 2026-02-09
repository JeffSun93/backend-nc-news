const { selectAllTopics } = require("../models/topics.models.js");

function fetchTopicsService() {
  return selectAllTopics();
}

module.exports = { fetchTopicsService };
