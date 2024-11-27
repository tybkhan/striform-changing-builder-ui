const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,  // Using String instead of ObjectId for development
    required: true
  },
  title: {
    type: String,
    required: [true, 'Form title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
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
        'fileUpload',
        'contactInfo'
      ]
    },
    question: {
      type: String,
      required: true
    },
    options: [String],
    statement: String,
    required: Boolean,
    logic: [{
      id: String,
      questionId: String,
      condition: {
        type: String,
        enum: ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan']
      },
      value: mongoose.Schema.Types.Mixed,
      action: {
        type: String,
        enum: ['show', 'hide']
      },
      targetQuestionId: String
    }],
    visible: {
      type: Boolean,
      default: true
    },
    fileUploadConfig: {
      maxFiles: Number,
      maxFileSize: Number,
      acceptedFileTypes: [String]
    },
    contactFields: {
      firstName: { type: Boolean, default: true },
      lastName: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      phone: { type: Boolean, default: true },
      company: { type: Boolean, default: true }
    }
  }],
  responseCount: {
    type: Number,
    default: 0
  },
  buttonText: String,
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'left'
  },
  submitButtonColor: String,
  titleColor: String,
  questionColor: String,
  descriptionColor: String,
  backgroundColor: String,
  redirectUrl: String,
  emailNotifications: {
    enabled: Boolean,
    email: String,
    subject: String,
    template: String,
    ccEmails: [String],
    sendCopy: Boolean,
    replyTo: String
  }
}, {
  timestamps: true
});

// Middleware
formSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = new mongoose.Types.ObjectId().toString();
  }
  next();
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;