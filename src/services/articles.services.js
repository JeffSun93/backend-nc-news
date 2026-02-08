const { selectAllArticles } = require("../models/articles.models.js");

function fetchArticlesService() {
  return selectAllArticles;
}

module.exports = { fetchArticlesService };
