import express from 'express';
import { createClass, deleteClass, getAllClasses, getClassById, toggleBook, updateClass } from '../controllers/classController.js';

const classRouter = express.Router();

classRouter.get('/', getAllClasses);
classRouter.get('/:id', getClassById);
classRouter.post('/', createClass);
classRouter.put('/:id', updateClass);
classRouter.delete('/:id', deleteClass);

// Booking
classRouter.post('/:id/book', toggleBook);

export default classRouter;