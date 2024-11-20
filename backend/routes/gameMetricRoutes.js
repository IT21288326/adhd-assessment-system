// routes/gameMetricRoutes.js
import express from 'express';
import { createGameMetric, getAllGameMetrics } from '../controllers/gameMetricController.js';

const router = express.Router();

router.post('/create', createGameMetric);
router.get('/all', getAllGameMetrics);

export default router;
