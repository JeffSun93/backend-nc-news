const { fetchTopicsService } = require("../services/topics.services.js");
const { HTTP_STATUS } = require("../constants/index.js");

async function getAllTopics(req, res, next) {
  try {
    const topics = await fetchTopicsService();
    res.status(HTTP_STATUS.OK).send({ topics });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTopics };
