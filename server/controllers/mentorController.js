import Mentor from "../models/Mentor.js";
import Booking from "../models/Booking.js";

// Get all mentors with optional filters
export const getMentors = async (req, res) => {
  try {
    const { subject, city, sort, q } = req.query;
    let filter = {};

    if (subject && subject !== "All") filter.subjects = { $regex: subject, $options: "i" };
    if (city && city !== "All") filter.city = city;
    if (q) filter.name = { $regex: q, $options: "i" };

    let mentors = await Mentor.find(filter);

    if (sort === "rating") mentors.sort((a, b) => b.rating - a.rating);
    else if (sort === "priceLow") mentors.sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") mentors.sort((a, b) => b.price - a.price);
    else mentors.sort((a, b) => b.sessions - a.sessions);

    res.json({ success: true, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Book a session
export const bookMentor = async (req, res) => {
  try {
    const { mentorId, date, time, duration, userEmail } = req.body;
    if (!mentorId || !date || !time || !userEmail) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    const booking = new Booking({
      mentor: mentorId,
      date,
      time,
      duration: duration || 45,
      price: mentor.price,
      userEmail,
    });

    await booking.save();
    res.json({ success: true, message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};