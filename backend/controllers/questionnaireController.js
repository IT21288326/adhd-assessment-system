// controllers/questionnaireController.js
import { vadprsQuestions } from '../utils/questions.js';
import QuestionnaireResponse from '../models/QuestionnaireResponse.js';

// Fetch VADPRS Questions
export const getQuestions = (req, res) => {
  try {
    res.status(200).json(vadprsQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit Questionnaire Responses
export const submitResponses = async (req, res) => {
  const { childId, responses } = req.body;

  try {
    // Scoring Logic
    let inattentiveScore = 0;
    let hyperactiveImpulsiveScore = 0;

    Object.entries(responses).forEach(([key, value]) => {
      const questionId = parseInt(key, 10);
      if (questionId >= 1 && questionId <= 9 && value >= 2) inattentiveScore++;
      if (questionId >= 10 && questionId <= 18 && value >= 2) hyperactiveImpulsiveScore++;
    });

    const combinedScore = inattentiveScore + hyperactiveImpulsiveScore;
    let subtype = 'None';
    if (inattentiveScore >= 6 && hyperactiveImpulsiveScore >= 6) subtype = 'Combined';
    else if (inattentiveScore >= 6) subtype = 'Inattentive';
    else if (hyperactiveImpulsiveScore >= 6) subtype = 'Hyperactive-Impulsive';

    // Save Response
    const response = new QuestionnaireResponse({
      childId,
      responses,
      inattentiveScore,
      hyperactiveImpulsiveScore,
      combinedScore,
      subtype,
    });

    await response.save();
    res.status(201).json({ message: 'Questionnaire submitted successfully', subtype });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
