const {
  fetchUsersService,
  fetchUserByUsername,
} = require("../services/users.services.js");

function getAllUsers(req, res, next) {
  return fetchUsersService()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  return fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserByUsername };
