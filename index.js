#!/usr/bin/env node
require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("./src/middlewares/passport");
const app = express();
const router = require("./src/routes");
const cookieParser = require("cookie-parser");
const logger = require("./src/logger");
const db = require("./src/database/mongoDB");
const session = require("./src/middlewares/session");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const server = app
  .listen(process.env.serverPort, async () => {
    await db.connect();
    logger.info(`Server started on port:${process.env.serverPort}`);
  })
  .on("error", (err) => {
    logger.error("Error: " + err);
  });
app.use(router);
app.use(express.static(`${__dirname}/build`));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

module.exports = { server, app };
