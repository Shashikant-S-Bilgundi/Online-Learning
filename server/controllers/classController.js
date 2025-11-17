import Class from '../models/classModel.js';


// @desc Get all classes (with filters)
// @route GET /api/classes
export const getAllClasses = async (req, res) => {
  try {
    const { subject, track, date, q, tab } = req.query;

    let filter = {};

    if (subject && subject !== 'All') filter.subject = subject;
    if (track && track !== 'All') filter.track = track;
    if (date) filter.date = date;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const today = new Date();

    const allClasses = await Class.find(filter).sort({ date: 1, start: 1 });

    let filtered = allClasses;

    if (tab === 'Upcoming') {
      filtered = allClasses.filter(c => new Date(`${c.date}T${c.start}:00`) >= today);
    } else if (tab === 'Past') {
      filtered = allClasses.filter(c => new Date(`${c.date}T${c.start}:00`) < today);
    }

    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc Get single class
// @route GET /api/classes/:id
export const getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.status(200).json({ success: true, data: cls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc Create new class
// @route POST /api/classes
export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// @desc Update a class
// @route PUT /api/classes/:id
export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Class not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc Delete a class
// @route DELETE /api/classes/:id
export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Class not found' });
    res.status(200).json({ success: true, message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc Book or unbook a seat
// @route POST /api/classes/:id/book
export const toggleBook = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });

    const { action } = req.body; // "book" or "unbook"

    if (action === 'book') {
      if (cls.booked >= cls.seats) {
        return res.status(400).json({ success: false, message: 'No seats available' });
      }
      cls.booked += 1;
    } else if (action === 'unbook') {
      cls.booked = Math.max(0, cls.booked - 1);
    }

    await cls.save();
    res.status(200).json({ success: true, data: cls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};