const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedAdmin();
  })
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Seed admin user on startup
async function seedAdmin() {
  const User = require('./models/User');
  try {
    const adminEmail = 'adminhu@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('adminhu', salt);
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
      console.log('Admin user created: adminhu@gmail.com');
    } else {
      // Ensure the existing user has isAdmin set to true
      if (!admin.isAdmin) {
        admin.isAdmin = true;
        await admin.save();
        console.log('Existing user promoted to admin: adminhu@gmail.com');
      }
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
}

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/nutrition', require('./routes/nutrition'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/weight', require('./routes/weight'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
