// controllers/gameMetricController.js
import GameMetric from '../models/GameMetric.js';

export const createGameMetric = async (req, res) => {
  try {
    const { reactionTimes, averageReactionTime, correctStreak, prematureClicks, missedStars, score, childId } = req.body;

    // Validate required fields
    if (!reactionTimes || typeof averageReactionTime !== 'number' || typeof correctStreak !== 'number' ||
        typeof prematureClicks !== 'number' || typeof missedStars !== 'number' || typeof score !== 'number' ||
        !childId) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const gameMetric = new GameMetric({
      reactionTimes,
      averageReactionTime,
      correctStreak,
      prematureClicks,
      missedStars,
      score,
      childId,
    });

    const savedMetric = await gameMetric.save();
    res.status(201).json(savedMetric);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


export const getAllGameMetrics = async (req, res) => {
  try {
    const gameMetrics = await GameMetric.find();
    res.status(200).json(gameMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
