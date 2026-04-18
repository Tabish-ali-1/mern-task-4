const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

// @route   GET api/workouts
// @desc    Get all users workouts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/workouts
// @desc    Add new workout
// @access  Private
router.post('/', auth, async (req, res) => {
  const { exerciseType, duration, intensity, date } = req.body;

  try {
    const newWorkout = new Workout({
      exerciseType,
      duration,
      intensity,
      date,
      user: req.user.id
    });

    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ msg: 'Workout not found' });

    // Make sure user owns workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
