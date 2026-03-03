const {
  fetchUsersService,
  fetchUserByUsername,
} = require("../services/users.services.js");
const { HTTP_STATUS } = require("../constants/index.js");

async function getAllUsers(req, res, next) {
  try {
    const users = await fetchUsersService();
    res.status(HTTP_STATUS.OK).send({ users });
  } catch (err) {
    next(err);
  }
}

async function getUserByUsername(req, res, next) {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    res.status(HTTP_STATUS.OK).send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserByUsername };
