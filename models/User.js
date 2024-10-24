import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dailyCalorieGoal: { type: Number, default: 2000 },
  calorieIntake: [{
    date: { type: Date, default: Date.now },
    calories: { type: Number, default: 0 },
    foodItems: [{
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      timestamp: { type: Date, required: true },
      quantity: { type: Number, required: true, default: 1 }
    }]
  }],
  timezone: { type: String, required: true, default: 'UTC' } // Default to UTC
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
