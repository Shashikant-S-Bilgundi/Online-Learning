import Course from "../models/courseModel.js";

// ✅ Get all courses (with filters and search)
export const getAllCourses = async (req, res) => {
  try {
    const { q, category, level, sort } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (level && level !== "All") filter.level = level;
    if (q) filter.title = { $regex: q, $options: "i" };

    let courses = await Course.find(filter);

    if (sort === "rating") courses.sort((a, b) => b.rating - a.rating);
    else if (sort === "new") courses.sort((a, b) => b.createdAt - a.createdAt);
    else courses.sort((a, b) => b.students - a.students);

    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get one course
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ Add a course
export const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ success: true, data: newCourse });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};


// ✅ Update a course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ id: req.params.id });
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
