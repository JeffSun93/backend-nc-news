const { fetchTopicsService } = require("../services/topics.services.js");

function getAllTopics(req, res, next) {
  return fetchTopicsService()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

module.exports = { getAllTopics };
