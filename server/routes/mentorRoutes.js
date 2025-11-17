import express from 'express';
import { bookMentor, getMentors } from '../controllers/mentorController.js';

const mentorRouter = express.Router();

// Get mentors
mentorRouter.get("/", getMentors);

// Book a mentor session
mentorRouter.post("/book", bookMentor);

export default mentorRouter;