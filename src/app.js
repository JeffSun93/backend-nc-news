const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

// Constants & error handlers
const { HTTP_STATUS, ERROR_MSG } = require("./constants/index.js");
const { CustomError } = require("../src/errors/customError.js");
const { handleDatabaseError, isDatabaseError } = require("../src/errors/dbErrorHandler.js");

// Routes
const topicsRouter = require("./routes/topics.routes.js");
const articlesRouter = require("./routes/articles.routes.js");
const usersRouter = require("./routes/users.routes.js");
const commentsRouter = require("./routes/comments.routes.js");

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

// 404 handler for undefined routes
app.all(/(.*)/, (request, response) => {
  response.status(HTTP_STATUS.NOT_FOUND).send({ msg: ERROR_MSG.ROUTE_NOT_FOUND });
});

/**
 * Global error handling middleware
 * Handles all errors from routes and services
 */
app.use((err, request, response, next) => {
  // Handle database errors
  if (isDatabaseError(err)) {
    const appError = handleDatabaseError(err);
    return response.status(appError.status).send({ msg: appError.message });
  }

  // Handle custom application errors
  if (err instanceof CustomError) {
    return response.status(err.status).send({ msg: err.message });
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return response.status(400).send({ msg: "Invalid JSON in request body" });
  }

  // Log unexpected errors
  console.error("Unhandled error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Return generic error response to client
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
