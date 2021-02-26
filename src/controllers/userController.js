const users = require("../models/user");
const logger = require("../logger");

const register = async (username, password) => {
  try {
    await users.register(new users({ username }), password);
  } catch (err) {
    // logger.error("Error: " + err);
  }
};

module.exports = {
  register,
};
