const { body } = require('express-validator');

module.exports.validateSignup = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Phone number is invalid'),
  body('phone_code')
    .notEmpty().withMessage('Phone code is required')
];

module.exports.validateVerifyOTP = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Phone number is invalid'),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 4, max: 4 }).withMessage('OTP should be 4 digits long'),
];

module.exports.validateEmailOtp = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid'),
];

module.exports.validateVerifyEmailOTP = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid'),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 4, max: 4 }).withMessage('OTP should be 6 digits long'),
];

module.exports.validateClientCompleteProfile = [
  body('first_name')
    .notEmpty().withMessage('First name is required'),
  body('last_name')
    .notEmpty().withMessage('Last name is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password should be at least 8 characters'),
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid'),
  body('country_of_residence')
    .notEmpty().withMessage('country_of_residence is required'),

  body('city')
    .notEmpty().withMessage('City is required'),
  body('postal_code')
    .notEmpty().withMessage('Postal code is required'),
];


module.exports.validateClientLogin = [
  body('email')
    .optional()
    .isEmail().withMessage('Email is invalid'),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password should be at least 8 characters'), ,
  body('phone')
    .optional()
    .isMobilePhone('any') // Use 'any' or restrict to specific locales
    .withMessage('Must be a valid phone number'),
  body('phone_code')
    .optional()
    .isNumeric()
    .withMessage('Phone code must be numeric'),
];

