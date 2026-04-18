const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

// @route   GET api/goals
// @desc    Get all users goals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/goals
// @desc    Add new goal
// @access  Private
router.post('/', auth, async (req, res) => {
  const { goalType, targetWeight, targetDate, status, date } = req.body;

  try {
    const newGoal = new Goal({
      goalType,
      targetWeight,
      targetDate,
      status,
      date,
      user: req.user.id
    });

    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { goalType, targetWeight, targetDate, status } = req.body;

  const goalFields = {};
  if (goalType) goalFields.goalType = goalType;
  if (targetWeight) goalFields.targetWeight = targetWeight;
  if (targetDate) goalFields.targetDate = targetDate;
  if (status) goalFields.status = status;

  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true }
    );

    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
