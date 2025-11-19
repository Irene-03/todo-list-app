// ======================================================================
// Todo Model with Mongoose
// Phase 3: MongoDB Integration (replacing SQLite)
// ======================================================================

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Task text is required'],
    trim: true,
    minlength: [1, 'Task text must be at least 1 character'],
    maxlength: [500, 'Task text cannot exceed 500 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  done: {
    type: Boolean,
    default: false
  },
  important: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  dueDate: {
    type: Date
  },
  groups: [{
    type: String,
    trim: true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
todoSchema.index({ userId: 1, done: 1 });
todoSchema.index({ userId: 1, important: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });

// Update completedAt when done changes to true
todoSchema.pre('save', function(next) {
  if (this.isModified('done') && this.done) {
    this.completedAt = new Date();
  } else if (this.isModified('done') && !this.done) {
    this.completedAt = undefined;
  }
  next();
});

module.exports = mongoose.model('Todo', todoSchema);
