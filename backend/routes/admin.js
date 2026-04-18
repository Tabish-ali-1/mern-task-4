const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Weight = require('../models/Weight');
const Goal = require('../models/Goal');

// @route   GET api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/stats
// @desc    Get overall platform statistics (admin only)
// @access  Private/Admin
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const totalNutrition = await Nutrition.countDocuments();
    const totalWeightLogs = await Weight.countDocuments();
    const totalGoals = await Goal.countDocuments();

    res.json({
      totalUsers,
      totalWorkouts,
      totalNutrition,
      totalWeightLogs,
      totalGoals,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/workouts
// @desc    Get all workouts from all users (admin only)
// @access  Private/Admin
router.get('/workouts', auth, admin, async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate('user', 'name email')
      .sort({ date: -1 })
      .limit(100);
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/nutrition
// @desc    Get all nutrition logs from all users (admin only)
// @access  Private/Admin
router.get('/nutrition', auth, admin, async (req, res) => {
  try {
    const nutrition = await Nutrition.find()
      .populate('user', 'name email')
      .sort({ date: -1 })
      .limit(100);
    res.json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/weight
// @desc    Get all weight logs from all users (admin only)
// @access  Private/Admin
router.get('/weight', auth, admin, async (req, res) => {
  try {
    const weights = await Weight.find()
      .populate('user', 'name email')
      .sort({ date: -1 })
      .limit(100);
    res.json(weights);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/goals
// @desc    Get all goals from all users (admin only)
// @access  Private/Admin
router.get('/goals', auth, admin, async (req, res) => {
  try {
    const goals = await Goal.find()
      .populate('user', 'name email')
      .sort({ date: -1 })
      .limit(100);
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user (admin only)
// @access  Private/Admin
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Delete all user data
    await Workout.deleteMany({ user: req.params.id });
    await Nutrition.deleteMany({ user: req.params.id });
    await Weight.deleteMany({ user: req.params.id });
    await Goal.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'User and all associated data removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
