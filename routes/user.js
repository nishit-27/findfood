import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import moment from 'moment-timezone';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/add-calories', authMiddleware, async (req, res) => {
  try {
    const { calories, foodName, timestamp, quantity } = req.body;
    const user = await User.findById(req.userId);
    const userTimezone = user.timezone || 'UTC';
    const today = moment().tz(userTimezone).startOf('day').toDate();

    const todayIntake = user.calorieIntake.find(intake => 
      moment(intake.date).tz(userTimezone).startOf('day').isSame(today)
    );

    if (todayIntake) {
      todayIntake.calories += calories;
      todayIntake.foodItems.push({ name: foodName, calories, timestamp, quantity });
    } else {
      user.calorieIntake.push({ 
        date: today, 
        calories, 
        foodItems: [{ name: foodName, calories, timestamp, quantity }]
      });
    }

    await user.save();
    res.json({ message: 'Calories and food item added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/calorie-intake', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const userTimezone = user.timezone || 'UTC'; // Default to UTC if not set
    const today = moment().tz(userTimezone).startOf('day').toDate();

    const todayIntake = user.calorieIntake.find(intake => 
      moment(intake.date).tz(userTimezone).startOf('day').isSame(today)
    );

    res.json({ 
      calories: todayIntake ? todayIntake.calories : 0, 
      goal: user.dailyCalorieGoal,
      foodItems: todayIntake ? todayIntake.foodItems : []
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update-calories', authMiddleware, async (req, res) => {
  try {
    const { date, calories } = req.body;
    if (!date || !calories) {
      return res.status(400).json({ error: 'Date and calories are required' });
    }

    const user = await User.findById(req.userId);
    const targetDate = new Date(date).setHours(0, 0, 0, 0);
    const intakeIndex = user.calorieIntake.findIndex(intake => intake.date.setHours(0, 0, 0, 0) === targetDate);

    if (intakeIndex !== -1) {
      user.calorieIntake[intakeIndex].calories = calories;
    } else {
      user.calorieIntake.push({ date: targetDate, calories });
    }

    await user.save();
    res.json({ message: 'Calories updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update-calorie-goal', authMiddleware, async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || typeof goal !== 'number' || goal <= 0) {
      return res.status(400).json({ error: 'Invalid calorie goal' });
    }

    const user = await User.findById(req.userId);
    user.dailyCalorieGoal = goal;
    await user.save();

    res.json({ message: 'Calorie goal updated successfully', goal: user.dailyCalorieGoal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete-food-item', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.userId);
    const userTimezone = user.timezone || 'UTC';
    const today = moment().tz(userTimezone).startOf('day').toDate();

    const todayIntakeIndex = user.calorieIntake.findIndex(intake => 
      moment(intake.date).tz(userTimezone).startOf('day').isSame(today)
    );

    if (todayIntakeIndex !== -1) {
      const todayIntake = user.calorieIntake[todayIntakeIndex];
      const itemIndex = todayIntake.foodItems.findIndex(item => item._id.toString() === itemId);
      if (itemIndex !== -1) {
        const removedCalories = todayIntake.foodItems[itemIndex].calories;
        todayIntake.calories -= removedCalories;
        todayIntake.foodItems.splice(itemIndex, 1);
        await user.save();
        res.json({ message: 'Food item deleted successfully', removedCalories });
      } else {
        res.status(404).json({ error: 'Food item not found' });
      }
    } else {
      res.status(404).json({ error: 'No intake found for today' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
