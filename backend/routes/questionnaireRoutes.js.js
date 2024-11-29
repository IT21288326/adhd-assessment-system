// routes/questionnaireRoutes.js
import express from 'express';
import { getQuestions, submitResponses } from '../controllers/questionnaireController.js';
import { isAuthenticated } from '../controllers/auth.js';

const router = express.Router();

// Routes
router.get('/questions',isAuthenticated, getQuestions);
router.post('/submit', submitResponses);

export default router;
