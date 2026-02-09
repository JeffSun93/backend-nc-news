const express = require("express");
const app = express();
app.use(express.json());
const { CustomError, NotFoundError } = require("../src/errors/customError.js");
const topicsRouter = require("./routes/topics.routes.js");
const articlesRouter = require("./routes/articles.routes.js");
const usersRouter = require("./routes/users.routes.js");
const commentsRouter = require("./routes/comments.routes.js");

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/users", usersRouter);

app.use("/api/comments", commentsRouter);

app.all(/(.*)/, (request, response) => {
  response.status(404).send({ msg: "Route not found!" });
});

app.use((err, request, response, next) => {
  if (err instanceof CustomError) {
    return response.status(err.status).send({ msg: err.message });
  }
  console.log(err);
  response.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
