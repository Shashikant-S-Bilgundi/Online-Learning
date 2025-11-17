import Progress from "../models/progressModel.js";

// GET progress by userId
export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }
    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create new progress data
export const createProgress = async (req, res) => {
  try {
    const newProgress = new Progress(req.body);
    const saved = await newProgress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update progress by userId
export const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await Progress.findOneAndUpdate({ userId }, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};