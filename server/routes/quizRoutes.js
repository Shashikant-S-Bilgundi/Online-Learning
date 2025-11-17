import express from 'express';
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById, updateQuiz } from '../controllers/quizController.js';

const quizRouter = express.Router();

quizRouter.get('/', getAllQuizzes);
quizRouter.get('/:id', getQuizById);
quizRouter.post('/', createQuiz);
quizRouter.put('/:id', updateQuiz);
quizRouter.delete('/:id', deleteQuiz);

export default quizRouter;