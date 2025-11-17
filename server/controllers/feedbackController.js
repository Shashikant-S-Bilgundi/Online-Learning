import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const {
      category,
      rating,
      tags,
      message,
      name,
      email,
      anonymous,
      contactBack,
      fileName,
    } = req.body;

    // Basic validation
    if (!category || !message || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const feedback = new Feedback({
      category,
      rating,
      tags,
      message,
      name,
      email,
      anonymous,
      contactBack,
      fileName,
    });

    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback saved successfully... ✅" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ success: false, message: "Server error while saving feedback." });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedbacks." });
  }
};