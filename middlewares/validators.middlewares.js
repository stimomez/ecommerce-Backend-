const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map(err => err.msg);

    const message = errorMsgs.join('. ');

    return next(new AppError(message, 400));
  }

  next();
};

const createProductValidators = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isNumeric()
    .withMessage('price is numeric value'),
  body('categoryId')
    .notEmpty()
    .withMessage('CategoryId cannot be empty')
    .isNumeric()
    .withMessage('categoryId is numeric value'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isNumeric()
    .withMessage('quantity is numeric value'),
  checkResult,
];

module.exports = { createProductValidators };
