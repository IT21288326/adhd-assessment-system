// models/QuestionnaireResponse.js
import mongoose from 'mongoose';

const questionnaireResponseSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  responses: { type: Map, of: Number, required: true }, // Key-value pairs for questions and responses
  inattentiveScore: { type: Number, default: 0 },
  hyperactiveImpulsiveScore: { type: Number, default: 0 },
  combinedScore: { type: Number, default: 0 },
  subtype: { type: String, enum: ['Inattentive', 'Hyperactive-Impulsive', 'Combined', 'None'], default: 'None' },
  createdAt: { type: Date, default: Date.now },
});

const QuestionnaireResponse = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);

export default QuestionnaireResponse;
