const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Form = require('../models/Form');
const { AppError } = require('../middleware/errorHandler');
const auth = require('../middleware/auth');

// Validation rules
const formValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Form title cannot be empty'),
  
  body('questions')
    .optional()
    .isArray()
    .withMessage('Questions must be an array'),
  
  body('questions.*.id')
    .optional()
    .isString()
    .withMessage('Question ID must be a string'),
  
  body('questions.*.type')
    .optional()
    .isIn([
      'text',
      'longText',
      'number',
      'multipleChoice',
      'checkbox',
      'date',
      'email',
      'signature',
      'statement',
      'url',
      'singleSelect',
      'fileUpload'
    ])
    .withMessage('Invalid question type'),
  
  body('questions.*.question')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Question text cannot be empty'),
  
  body('questions.*.options')
    .optional()
    .isArray()
    .withMessage('Options must be an array'),
  
  body('questions.*.required')
    .optional()
    .isBoolean()
    .withMessage('Required field must be a boolean'),
  
  body('questions.*.visible')
    .optional()
    .isBoolean()
    .withMessage('Visible field must be a boolean')
];

// Get all forms for authenticated user
router.get('/', auth, async (req, res, next) => {
  try {
    const forms = await Form.find({ userId: req.user.userId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.json(forms);
  } catch (error) {
    next(new AppError('Error fetching forms', 500));
  }
});

// Get a specific form
router.get('/:id', async (req, res, next) => {
  try {
    const form = await Form.findOne({ id: req.params.id }).lean();
    if (!form) {
      return next(new AppError('Form not found', 404));
    }
    res.json(form);
  } catch (error) {
    next(new AppError('Error fetching form', 500));
  }
});

// Create a new form
router.post('/', auth, formValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const formData = {
      ...req.body,
      userId: req.user.userId
    };

    const form = new Form(formData);
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    next(new AppError(error.message || 'Error creating form', 500));
  }
});

// Update a form
router.put('/:id', auth, formValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const form = await Form.findOneAndUpdate(
      { id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!form) {
      return next(new AppError('Form not found', 404));
    }

    res.json(form);
  } catch (error) {
    next(new AppError('Error updating form', 500));
  }
});

// Delete a form
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const form = await Form.findOneAndDelete({
      id: req.params.id,
      userId: req.user.userId
    });
    
    if (!form) {
      return next(new AppError('Form not found', 404));
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    next(new AppError('Error deleting form', 500));
  }
});

module.exports = router;