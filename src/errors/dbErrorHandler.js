/**
 * Database error code mapper
 * Maps PostgreSQL error codes to application error classes
 * Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */

const { BadRequestError, NotFoundError, CustomError } = require("./customError");

const dbErrorMap = {
  // Class 22 — Data Exception
  "22P02": {
    status: 400,
    message: "Invalid data format. Please check your input.",
    userFriendly: true,
  },
  // Class 23 — Integrity Constraint Violation
  "23502": {
    status: 400,
    message: "Required field is missing.",
    userFriendly: true,
  },
  "23503": {
    status: 404,
    message: "Referenced resource not found.",
    userFriendly: true,
  },
  "23505": {
    status: 409,
    message: "This resource already exists.",
    userFriendly: true,
  },
  // Class 42 — Syntax Error or Access Violation
  "42703": {
    status: 500,
    message: "Database schema error. Please contact support.",
    userFriendly: false,
  },
};

/**
 * Converts PostgreSQL errors to application errors
 * @param {Error} err - The database error
 * @returns {CustomError} - Application-specific error
 */
function handleDatabaseError(err) {
  const errorConfig = dbErrorMap[err.code];

  if (errorConfig) {
    const message = errorConfig.userFriendly ? errorConfig.message : err.message;
    return new CustomError(message, errorConfig.status);
  }

  // Unknown database error - log it and return generic error
  console.error("Unhandled database error:", {
    code: err.code,
    message: err.message,
    detail: err.detail,
  });

  return new CustomError(
    "Database error occurred. Please try again later.",
    500
  );
}

/**
 * Determines if an error is a database error
 * @param {Error} err - The error to check
 * @returns {boolean}
 */
function isDatabaseError(err) {
  return err.code && typeof err.code === "string";
}

module.exports = {
  handleDatabaseError,
  isDatabaseError,
  dbErrorMap,
};
