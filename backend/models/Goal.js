const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalType: {
    type: String,
    required: true,
    enum: ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness']
  },
  targetWeight: {
    type: Number
  },
  targetDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Abandoned'],
    default: 'In Progress'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
