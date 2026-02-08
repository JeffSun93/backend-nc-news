const { fetchUsersService } = require("../services/users.services.js");

function getAllUsers(req, res, next) {
  return fetchUsersService()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

module.exports = { getAllUsers };
