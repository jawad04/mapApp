const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/api/v1", api);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "client/build"));
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/../../client/build/index.html");
  });
}
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
