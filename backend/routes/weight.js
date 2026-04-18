const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Weight = require('../models/Weight');

// @route   GET api/weight
// @desc    Get all users weight logs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const weightLogs = await Weight.find({ user: req.user.id }).sort({ date: 1 });
    res.json(weightLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/weight
// @desc    Add new weight log
// @access  Private
router.post('/', auth, async (req, res) => {
  const { weight, date } = req.body;

  try {
    const newWeight = new Weight({
      weight,
      date,
      user: req.user.id
    });

    const weightLog = await newWeight.save();
    res.json(weightLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/weight/:id
// @desc    Delete a weight log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let weightLog = await Weight.findById(req.params.id);

    if (!weightLog) return res.status(404).json({ msg: 'Weight log not found' });

    if (weightLog.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Weight.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Weight log removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
