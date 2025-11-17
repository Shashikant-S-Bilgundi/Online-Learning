import express from "express";
import { askAITeacher, getChatHistory } from "../controllers/aiTeacherController.js";

const router = express.Router();

router.post("/ask", askAITeacher);
router.get("/history/:userId", getChatHistory);

export default router;