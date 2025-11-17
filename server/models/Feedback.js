import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Platform", "Courses", "Classes", "AI Teacher", "Payments", "App Performance", "Other"],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String }],
    message: { type: String, required: true, maxlength: 600 },
    name: { type: String },
    email: { type: String },
    anonymous: { type: Boolean, default: false },
    contactBack: { type: Boolean, default: true },
    fileName: { type: String },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;