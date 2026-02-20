const { selectAllUsers } = require("../models/users.models.js");

function fetchUsersService() {
  return selectAllUsers();
}

module.exports = { fetchUsersService };
