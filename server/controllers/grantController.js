import Grant from "../models/grantModel.js";

// GET all grants (with optional filters & search)
export const getGrants = async (req, res) => {
  try {
    const { kind, source, state, q, sort } = req.query;

    let query = {};

    if (kind && kind !== "All") query.kind = kind;
    if (source && source !== "Any") query.source = source;
    if (state && state !== "Any") query.state = state;

    if (q) {
      const regex = new RegExp(q, "i");
      query.$or = [
        { title: regex },
        { desc: regex },
        { tags: regex },
        { authority: regex },
      ];
    }

    let grants = await Grant.find(query);

    // sorting logic
    if (sort === "deadline") {
      grants = grants.sort((a, b) => {
        const da = new Date(a.deadline).getTime() || Infinity;
        const db = new Date(b.deadline).getTime() || Infinity;
        return da - db;
      });
    } else if (sort === "amount") {
      const toValue = (a) => Number((a.amount || "").replace(/[^\d.]/g, "")) || 0;
      grants = grants.sort((a, b) => toValue(b) - toValue(a));
    } else if (sort === "alpha") {
      grants = grants.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.json({ success: true, count: grants.length, data: grants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE a new grant
export const createGrant = async (req, res) => {
  try {
    const grant = await Grant.create(req.body);
    res.status(201).json({ success: true, data: grant });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE grant
export const updateGrant = async (req, res) => {
  try {
    const grant = await Grant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: grant });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE grant
export const deleteGrant = async (req, res) => {
  try {
    await Grant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Grant deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};