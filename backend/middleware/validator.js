import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['customer', 'provider', 'admin']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const orderValidation = [
  body('providerId').notEmpty().withMessage('Provider ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
  body('pickupLocation.lat').isFloat().withMessage('Valid latitude is required'),
  body('pickupLocation.lng').isFloat().withMessage('Valid longitude is required')
];
