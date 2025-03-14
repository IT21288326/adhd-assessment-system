// routes/gameMetricRoutes.js
import express from 'express';
import { createGameMetric, getAllGameMetrics, getGameMetric } from '../controllers/gameMetricController.js';

const router = express.Router();

router.post('/create', createGameMetric);
router.get('/all', getAllGameMetrics);
router.get('/:childId/:gameId', getGameMetric);

export default router;
