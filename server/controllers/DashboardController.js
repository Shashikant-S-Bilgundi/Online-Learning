// controllers/classController.js
import Dashboard from "../models/Dashboard.js";

// GET all classes (optionally filter)
export const getAllDashboards = async (req, res) => {
  try {
    const { subject, date, q } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (date) filter.date = date;
    if (q) filter.title = { $regex: q, $options: "i" };

    const classes = await Dashboard.find(filter);
    res.json({ success: true, data: classes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST a new class
export const createDashboards = async (req, res) => {
  try {
    const newClass = new Dashboard(req.body);
    await newClass.save();
    res.json({ success: true, data: newClass });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
