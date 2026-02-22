const { NotFoundError } = require("../errors/customError.js");
const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.models.js");

function fetchUsersService() {
  return selectAllUsers();
}

function fetchUserByUsername(username) {
  return selectUserByUsername(username).then((user) => {
    if (!user) {
      throw new NotFoundError("UserName not found!");
    }
    return user;
  });
}

module.exports = { fetchUsersService, fetchUserByUsername };
