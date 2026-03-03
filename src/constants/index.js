// Centralised constants for the application

// Allowed query parameters for articles endpoint
const ARTICLE_SORT_COLUMNS = [
  "author",
  "title",
  "article_id",
  "topic",
  "created_at",
  "votes",
  "comment_count",
];
const ARTICLE_SORT_ORDER = ["ASC", "DESC"];

// default query parameters
const DEFAULTS = {
  sort_by: "created_at",
  order: "DESC",
};

// Standard HTTP status codes (could use library but keeps built-in)
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
};

// Common error messages
const ERROR_MSG = {
  ARTICLE_NOT_FOUND: "Article not found",
  COMMENT_NOT_FOUND: "Comment not found",
  USER_NOT_FOUND: "User not found",
  TOPIC_NOT_FOUND: "Topic not found",
  ROUTE_NOT_FOUND: "Route not found",
  INVALID_JSON: "Invalid JSON in request body",
  INVALID_ID: "Identifier must be a positive integer",
  // validation
  INC_VOTES_REQUIRED: "inc_votes is required",
  RESOURCE_EXISTS: "Resource already exists",
};

module.exports = {
  ARTICLE_SORT_COLUMNS,
  ARTICLE_SORT_ORDER,
  DEFAULTS,
  HTTP_STATUS,
  ERROR_MSG,
};