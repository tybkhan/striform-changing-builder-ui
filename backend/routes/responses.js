const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');
const { AppError } = require('../middleware/errorHandler');

// Get all responses for a form
router.get('/form/:formId', async (req, res, next) => {
  try {
    console.log('Fetching responses for form:', req.params.formId);
    
    // Find the form first to ensure it exists
    const form = await Form.findOne({ id: req.params.formId });
    if (!form) {
      return next(new AppError('Form not found', 404));
    }

    // Fetch responses
    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 });
    
    // Convert Map to Object for each response
    const formattedResponses = responses.map(response => {
      const plainResponse = response.toObject();
      plainResponse.answers = Object.fromEntries(plainResponse.answers);
      return plainResponse;
    });

    console.log('Found responses:', formattedResponses.length);
    res.json(formattedResponses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    next(new AppError('Error fetching responses', 500));
  }
});

// Create a new response
router.post('/', async (req, res, next) => {
  try {
    console.log('Creating new response for form:', req.body.formId);
    
    // Find the form first
    const form = await Form.findOne({ id: req.body.formId });
    if (!form) {
      return next(new AppError('Form not found', 404));
    }

    // Create a Map for answers with question details
    const answersMap = new Map();
    for (const [questionId, answer] of Object.entries(req.body.answers)) {
      const question = form.questions.find(q => q.id === questionId);
      if (question) {
        answersMap.set(questionId, {
          question: question.question,
          answer: answer,
          type: question.type
        });
      }
    }

    const response = new Response({
      formId: req.body.formId,
      answers: answersMap,
      submittedAt: new Date(),
      isPartial: req.body.isPartial || false,
      lastQuestionAnswered: req.body.lastQuestionAnswered
    });

    const newResponse = await response.save();
    console.log('Response created:', newResponse._id);

    // Update form response count
    await Form.findOneAndUpdate(
      { id: req.body.formId },
      { $inc: { responseCount: 1 } }
    );

    res.status(201).json(newResponse);
  } catch (error) {
    console.error('Error creating response:', error);
    next(new AppError('Error creating response', 500));
  }
});

module.exports = router;