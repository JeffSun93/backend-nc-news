/**
 * Base custom error class
 * @class
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 */
class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Error
 * @class
 */
class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * 400 Bad Request Error
 * @class
 */
class BadRequestError extends CustomError {
  constructor(message = "Invalid request") {
    super(message, 400);
  }
}

/**
 * 409 Conflict Error (for unique constraint violations, etc)
 * @class
 */
class ConflictError extends CustomError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error
 * @class
 */
class InternalServerError extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  BadRequestError,
  ConflictError,
  InternalServerError,
};
