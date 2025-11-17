import Opportunity from "../models/Opportunity.js";

/** Get all opportunities with optional filters and sorting */
export const getOpportunities = async (req, res) => {
  try {
    const { kind, mode, location, q, sort } = req.query;

    let filter = {};
    if (kind && kind !== "All") filter.kind = kind;
    if (mode && mode !== "Any") filter.mode = mode;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } }
    ];

    let query = Opportunity.find(filter);

    // Sorting
    if (sort === "rating") query = query.sort({ rating: -1 });
    else if (sort === "alpha") query = query.sort({ title: 1 });
    else query = query.sort({ createdAt: -1 }); // default: most recent

    const opportunities = await query;
    res.json({ success: true, data: opportunities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** Get opportunity by ID */
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: opportunity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
