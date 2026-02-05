class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class NotFoundError extends CustomError {
  constructor(message = "ResourceNotFound!") {
    super(message, 404);
  }
}

module.exports = { CustomError, NotFoundError };
