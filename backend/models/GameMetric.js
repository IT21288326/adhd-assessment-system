// // models/GameMetric.js
// import mongoose from 'mongoose';

// const gameMetricSchema = new mongoose.Schema({
//   childId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Child', // Reference to the Child model
//     required: true 
//   },
//   reactionTimes: { type: [Number], required: true },
//   averageReactionTime: { type: Number, required: true },
//   correctStreak: { type: Number, required: true },
//   prematureClicks: { type: Number, required: true },
//   missedStars: { type: Number, required: true },
//   score: { type: Number, required: true },

//   createdAt: { type: Date, default: Date.now }
// });

// const GameMetric = mongoose.model('GameMetric', gameMetricSchema);
// export default GameMetric;

import mongoose from 'mongoose';

const gameMetricSchema = new mongoose.Schema({
  childId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Child', 
    required: true,
    index: true 
  },
  reactionTimes: { 
    type: [Number], 
    required: true,
    validate: {
      validator: (arr) => arr.every(num => num >= 0),
      message: 'Reaction times must be non-negative'
    }
  },
  reactionTimeVariability: { 
    type: Number, 
    default: 0, 
    min: 0 
  }, 
  averageReactionTime: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  missedStarStreaks: { 
    type: [Number], 
    default: [], 
    validate: {
      validator: (arr) => arr.every(num => num > 0),
      message: 'Missed streaks must be positive'
    } 
  }, 
  // clickTimestamps: { 
  //   type: [{ timestamp: Number, type: String }], 
  //   default: [], 
  //   validate: {
  //     validator: (arr) => arr.every(obj => obj.timestamp >= 0 && ['valid', 'premature'].includes(obj.type)),
  //     message: 'Invalid click event data'
  //   } 
  // },
  clickTimestamps: { 
    type: [{
      timestamp: { type: Number, required: true },
      type: { type: String, enum: ['valid', 'premature'], required: true }
    }], 
    default: [], 
    validate: {
      validator: (arr) => arr.every(obj => obj.timestamp >= 0 && ['valid', 'premature'].includes(obj.type)),
      message: 'Invalid click event data'
    } 
  },
  correctStreak: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  prematureClicks: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  missedStars: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  score: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  sessionDuration: { 
    type: Number, 
    default: 0, 
    min: 0 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index: true 
  }
});

// Create index for performance optimization
gameMetricSchema.index({ childId: 1, createdAt: -1 });

const GameMetric = mongoose.model('GameMetric', gameMetricSchema);

export default GameMetric;
