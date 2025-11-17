import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  subjects: [{ type: String }],
  languages: [{ type: String }],
  city: { type: String },
  price: { type: Number, required: true },
  sessions: { type: Number, default: 0 },
  availability: { type: String },
  photo: { type: String },
  tag: { type: String },
});

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;