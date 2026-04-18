const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meal: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  macros: {
    protein: { type: Number, default: 0 }, // in grams
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Nutrition', NutritionSchema);
