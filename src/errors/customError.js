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

class BadRequestError extends CustomError {
  constructor(message = "InvalidRequest!") {
    super(message, 400);
  }
}

module.exports = { CustomError, NotFoundError, BadRequestError };
