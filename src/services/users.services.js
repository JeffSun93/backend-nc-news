const { NotFoundError } = require("../errors/customError.js");
const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.models.js");
const { validateString } = require("../utils/validators.js");
const { ERROR_MSG } = require("../constants/index.js");

function fetchUsersService() {
  return selectAllUsers();
}

async function fetchUserByUsername(username) {
  validateString(username, "username", 1, 100);

  const user = await selectUserByUsername(username);
  if (!user) {
    throw new NotFoundError(ERROR_MSG.USER_NOT_FOUND);
  }
  return user;
}

module.exports = { fetchUsersService, fetchUserByUsername };
