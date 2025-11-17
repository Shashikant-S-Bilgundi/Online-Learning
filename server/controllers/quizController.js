import Quiz from "../models/Quiz.js";

// Get all quizzes (titles only)
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title');
    res.json({ success: true, data: quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single quiz with questions
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json({ success: true, data: newQuiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.json({ success: true, data: updatedQuiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.json({ success: true, message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};