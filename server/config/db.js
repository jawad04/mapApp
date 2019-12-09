const monk = require("monk");
const config = require("config");
const db = monk(
  "mongodb+srv://mapApp:C7zkPxKIsVTB7vhf@cluster0-iyqco.mongodb.net/test?retryWrites=true&w=majority"
);

module.exports = db;
