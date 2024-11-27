const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    index: true
  },
  answers: {
    type: Map,
    of: new mongoose.Schema({
      question: String,
      answer: mongoose.Schema.Types.Mixed,
      type: String
    }, { _id: false }),
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isPartial: {
    type: Boolean,
    default: false
  },
  lastQuestionAnswered: Number
}, {
  timestamps: true
});

// Indexes for better query performance
responseSchema.index({ formId: 1, submittedAt: -1 });

module.exports = mongoose.model('Response', responseSchema);