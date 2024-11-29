// models/ADHDData.js
import mongoose from 'mongoose';

const adhdDataSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  gameMetrics: {
    reactionTimes: [Number],
    averageReactionTime: Number,
    correctStreak: Number,
    prematureClicks: Number,
    missedStars: Number,
    score: Number,
  },
  questionnaireResults: {
    inattentiveScore: Number,
    hyperactiveImpulsiveScore: Number,
    combinedScore: Number,
    subtype: String, // 'Inattentive', 'Hyperactive-Impulsive', 'Combined'
  },
  modelPrediction: { type: String, default: null }, // Predicted ADHD subtype
  createdAt: { type: Date, default: Date.now },
});

const ADHDData = mongoose.model('ADHDData', adhdDataSchema);
export default ADHDData;
