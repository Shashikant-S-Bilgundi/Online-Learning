import Resource from "../models/Resource.js";

// Get all resources with optional filters
export const getResources = async (req, res) => {
  try {
    const { category, level, format, q } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (level && level !== "All") filter.level = level;
    if (format && format !== "All") filter.format = format;
    if (q) filter.title = { $regex: q, $options: "i" }; // case-insensitive search

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Optional: Add new resource
export const addResource = async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    await newResource.save();
    res.status(201).json({ success: true, data: newResource });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Invalid data" });
  }
};
