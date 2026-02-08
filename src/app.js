const express = require("express");
const app = express();
app.use(express.json());
const { CustomError, NotFoundError } = require("../src/errors/customError.js");
const topicsRouter = require("./routes/topics.routes.js");

app.use("/api/topics", topicsRouter);

app.all(/(.*)/, (request, response) => {
  response.status(404).send({ msg: "Route not found" });
});

app.use((err, request, response, next) => {
  if (err instanceof CustomError) {
    return response.status(err.status).send({ msg: err.message });
  }

  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
