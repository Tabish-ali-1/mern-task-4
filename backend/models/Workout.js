const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseType: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // In minutes
    required: true
  },
  intensity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
