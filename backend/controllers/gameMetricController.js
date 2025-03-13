// controllers/gameMetricController.js
// import GameMetric from '../models/GameMetric.js';

// export const createGameMetric = async (req, res) => {
//   try {
//     const { reactionTimes, averageReactionTime, correctStreak, prematureClicks, missedStars, score, childId } = req.body;

//     // Validate required fields
//     if (!reactionTimes || typeof averageReactionTime !== 'number' || typeof correctStreak !== 'number' ||
//         typeof prematureClicks !== 'number' || typeof missedStars !== 'number' || typeof score !== 'number' ||
//         !childId) {
//       return res.status(400).json({ error: 'Invalid input data' });
//     }

//     const gameMetric = new GameMetric({
//       reactionTimes,
//       averageReactionTime,
//       correctStreak,
//       prematureClicks,
//       missedStars,
//       score,
//       childId,
//     });

//     const savedMetric = await gameMetric.save();
//     res.status(201).json(savedMetric);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };


// export const getAllGameMetrics = async (req, res) => {
//   try {
//     const gameMetrics = await GameMetric.find();
//     res.status(200).json(gameMetrics);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

//import GameMetric from '../models/GameMetric.js';

// export const createGameMetric = async (req, res) => {
//   try {
//     const { reactionTimes, averageReactionTime, correctStreak, prematureClicks, missedStars, score, clickTimestamps, childId } = req.body;

//     if (!reactionTimes?.length || !childId || [averageReactionTime, correctStreak, prematureClicks, missedStars, score].some(val => typeof val !== 'number')) {
//       return res.status(400).json({ error: 'Invalid input data' });
//     }

//     const reactionTimeVariability = reactionTimes.length > 1 
//       ? Math.sqrt(reactionTimes.reduce((sum, t) => sum + Math.pow(t - averageReactionTime, 2), 0) / reactionTimes.length)
//       : 0;

//     const missedStarStreaks = missedStars.reduce((streaks, miss, index, arr) => {
//       if (miss) {
//         streaks.currentStreak++;
//       } else if (streaks.currentStreak > 0) {
//         streaks.data.push(streaks.currentStreak);
//         streaks.currentStreak = 0;
//       }
//       if (index === arr.length - 1 && streaks.currentStreak > 0) streaks.data.push(streaks.currentStreak);
//       return streaks;
//     }, { data: [], currentStreak: 0 }).data;

//     const gameMetric = new GameMetric({
//       reactionTimes,
//       reactionTimeVariability,
//       averageReactionTime,
//       missedStarStreaks,
//       clickTimestamps,
//       correctStreak,
//       prematureClicks,
//       missedStars,
//       score,
//       childId
//     });

//     const savedMetric = await gameMetric.save();
//     res.status(201).json(savedMetric);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// export const getAllGameMetrics = async (req, res) => {
//   try {
//     const gameMetrics = await GameMetric.find();
//     res.status(200).json(gameMetrics);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };
// import GameMetric from '../models/GameMetric.js';

// export const createGameMetric = async (req, res) => {
//   try {
//     const { reactionTimes, averageReactionTime, correctStreak, prematureClicks, missedStars, score, clickTimestamps, childId } = req.body;

//     if (!Array.isArray(reactionTimes) || reactionTimes.length === 0 ||
//         !childId || [averageReactionTime, correctStreak, prematureClicks, missedStars, score].some(val => typeof val !== 'number')) {
//       return res.status(400).json({ error: 'Invalid input data' });
//     }

//     // Calculate reaction time variability (Standard Deviation)
//     const reactionTimeVariability = reactionTimes.length > 1 
//       ? Math.sqrt(reactionTimes.reduce((sum, t) => sum + Math.pow(t - averageReactionTime, 2), 0) / reactionTimes.length)
//       : 0;

//     // Calculate missed star streaks
//     const missedStarArray = Array.isArray(req.body.missedStarArray) ? req.body.missedStarArray : [];
//     const missedStarStreaks = missedStarArray.reduce((streaks, miss) => {
//       if (miss) {
//         streaks.currentStreak++;
//       } else if (streaks.currentStreak > 0) {
//         streaks.data.push(streaks.currentStreak);
//         streaks.currentStreak = 0;
//       }
//       return streaks;
//     }, { data: [], currentStreak: 0 }).data;

//     if (missedStarStreaks.length === 0) missedStarStreaks.push(0);

//     // Validate click timestamps
//     if (!Array.isArray(clickTimestamps) || !clickTimestamps.every(obj => obj.timestamp >= 0 && ['valid', 'premature'].includes(obj.type))) {
//       return res.status(400).json({ error: 'Invalid click timestamps data' });
//     }

//     const gameMetric = new GameMetric({
//       reactionTimes,
//       reactionTimeVariability,
//       averageReactionTime,
//       missedStarStreaks,
//       clickTimestamps,
//       correctStreak,
//       prematureClicks,
//       missedStars,
//       score,
//       childId
//     });

//     const savedMetric = await gameMetric.save();
//     res.status(201).json(savedMetric);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

export const getAllGameMetrics = async (req, res) => {
  try {
    const gameMetrics = await GameMetric.find().sort({ createdAt: -1 });
    res.status(200).json(gameMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

import GameMetric from '../models/GameMetric.js';

// export const createGameMetric = async (req, res) => {
//   try {
//     const {
//       reactionTimes = [], // Allow empty array
//       averageReactionTime = 0,
//       correctStreak = 0,
//       prematureClicks = 0,
//       missedStars = 0,
//       score = 0,
//       clickTimestamps = [], // Allow empty array
//       missedStarStreaks = [], // Allow default empty array
//       childId
//     } = req.body;

//     // Validate required fields
//     if (!childId || [averageReactionTime, correctStreak, prematureClicks, missedStars, score].some(val => typeof val !== 'number')) {
//       return res.status(400).json({ error: 'Invalid input data' });
//     }

//     // Calculate reaction time variability (Standard Deviation)
//     const reactionTimeVariability =
//       reactionTimes.length > 1
//         ? Math.sqrt(
//             reactionTimes.reduce((sum, t) => sum + Math.pow(t - averageReactionTime, 2), 0) /
//               reactionTimes.length
//           )
//         : 0;

//     // Ensure `clickTimestamps` follows schema
//     if (!Array.isArray(clickTimestamps)) {
//       return res.status(400).json({ error: 'clickTimestamps must be an array' });
//     }

//     // Ensure `missedStarStreaks` follows schema
//     if (!Array.isArray(missedStarStreaks) || !missedStarStreaks.every(num => num >= 0)) {
//       return res.status(400).json({ error: 'Invalid missedStarStreaks data' });
//     }

//     // Create new GameMetric record
//     const gameMetric = new GameMetric({
//       reactionTimes,
//       reactionTimeVariability,
//       averageReactionTime,
//       missedStarStreaks,
//       clickTimestamps,
//       correctStreak,
//       prematureClicks,
//       missedStars,
//       score,
//       childId
//     });

//     const savedMetric = await gameMetric.save();
//     res.status(201).json(savedMetric);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

//import GameMetric from '../models/GameMetric.js';

export const createGameMetric = async (req, res) => {
  try {
    const {
      reactionTimes = [], // Allow empty array
      averageReactionTime = 0,
      correctStreak = 0,
      prematureClicks = 0,
      missedStars = 0,
      score = 0,
      clickTimestamps = [], // Allow empty array
      missedStarStreaks = [], // Allow default empty array
      childId
    } = req.body;

    // Validate required fields
    if (!childId || [averageReactionTime, correctStreak, prematureClicks, missedStars, score].some(val => typeof val !== 'number')) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Calculate reaction time variability (Standard Deviation)
    const reactionTimeVariability =
      reactionTimes.length > 1
        ? Math.sqrt(
            reactionTimes.reduce((sum, t) => sum + Math.pow(t - averageReactionTime, 2), 0) /
              reactionTimes.length
          )
        : 0;

        if (!Array.isArray(clickTimestamps) || !clickTimestamps.every(obj => 
          typeof obj === "object" && 
          typeof obj.timestamp === "number" && 
          ["valid", "premature"].includes(obj.type))) {
        return res.status(400).json({ error: "Invalid clickTimestamps format" });
      }

    // Ensure `missedStarStreaks` follows schema
    if (!Array.isArray(missedStarStreaks) || !missedStarStreaks.every(num => num >= 0)) {
      return res.status(400).json({ error: 'Invalid missedStarStreaks data' });
    }

    // Create new GameMetric record
    const gameMetric = new GameMetric({
      reactionTimes,
      reactionTimeVariability,
      averageReactionTime,
      missedStarStreaks,
      clickTimestamps,
      correctStreak,
      prematureClicks,
      missedStars,
      score,
      childId
    });

    const savedMetric = await gameMetric.save();
    res.status(201).json(savedMetric);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};