import express from 'express';
import multer from 'multer';
import { getAllFeedbacks, submitFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

// configure multer storage (optional)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST route for form submission
feedbackRouter.post("/", upload.single("screenshot"), submitFeedback);

// GET route (for admin panel or analytics)
feedbackRouter.get("/", getAllFeedbacks);

export default feedbackRouter;