const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Nutrition = require('../models/Nutrition');

// @route   GET api/nutrition
// @desc    Get all users nutrition logs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const nutritionLogs = await Nutrition.find({ user: req.user.id }).sort({ date: -1 });
    res.json(nutritionLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/nutrition
// @desc    Add new nutrition log
// @access  Private
router.post('/', auth, async (req, res) => {
  const { meal, calories, macros, date } = req.body;

  try {
    const newNutrition = new Nutrition({
      meal,
      calories,
      macros,
      date,
      user: req.user.id
    });

    const nutrition = await newNutrition.save();
    res.json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/nutrition/:id
// @desc    Delete a nutrition log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let nutrition = await Nutrition.findById(req.params.id);

    if (!nutrition) return res.status(404).json({ msg: 'Nutrition log not found' });

    if (nutrition.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Nutrition.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Nutrition log removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
