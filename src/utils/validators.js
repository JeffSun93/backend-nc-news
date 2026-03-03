const { BadRequestError } = require("../errors/customError.js");

/**
 * Validates that a value is a valid positive integer
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field (for error messages)
 * @throws {BadRequestError} If the value is not a valid positive integer
 * @returns {void}
 */
function validatePositiveInteger(value, fieldName) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new BadRequestError(`${fieldName} must be a positive integer!`);
  }
}

/**
 * Validates that a string is not empty and within length limits
 * @param {string} value - The string to validate
 * @param {string} fieldName - The name of the field (for error messages)
 * @param {number} minLength - Minimum allowed length (default: 1)
 * @param {number} maxLength - Maximum allowed length (default: 5000)
 * @throws {BadRequestError} If validation fails
 * @returns {void}
 */
function validateString(value, fieldName, minLength = 1, maxLength = 5000) {
  if (typeof value !== "string") {
    throw new BadRequestError(`${fieldName} must be a string!`);
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    throw new BadRequestError(
      `${fieldName} must be at least ${minLength} character(s)!`
    );
  }

  if (trimmed.length > maxLength) {
    throw new BadRequestError(
      `${fieldName} must not exceed ${maxLength} character(s)!`
    );
  }
}

/**
 * Validates that a value is a valid number
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field (for error messages)
 * @throws {BadRequestError} If the value is not a valid number
 * @returns {void}
 */
function validateNumber(value, fieldName) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new BadRequestError(`${fieldName} must be a valid number!`);
  }
}

/**
 * Validates that a value is included in an allowed set
 * @param {any} value - The value to validate
 * @param {array} allowedValues - Array of allowed values
 * @param {string} fieldName - The name of the field (for error messages)
 * @throws {BadRequestError} If the value is not in the allowed set
 * @returns {void}
 */
function validateIncludes(value, allowedValues, fieldName) {
  if (!allowedValues.includes(value)) {
    throw new BadRequestError(
      `${fieldName} must be one of: ${allowedValues.join(", ")}!`
    );
  }
}

module.exports = {
  validatePositiveInteger,
  validateString,
  validateNumber,
  validateIncludes,
};
