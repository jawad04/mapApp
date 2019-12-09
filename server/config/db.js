const monk = require("monk");
const config = require("config");
const db = monk(config.get("DATABASE_URL"));

module.exports = db;
