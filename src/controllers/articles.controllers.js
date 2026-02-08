const { fetchArticlesService } = require("../services/articles.services.js");

function getAllArticles(req, res, next) {
  return fetchArticlesService()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

module.exports = { getAllArticles };
