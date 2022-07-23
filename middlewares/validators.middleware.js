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

const createUserValidators = [
  body('userName').notEmpty().withMessage('Name cannot be empty'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isAlphanumeric()
    .withMessage('Password must contain letters and numbers'),
  checkResult,
];

const createRestaurantValidators = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('address').notEmpty().withMessage('Field cannot be empty'),
  body('rating')
    .notEmpty()
    .withMessage('Field cannot be empty')
    .isNumeric()
    .withMessage('only number'),
  checkResult,
];

const createMealValidators = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Field cannot be empty')
    .isNumeric()
    .withMessage('only number'),
  checkResult,
];

const createOrderValidators = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isNumeric()
    .withMessage('only number'),
  body('mealId')
    .notEmpty()
    .withMessage('Field cannot be empty')
    .isNumeric()
    .withMessage('only number'),
  checkResult,
];
module.exports = {
  createUserValidators,
  createRestaurantValidators,
  createMealValidators,
  createOrderValidators,
};
