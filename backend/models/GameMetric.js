// models/GameMetric.js
import mongoose from 'mongoose';

const gameMetricSchema = new mongoose.Schema({
  childId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Child', // Reference to the Child model
    required: true 
  },
  reactionTimes: { type: [Number], required: true },
  averageReactionTime: { type: Number, required: true },
  correctStreak: { type: Number, required: true },
  prematureClicks: { type: Number, required: true },
  missedStars: { type: Number, required: true },
  score: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

const GameMetric = mongoose.model('GameMetric', gameMetricSchema);
export default GameMetric;
