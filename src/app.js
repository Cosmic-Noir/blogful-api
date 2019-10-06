require("dotenv").config();
const express = require("express");
const jsonParser = express.json();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const articlesRouter = require("./articles/articles-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get("/", (req, res) => {
  res.json("yes");
});

app.get("/xss", (req, res) => {
  res.cookie("secretToken", "1234567890");
  res.sendFile(__dirname + "/xss-example.html");
});

// Router:
app.use("/articles", articlesRouter);

module.exports = app;
